import json
from sqlalchemy.orm import Session
from app.models.work import Work
from typing import Optional


def get_works(db: Session, craft_type: Optional[str] = None, difficulty: Optional[str] = None) -> list[Work]:
    query = db.query(Work)
    if craft_type:
        query = query.filter(Work.craft_type == craft_type)
    if difficulty:
        query = query.filter(Work.difficulty == difficulty)
    return query.order_by(Work.created_at.desc()).all()


def get_work(db: Session, work_id: int) -> Optional[Work]:
    return db.query(Work).filter(Work.id == work_id).first()


def create_work(db: Session, *, title: str, description: str = "", craft_type: str,
                difficulty: str, cover_image: str = "", materials: list[str] = None,
                tools: list[str] = None) -> Work:
    work = Work(
        title=title,
        description=description,
        craft_type=craft_type,
        difficulty=difficulty,
        cover_image=cover_image,
        materials=json.dumps(materials or [], ensure_ascii=False),
        tools=json.dumps(tools or [], ensure_ascii=False),
    )
    db.add(work)
    db.commit()
    db.refresh(work)
    return work


def update_work(db: Session, work: Work, **kwargs) -> Work:
    for key, value in kwargs.items():
        if value is not None:
            if key in ("materials", "tools"):
                setattr(work, key, json.dumps(value, ensure_ascii=False))
            else:
                setattr(work, key, value)
    db.commit()
    db.refresh(work)
    return work


def delete_work(db: Session, work: Work) -> None:
    db.delete(work)
    db.commit()
