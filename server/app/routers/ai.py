from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.services.ai import generate_from_image

router = APIRouter(prefix="/api/v1/ai", tags=["AI"])


@router.post("/generate", response_model=dict)
async def ai_generate(
    image: UploadFile = File(...),
    craft_type: Optional[str] = Form(None),
):
    image_bytes = await image.read()
    try:
        result = await generate_from_image(image_bytes, craft_type or "")
    except ValueError as e:
        return {"success": False, "data": None, "message": str(e)}
    except Exception as e:
        return {"success": False, "data": None, "message": f"AI 生成失败：{str(e)}"}

    return {"success": True, "data": result, "message": "ok"}
