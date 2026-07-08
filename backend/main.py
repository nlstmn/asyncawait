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
        "name": "async",
        "description": "Start your morning with async/await. Dark roast, async-safe.",
        "price": 14.99,
        "image_url": "https://loremflickr.com/600/600/ceramic,mug,coffee?lock=11",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "promise",
        "description": "Always resolves. Eventually.",
        "price": 12.99,
        "image_url": "https://loremflickr.com/600/600/coffee,cup,handmade?lock=12",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "deadlock",
        "description": "Two threads enter. Neither leaves.",
        "price": 13.99,
        "image_url": "https://loremflickr.com/600/600/espresso,mug?lock=13",
        "category": "mug",
        "in_stock": True,
    },
    {
        "name": "nullpointer",
        "description": "A classic. A tragedy.",
        "price": 11.99,
        "image_url": "https://loremflickr.com/600/600/latte,mug,ceramic?lock=14",
        "category": "mug",
        "in_stock": True,
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = {p.name: p for p in db.query(models.Product).all()}
        seed_names = {data["name"] for data in SEED_PRODUCTS}
        for data in SEED_PRODUCTS:
            if data["name"] not in existing:
                db.add(models.Product(**data))
            else:
                # keep image_url in sync with the seed so we can refresh artwork without wiping the DB
                existing[data["name"]].image_url = data["image_url"]
        # prune products no longer in the seed (e.g. discontinued socks)
        for name, product in existing.items():
            if name not in seed_names:
                db.delete(product)
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
