from fastapi import FastAPI
from database import engine
import models
from routers import auth, launches

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(launches.router)



@app.get("/health")
def health_check():
    return {"Health Check": "FASTAPI Works!"}


# uvicorn main:app --reload