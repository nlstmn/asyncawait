import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()


def _serialize(order: models.Order) -> schemas.Order:
    """Turn a DB row (items stored as a JSON string) into the API response shape."""
    return schemas.Order(
        id=order.id,
        name=order.name,
        email=order.email,
        address=order.address,
        items=json.loads(order.items),
        total=float(order.total),
        created_at=order.created_at,
    )


@router.post("/orders", response_model=schemas.Order, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # look up every product once, then validate against the request
    ids = [item.product_id for item in order.items]
    products = {p.id: p for p in db.query(models.Product).filter(models.Product.id.in_(ids)).all()}

    line_items = []
    total = 0.0
    for item in order.items:
        product = products.get(item.product_id)
        if product is None:
            raise HTTPException(status_code=404, detail=f"product {item.product_id} not found")
        if not product.in_stock:
            raise HTTPException(status_code=409, detail=f"{product.name} is sold out")

        price = float(product.price)
        total += price * item.quantity
        line_items.append({
            "product_id": product.id,
            "name": product.name,
            "price": price,
            "quantity": item.quantity,
        })

    db_order = models.Order(
        name=order.name,
        email=order.email,
        address=order.address,
        items=json.dumps(line_items),
        total=round(total, 2),
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return _serialize(db_order)


@router.get("/admin/orders", response_model=List[schemas.Order])
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    return [_serialize(o) for o in orders]
