from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

class User_reg(Base):
    __tablename__ = 'users_REG'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)

    cows = relationship("Cow", back_populates="owner")

class Mutations(Base):
    __tablename__ = 'mutations'
    
    mutation_id = Column(String, primary_key=True)
    chrom = Column(String)
    pos = Column(String)
    ref = Column(String)
    alt = Column(String)
    feature = Column(String)
    beta = Column(String)
    cow_genotype = Column(String)
    cow_id = Column(String, ForeignKey('cows.id'))

    cow = relationship("Cow", back_populates="mutations") 

class Cow(Base):
    __tablename__ = 'cows'

    id = Column(Integer, primary_key=True, autoincrement=True)
    sex = Column(String)
    pedigree = Column(String)
    birth = Column(String)
    father_ID = Column(String)
    mother_ID = Column(String)
    milk_yield = Column(String)
    fatness = Column(String)
    inbreeding_coefficient = Column(String)
    weight_gain = Column(String)
    health = Column(String)
    fertility = Column(String)
    genetic_value = Column(String)
    owner_id = Column(String, ForeignKey('users_REG.id')) #

    owner = relationship("User_reg", back_populates="cows")
    mutations = relationship("Mutations", back_populates="cow")