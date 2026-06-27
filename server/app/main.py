import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.config import UPLOAD_DIR
from app.routers import works, steps, ai

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CrochetHub API", description="钩针/棒针作品分享平台后端接口", version="1.0.0")

# CORS 中间件 —— 开发阶段允许所有来源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件服务 —— 提供上传图片的访问
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 注册路由
app.include_router(works.router)
app.include_router(steps.router)
app.include_router(ai.router)


@app.get("/", tags=["健康检查"])
def health_check():
    return {"success": True, "message": "CrochetHub API is running"}
