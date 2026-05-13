from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String
from sqlalchemy.sql import func

from database import Base


class Product(Base):
    __tablename__ = "products"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    name        = Column(String(200), nullable=False, unique=True, index=True)
    description = Column(String(1000))
    price       = Column(Numeric(10, 2), nullable=False)
    image_url   = Column(String(500))
    category    = Column(String(50), index=True)
    in_stock    = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=func.now())
