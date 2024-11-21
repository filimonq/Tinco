from database import Base
from sqlalchemy import Column, Integer, String

class User_reg(Base):
    __tablename__ = 'users_REG'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
