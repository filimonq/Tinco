from datetime import datetime, timedelta, timezone
from typing import List, Optional

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel
import sqlite3
from jose import JWTError

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = ""
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Модели Pydantic
class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    password: str 

class UserInDB(User):
    hashed_password: str

class Cow(BaseModel):
    cow_name: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

def init_db():
    conn = sqlite3.connect('users.sqlite3')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users_reg (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            full_name TEXT,
            hashed_password TEXT NOT NULL,
            disabled BOOLEAN NOT NULL DEFAULT 0
        )
    ''')
    
    # Создаем таблицу коров, если она не существует
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            cow_name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users_reg(id)
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Функции для работы с пользователями
def get_user(db, username: str):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users_reg WHERE username=?", (username,))
    row = cursor.fetchone()
    return UserInDB(**row) if row else None

def create_user(db, user: UserInDB):
    cursor = db.cursor()
    cursor.execute("INSERT INTO users_reg (username, email, full_name, hashed_password) VALUES (?, ?, ?, ?)",
                   (user.username, user.email, user.full_name, user.hashed_password))
    db.commit()

def create_cow(db, user_id: int, cow: Cow):
    cursor = db.cursor()
    cursor.execute("INSERT INTO users_info (user_id, cow_name) VALUES (?, ?)", (user_id, cow.cow_name))
    db.commit()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = sqlite3.connect('users.sqlite3')
    user = get_user(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=User)
async def register(user: User):
    db = sqlite3.connect('users.sqlite3')
    
    if get_user(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    
    user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    
    create_user(db, user_in_db)
    
    return user
