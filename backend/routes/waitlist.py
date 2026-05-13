from fastapi import APIRouter

router = APIRouter()


@router.post("/waitlist")
def join_waitlist():
    return {"message": "Waitlist coming soon"}
