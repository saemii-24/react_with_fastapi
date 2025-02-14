from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 데이터베이스 URL 설정
## DB URL = 데이터베이스에 연결하기 위해 필요한 정보를 포함하는 문자열
URL_DATABASE = 'sqlite:///./finance.db'

# SQLAlchemy 엔진 생성
engine = create_engine(URL_DATABASE, connect_args={"check_same_thread": False})

# 세션 로컬 클래스 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 기본 클래스 생성
Base = declarative_base()
