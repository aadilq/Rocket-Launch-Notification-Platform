from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Launch
from datetime import datetime, timezone

router = APIRouter()

@router.get("/launches")
def get_launches(db: Session = Depends(get_db)):
    launches = db.query(Launch).order_by(Launch.net.asc()).all()
    now = datetime.now(timezone.utc)
    launches = db.query(Launch).filter(Launch.net > now).order_by(Launch.net.asc()).all()

    return [
        {
            "id": launch.id,
            "external_id": launch.external_id,
            "name": launch.name,
            "agency": launch.agency,
            "status": launch.status,
            "net": launch.net
        }
        for launch in launches
    ]