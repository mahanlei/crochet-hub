import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.crud.work import get_work
from app.crud.step import get_steps, batch_save_steps
from app.services.file import save_upload_file, delete_upload_file

router = APIRouter(prefix="/api/v1/works/{work_id}/steps", tags=["教程步骤"])


@router.get("", response_model=dict)
def list_steps(work_id: int, db: Session = Depends(get_db)):
    work = get_work(db, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="作品不存在")

    steps = get_steps(db, work_id)
    data = [
        {"id": s.id, "sort_order": s.sort_order, "image": s.image, "description": s.description}
        for s in steps
    ]
    return {"success": True, "data": data, "message": "ok"}


@router.put("", response_model=dict)
async def save_steps(
    work_id: int,
    steps: str = Form(...),
    db: Session = Depends(get_db),
):
    work = get_work(db, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="作品不存在")

    steps_data = json.loads(steps)

    # 注意：步骤图片通过单独的字段上传，名称格式为 step_images_0, step_images_1, ...
    # 这里暂不处理图片，图片上传在前端通过额外的 FormData 字段传递
    # 实际使用时需要在 Request 对象中手动获取
    image_map: dict[int, str] = {}

    result = batch_save_steps(db, work_id, steps_data, image_map)
    data = [
        {"id": s.id, "sort_order": s.sort_order, "image": s.image, "description": s.description}
        for s in result
    ]
    return {"success": True, "data": data, "message": "ok"}
