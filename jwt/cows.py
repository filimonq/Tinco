from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from models import Cow, User_reg, Mutations
from database import SessionLocal
from typing import List
from typing import Annotated
from sqlalchemy.orm import Session
from auth import get_current_user
from database import engine, Base
import pandas as pd
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import uuid

router = APIRouter(prefix="/cows", tags=["Cows"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/upload-files/")
async def upload_files(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    file1_contents = await file1.read()
    file2_contents = await file2.read()

    cows_df = pd.read_excel(BytesIO(file1_contents))
    mutations_df = pd.read_excel(BytesIO(file2_contents))

    cows_data = cows_df.to_dict(orient='records')

    db_session = next(get_db())

    for row in cows_data:
        cow = Cow(
            id=str(row.get('ID_особи')),
            sex=str(row.get('Пол')) if row.get('Пол') else None,
            pedigree=str(row.get('Порода')) if row.get('Порода') else None,
            birth=str(row.get('Дата_Рождения')) if row.get('Дата_Рождения') else None,
            father_ID=str(row.get('Родитель_папа')) if row.get('Родитель_папа') else None,
            mother_ID=str(row.get('Родитель_мама')) if row.get('Родитель_мама') else None,
            milk_yield=str(row.get('Удой л/день')) if row.get('Удой л/день') else None,
            fatness=str(row.get('Упитанность')) if row.get('Упитанность') else None,
            inbreeding_coefficient=str(row.get('Коэффициент инбридинга (F)')) if row.get('Коэффициент инбридинга (F)') else None,
            weight_gain=str(row.get('Прирост веса кг/день')) if row.get('Прирост веса кг/день') else None,
            health=str(row.get('Здоровье (1-10)')) if row.get('Здоровье (1-10)') else None,
            fertility=str(row.get('Фертильность (%)')) if row.get('Фертильность (%)') else None,
            genetic_value=str(row.get('Генетическая ценность (баллы)')) if row.get('Генетическая ценность (баллы)') else None
            # owner_id = user_id какой то там
        )
        db_session.add(cow)

    mutations_data = mutations_df.to_dict(orient='records')

    for row in mutations_data:
        mutation = Mutations(
            mutation_id=str(row.get('mutation_id')),
            chrom=str(row.get('chrom')) if row.get('chrom') else None,
            pos=str(row.get('pos')) if row.get('pos') else None,
            ref=str(row.get('ref')) if row.get('ref') else None,
            alt=str(row.get('alt')) if row.get('alt') else None,
            feature=str(row.get('Признак')) if row.get('Признак') else None,
            beta=str(row.get('beta')) if row.get('beta') else None,
            cow_genotype=str(row.get('Генотип коровы')) if row.get('Генотип коровы') else None,
            cow_id=str(row.get('ID_особи')) if row.get('ID_особи') else None
        )
        db_session.add(mutation)

    db_session.commit()
    return {"message": "Data loaded successfully"}