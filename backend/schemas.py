from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name:        str            = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    price:       float          = Field(..., gt=0)
    image_url:   Optional[str] = Field(None, max_length=500)
    category:    Optional[str] = Field(None, pattern=r'^(mug|socks|bag)$')
    in_stock:    bool           = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name:        Optional[str]   = Field(None, min_length=1, max_length=200)
    description: Optional[str]   = Field(None, max_length=1000)
    price:       Optional[float] = Field(None, gt=0)
    image_url:   Optional[str]   = Field(None, max_length=500)
    category:    Optional[str]   = Field(None, pattern=r'^(mug|socks|bag)$')
    in_stock:    Optional[bool]  = None


class Product(ProductBase):
    id:         int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
