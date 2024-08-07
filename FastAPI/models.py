from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, index=True)  # 올바른 인덴트
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    is_income = Column(Boolean)
    date = Column(String)

class Todo(Base):
    __tablename__ = 'todo'
    
    id = Column(Integer, primary_key=True, index=True)  
    date = Column(String) 
    done = Column(Boolean)
    content = Column(String)