from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed data if products table is empty
    import models

    db = SessionLocal()
    try:
        count = db.query(models.Product).count()
        if count == 0:
            for data in SEED_PRODUCTS:
                product = models.Product(**data)
                db.add(product)
            db.commit()
    finally:
        db.close()

    yield


app = FastAPI(title="asyncdrip API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(waitlist.router)


@app.get("/")
def root():
    return {"message": "asyncdrip API is running"}
