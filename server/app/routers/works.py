import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.crud.work import get_works, get_work, create_work, update_work, delete_work
from app.schemas.work import WorkOut, WorkDetailOut
from app.services.file import save_upload_file, delete_upload_file

router = APIRouter(prefix="/api/v1/works", tags=["作品"])


def _img_url(filename: str) -> str:
    """将文件名转为可访问的 URL 路径。"""
    if not filename:
        return ""
    if filename.startswith(("/", "http://", "https://")):
        return filename
    return f"/uploads/{filename}"


def _work_to_out(work, with_steps=False):
    """将 ORM 对象转为响应字典，处理 JSON 字符串字段。"""
    data = {
        "id": work.id,
        "title": work.title,
        "description": work.description,
        "craft_type": work.craft_type,
        "difficulty": work.difficulty,
        "cover_image": _img_url(work.cover_image),
        "materials": json.loads(work.materials) if isinstance(work.materials, str) else work.materials,
        "tools": json.loads(work.tools) if isinstance(work.tools, str) else work.tools,
        "created_at": work.created_at,
        "updated_at": work.updated_at,
    }
    if with_steps:
        data["steps"] = [
            {"id": s.id, "sort_order": s.sort_order, "image": _img_url(s.image), "description": s.description}
            for s in work.steps
        ]
    return data


@router.get("", response_model=dict)
def list_works(craft_type: Optional[str] = None, difficulty: Optional[str] = None,
               db: Session = Depends(get_db)):
    works = get_works(db, craft_type=craft_type, difficulty=difficulty)
    return {"success": True, "data": [_work_to_out(w) for w in works], "message": "ok"}


@router.get("/{work_id}", response_model=dict)
def read_work(work_id: int, db: Session = Depends(get_db)):
    work = get_work(db, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="作品不存在")
    return {"success": True, "data": _work_to_out(work, with_steps=True), "message": "ok"}


@router.post("", response_model=dict, status_code=201)
def create_work_endpoint(
    title: str = Form(...),
    craft_type: str = Form(...),
    difficulty: str = Form(...),
    description: str = Form(""),
    materials: str = Form("[]"),
    tools: str = Form("[]"),
    cover_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    cover_path = ""
    if cover_image and cover_image.filename:
        cover_path = save_upload_file(cover_image)

    work = create_work(
        db,
        title=title,
        description=description,
        craft_type=craft_type,
        difficulty=difficulty,
        cover_image=cover_path,
        materials=json.loads(materials),
        tools=json.loads(tools),
    )
    return {"success": True, "data": _work_to_out(work), "message": "ok"}


@router.put("/{work_id}", response_model=dict)
def update_work_endpoint(
    work_id: int,
    title: Optional[str] = Form(None),
    craft_type: Optional[str] = Form(None),
    difficulty: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    materials: Optional[str] = Form(None),
    tools: Optional[str] = Form(None),
    cover_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    work = get_work(db, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="作品不存在")

    update_data = {}
    if title is not None:
        update_data["title"] = title
    if description is not None:
        update_data["description"] = description
    if craft_type is not None:
        update_data["craft_type"] = craft_type
    if difficulty is not None:
        update_data["difficulty"] = difficulty
    if materials is not None:
        update_data["materials"] = json.loads(materials)
    if tools is not None:
        update_data["tools"] = json.loads(tools)

    if cover_image and cover_image.filename:
        # 删除旧封面
        delete_upload_file(work.cover_image)
        update_data["cover_image"] = save_upload_file(cover_image)

    work = update_work(db, work, **update_data)
    return {"success": True, "data": _work_to_out(work), "message": "ok"}


@router.delete("/{work_id}", response_model=dict)
def delete_work_endpoint(work_id: int, db: Session = Depends(get_db)):
    work = get_work(db, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="作品不存在")

    # 删除封面图片
    delete_upload_file(work.cover_image)
    # 删除步骤图片
    for step in work.steps:
        delete_upload_file(step.image)

    delete_work(db, work)
    return {"success": True, "data": None, "message": "作品已删除"}
