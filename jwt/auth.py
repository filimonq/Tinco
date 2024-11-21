from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel, EmailStr
from database import SessionLocal
from jose import JWTError
import jwt
import sqlite3
from models import User_reg

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = "3ehwo382fgy4ffh3h84gh83g72c442rr4r4hnrcnhcr3hcrhrhsa"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
app = FastAPI()

class Token(BaseModel):
    access_token: str
    token_type: str

class User_request(BaseModel):
    username: str
    email: EmailStr
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: User_request):
    existing_user = db.query(User_reg).filter(
        (User_reg.username == create_user_request.username) | 
        (User_reg.email == create_user_request.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already taken"
        )
    
    create_user_model = User_reg(
        username=create_user_request.username,
        email=create_user_request.email,
        hashed_password=pwd_context.hash(create_user_request.password),
    )
    db.add(create_user_model)
    db.commit()
    return {"message": "User created successfully"}


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db : db_dependency
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(user.username, user.id, timedelta(minutes=30))
    return {'access_token': token, 'token_type': 'bearer'}

def authenticate_user(db, identifier: str, password: str):
    user = db.query(User_reg).filter(
        (User_reg.username == identifier) | 
        (User_reg.email == identifier)
    ).first()
    
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)



def create_access_token(username: str, user_id: int, exp_delta: timedelta):
    to_encode = {'sub': username, 'id' : user_id}
    expire = datetime.now(timezone.utc) + exp_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        id: int = payload.get("id")
        if username is None or id is None:
            raise credentials_exception
        return {"username": username, "id": id}
    except JWTError:
        raise credentials_exception
    