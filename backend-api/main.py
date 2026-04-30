from fastapi import FastAPI
from database import engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routers import auth, launches, subscriptions

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://rocket-launch-notification-platform-9ij51xnrf-aadilqs-projects.vercel.app"
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(launches.router)
app.include_router(subscriptions.router)


@app.get("/health")
def health_check():
    return {"Health Check": "FASTAPI Works!"}


# uvicorn main:app --reload