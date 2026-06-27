import os
import uuid
import time
from fastapi import UploadFile
from app.config import UPLOAD_DIR


def save_upload_file(file: UploadFile) -> str:
    """保存上传文件到 uploads 目录，返回相对路径如 /uploads/xxx.jpg"""
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = os.path.splitext(file.filename or "file")[1] or ".jpg"
    filename = f"{int(time.time())}-{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = file.file.read()
        f.write(content)

    return f"/uploads/{filename}"


def delete_upload_file(file_path: str) -> None:
    """删除上传的文件，file_path 格式如 /uploads/xxx.jpg"""
    if not file_path:
        return
    local_path = file_path.lstrip("/")
    if os.path.exists(local_path):
        os.remove(local_path)
