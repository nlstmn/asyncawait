# asyncdrip

Developer merch shop. Dark roast, async-safe.

## Stack

- **Backend**: FastAPI + SQLAlchemy (SQLite)
- **Frontend**: React + Vite

## Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`.
