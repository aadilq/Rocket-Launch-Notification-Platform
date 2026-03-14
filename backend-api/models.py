from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(75), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Launch(Base):
    __tablename__ = 'launches'

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(100), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    agency = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    net = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class Subscription(Base):
    __tablename__ = 'subscriptions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('User.id'), nullable=False)
    launch_id = Column(Integer, ForeignKey('Launch.id'), nullable=True)
    agency = Column(String(100), nullable=True)
    notify_email = Column(Boolean, default=True, nullable=False)
    notify_phone = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    

