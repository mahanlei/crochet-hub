from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Work(Base):
    __tablename__ = "works"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, default="")
    craft_type = Column(String(20), nullable=False)  # crochet / knitting
    difficulty = Column(String(20), nullable=False)   # beginner / intermediate / advanced
    cover_image = Column(String(255), default="")
    materials = Column(Text, default="[]")   # JSON 数组字符串
    tools = Column(Text, default="[]")       # JSON 数组字符串
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    steps = relationship("Step", back_populates="work", cascade="all, delete-orphan",
                         order_by="Step.sort_order")
