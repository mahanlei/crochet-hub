from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class StepOut(BaseModel):
    id: int
    sort_order: int
    image: str
    description: str

    model_config = {"from_attributes": True}


class WorkBase(BaseModel):
    title: str
    description: str = ""
    craft_type: str
    difficulty: str
    materials: list[str] = []
    tools: list[str] = []


class WorkOut(BaseModel):
    id: int
    title: str
    description: str
    craft_type: str
    difficulty: str
    cover_image: str
    materials: list[str]
    tools: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WorkDetailOut(WorkOut):
    steps: list[StepOut] = []


class AIGenerateOut(BaseModel):
    description: str
    materials: list[str]
    tools: list[str]
