# FastAPI와 관련된 모듈을 가져옴
from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine  # 데이터베이스 세션과 엔진을 가져옴
import models  # 데이터베이스 모델을 가져옴
from fastapi.middleware.cors import CORSMiddleware  # CORS 미들웨어를 가져옴

# FastAPI 애플리케이션 객체를 생성함
app = FastAPI()

# 허용할 출처 목록을 정의함
origins = [
    'http://localhost:5173'  # 프론트엔드 애플리케이션이 호스팅되는 URL을 허용함
]

# CORS 미들웨어를 추가하여 지정된 출처에서 오는 요청을 허용함
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 출처를 설정함
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# 거래 데이터의 기본 정보를 정의하는 *Pydantic 모델임
## Pydantic 모델 = 데이터를 확인하여 정확성을 보장하고, 다양한 형식으로 변환하는데 도움을 줌
class TransactionBase(BaseModel):
    amount: float  # 거래 금액
    category: str  # 거래 카테고리
    description: str  # 거래 설명
    is_income: bool  # 수입 여부 (True: 수입, False: 지출)
    date: str  # 거래 날짜
    
class TodoBase(BaseModel): #Todo의 기본 데이터 구조를 정의한다.
    date: str
    done: bool
    content:str

class TodoModel(TodoBase): #Todobase에 확장해서 todomodel을 만든다
# ts의 타입정의와 비슷한 역할을 한다.
    id: int
    class Config:
        orm_mode = True  # SQLAlchemy ORM 객체를 Pydantic 모델로 변환할 수 있도록 설정함
    

# 거래 데이터 모델로, ID가 포함된 Pydantic 모델임
class TransactionModel(TransactionBase):
    id: int  # 거래의 고유 ID
    
    class Config:
        orm_mode = True  # SQLAlchemy ORM 객체를 Pydantic 모델로 변환할 수 있도록 설정함

# *데이터베이스 세션을 생성하고 관리하는 함수임
## 데이터베이스 세션 = 데이터베이스와의 연결을 관리하며, SQL 쿼리 실행, 트랜잭션 처리, 데이터 읽기 및 쓰기를 담당
def get_db():
    db = SessionLocal()  # 새로운 데이터베이스 세션을 생성함
    try:
        yield db  # 데이터베이스 세션을 호출자에게 제공함
    finally:
        db.close()  # 작업이 끝난 후 세션을 종료함


db_dependency = Annotated[Session, Depends(get_db)]

# 모든 모델을 데이터베이스에 생성함.
models.Base.metadata.create_all(bind=engine)

@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int=0, limit: int=100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions
    
@app.post("/todo", response_model=TodoModel)
async def create_todo(todo: TodoBase, db: db_dependency):
    db_todo = models.Todo(**todo.dict())  # models.Todo를 사용하여 새로운 Todo 객체 생성
    db.add(db_todo)  # 데이터베이스 세션에 추가
    db.commit()  # 트랜잭션 커밋
    db.refresh(db_todo)  # 데이터베이스에서 새로 추가된 객체를 새로고침
    return db_todo  # 새로 생성된 Todo 객체 반환

@app.get("/todo", response_model=List[TodoModel]) #응답은 여러개의 todo 항목을 리스트 형태로 변환함
async def read_todos(db: db_dependency, skip: int=0, limit: int=100):
    todos = db.query(models.Todo).offset(skip).limit(limit).all()  # Todo 테이블에서 데이터 조회
    return todos  # 조회한 Todo 리스트 반환
