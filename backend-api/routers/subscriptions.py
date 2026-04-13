from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Subscription
from pydantic import BaseModel
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class SubscriptionRequest(BaseModel):
    launch_id: int | None = None
    agency: str | None = None
    notify_email: bool | None = True
    notify_sms: bool = False

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/subscriptions")
def get_subscriptions(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).order_by(Subscription.created_at.asc())

    return [
        {
            "id":sub.id,
            "launch_id": sub.launch_id,
            "agency": sub.agency,
            "notify_email": sub.notify_email,
            "notify_sms": sub.notify_phone,
            "created_at": sub.created_at
        }
        for sub in subscriptions
    ]

@router.post("/subscriptions")
def create_subscription(request: SubscriptionRequest, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    if not request.launch_id and not request.agency:
        raise HTTPException(status_code=400, detail="Must provide either a launch_id or an agency")
    new_sub = Subscription(
        user_id=user_id,
        launch_id=request.launch_id,
        agency=request.agency,
        notify_email=request.notify_email,
        notify_sms=request.notify_sms
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return{"message": "subscribed successfully"}

@router.delete("/subscriptions/{subscription_id}")
def delete_subscription(subscription_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    subscription = db.query(subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id
    ).first()

    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(subscription)
    db.commit()
    return{"message": "unsubscribed successfully"}
