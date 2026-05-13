from fastapi import APIRouter

router = APIRouter()


@router.post("/orders")
def create_order():
    return {"message": "Orders coming soon"}


@router.get("/admin/orders")
def list_orders():
    return []
