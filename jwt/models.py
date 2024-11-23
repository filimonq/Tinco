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
    chrom = Column(Integer)
    pos = Column(Integer)
    ref = Column(String)
    alt = Column(String)
    feature = Column(String)
    beta = Column(Float)
    cow_genotype = Column(String)
    cow_id = Column(String, ForeignKey('cows.id'))

    cow = relationship("Cow", back_populates="mutations") 

class Cow(Base):
    __tablename__ = 'cows'

    id = Column(String, primary_key=True)
    owner_id = Column(Integer, ForeignKey('users_REG.id')) 
    pedigree = Column(String)
    birth = Column(String)
    age = Column(Integer)
    father_ID = Column(String) #
    mother_ID = Column(String) #
    milk_yield = Column(Float) 
    fatness = Column(Integer)
    inbreeding_coefficient = Column(Float)
    weight_gain = Column(Float)
    health = Column(Integer)
    fertility = Column(Integer)
    genetic_value = Column(Integer)

    owner = relationship("User_reg", back_populates="cows")
    mutations = relationship("Mutations", back_populates="cow")
