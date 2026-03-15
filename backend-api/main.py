from fastapi import FastAPI
from database import engine
import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    return {"Health Check": "FASTAPI Works!"}


# uvicorn main:app --reload