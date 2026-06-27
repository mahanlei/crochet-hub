from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Step(Base):
    __tablename__ = "steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    work_id = Column(Integer, ForeignKey("works.id", ondelete="CASCADE"), nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)
    image = Column(String(255), default="")
    description = Column(Text, default="")

    work = relationship("Work", back_populates="steps")
