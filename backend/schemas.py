from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    in_stock: bool = True


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
