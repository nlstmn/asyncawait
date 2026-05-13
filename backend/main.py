import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

import models  # noqa: E402 — must come after load_dotenv so env vars are set
from database import Base, SessionLocal, engine
from routes import orders, products, waitlist


SEED_PRODUCTS = [
    {
        "name": "Async Mug",
        "description": "Start your morning with async/await. Dark roast, async-safe.",
        "price": 14.99,
        "image_url": "/placeholder.jpg",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "Promise Mug",
        "description": "Always resolves. Eventually.",
        "price": 12.99,
        "image_url": "/placeholder.jpg",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "Deadlock Mug",
        "description": "Two threads enter. Neither leaves.",
        "price": 13.99,
        "image_url": "/placeholder.jpg",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "NullPointer Mug",
        "description": "A classic. A tragedy.",
        "price": 11.99,
        "image_url": "/placeholder.jpg",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "Hello World Socks",
        "description": "print('warm feet'). The first pair every dev needs.",
        "price": 9.99,
        "image_url": "/placeholder.jpg",
        "category": "socks",
        "in_stock": True,
    },
    {
        "name": "Git Push Socks",
        "description": "Force push your comfort levels. No --no-verify needed.",
        "price": 10.99,
        "image_url": "/placeholder.jpg",
        "category": "socks",
        "in_stock": True,
    },
    {
        "name": "Stack Overflow Socks",
        "description": "Copy-pasted from the best. Fits perfectly.",
        "price": 9.99,
        "image_url": "/placeholder.jpg",
        "category": "socks",
        "in_stock": True,
    },
    {
        "name": "404 Socks",
        "description": "Sock not found. And yet, here we are.",
        "price": 8.99,
        "image_url": "/placeholder.jpg",
        "category": "socks",
        "in_stock": False,
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_names = {p.name for p in db.query(models.Product.name).all()}
        for data in SEED_PRODUCTS:
            if data["name"] not in existing_names:
                db.add(models.Product(**data))
        db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="async/await drip API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(products.router, tags=["products"])
app.include_router(orders.router,   tags=["orders"])
app.include_router(waitlist.router, tags=["waitlist"])


@app.get("/", tags=["health"])
def root():
    return {"message": "async/await drip API is running"}
