from fastapi import APIRouter, Depends, HTTPException
from models import Cow, User_reg, Mutations
from database import SessionLocal
from typing import List
from typing import Annotated
from sqlalchemy.orm import Session
from auth import get_current_user
from database import engine, Base
import pandas as pd
from sqlalchemy.orm import sessionmaker

router = APIRouter(
    prefix="/cows", 
    tags=["Cows"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
# ниже чисто тест
cows_df = pd.read_excel('cows.xlsx')
mutations_df = pd.read_excel('mutations.xlsx')

cows_data = cows_df.to_dict(orient='records')
mutations_data = mutations_df.to_dict(orient='records')

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
for row in cows_data:
    cow = Cow(**row)
    session.add(cow)

for row in mutations_data:
    mutation = Mutations(**row)
    session.add(mutation)

session.commit()
print("Данные успешно загружены!")

###

@router.get("/", response_model=List[Cow])
async def list_cows(db: db_dependency, current_user: dict = Depends(get_current_user)):
    user = db.query(User_reg).filter(User_reg.id == current_user['id']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.cows

@router.post("/")
async def add_cow(cow: Cow, db: db_dependency, current_user: dict = Depends(get_current_user)):
    user = db.query(User_reg).filter(User_reg.id == current_user['id']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    cow.owner_id = user.id
    db.add(cow)
    db.commit()
    return {"message": f"{cow.id} cow successfully added."}

@router.delete("/{cow_id}")
async def delete_cow(cow_id: int, db: db_dependency, current_user: dict = Depends(get_current_user)):
    user = db.query(User_reg).filter(User_reg.id == current_user['id']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    cow = db.query(Cow).filter(Cow.id == cow_id, Cow.owner_id == user.id).first()
    if not cow:
        raise HTTPException(status_code=404, detail="Cow not found or you don't have permission to delete it.")
    db.delete(cow)
    db.commit()
    return {"message": f"Cow with ID {cow.id} deleted."}
