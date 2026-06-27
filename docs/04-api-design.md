# CrochetHub — API 设计文档

## 1. 概述

所有接口以 `/api/v1` 为基础路径，返回统一的 JSON 响应格式。

**成功响应：**

```json
{ "success": true, "data": {}, "message": "ok" }
```

**错误响应：**

```json
{ "success": false, "data": null, "message": "错误描述" }
```

**通用状态码：**

| 状态码 | 含义 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 2. 作品接口

### 2.1 获取作品列表

```
GET /api/v1/works
```

**Query 参数（均为可选）：**

| 参数 | 类型 | 说明 |
|------|------|------|
| craft_type | string | 按工艺类别筛选：`crochet` / `knitting` |
| difficulty | string | 按难度筛选：`beginner` / `intermediate` / `advanced` |

**响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "小熊挂件",
      "description": "可爱的钩针小熊挂件...",
      "craft_type": "crochet",
      "difficulty": "beginner",
      "cover_image": "/uploads/bear-cover.jpg",
      "materials": ["3mm 钩针", "奶棉线 50g", "填充棉"],
      "tools": ["3mm 钩针", "缝合针", "记号扣"],
      "created_at": "2025-06-15T10:00:00.000Z",
      "updated_at": "2025-06-15T10:00:00.000Z"
    }
  ],
  "message": "ok"
}
```

### 2.2 获取作品详情（含教程步骤）

```
GET /api/v1/works/:id
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "小熊挂件",
    "description": "可爱的钩针小熊挂件...",
    "craft_type": "crochet",
    "difficulty": "beginner",
    "cover_image": "/uploads/bear-cover.jpg",
    "materials": ["3mm 钩针", "奶棉线 50g", "填充棉"],
    "tools": ["3mm 钩针", "缝合针", "记号扣"],
    "created_at": "2025-06-15T10:00:00.000Z",
    "updated_at": "2025-06-15T10:00:00.000Z",
    "steps": [
      {
        "id": 1,
        "sort_order": 1,
        "image": "/uploads/bear-step1.jpg",
        "description": "起针：用环形起针法起 6 针短针"
      },
      {
        "id": 2,
        "sort_order": 2,
        "image": "/uploads/bear-step2.jpg",
        "description": "第 2 圈：每针加针，共 12 针"
      }
    ]
  },
  "message": "ok"
}
```

### 2.3 创建作品

```
POST /api/v1/works
Content-Type: multipart/form-data
```

**请求字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 作品标题 |
| description | string | 否 | 作品描述 |
| craft_type | string | 是 | `crochet` / `knitting` |
| difficulty | string | 是 | `beginner` / `intermediate` / `advanced` |
| materials | string | 否 | JSON 数组字符串 |
| tools | string | 否 | JSON 数组字符串 |
| cover_image | File | 否 | 封面图片文件 |

**响应：** 201，返回创建后的完整作品对象。

### 2.4 更新作品

```
PUT /api/v1/works/:id
Content-Type: multipart/form-data
```

**请求字段：** 同创建，所有字段均为可选（只传需要更新的字段）。如上传新封面图，旧图片文件将被删除。

**响应：** 200，返回更新后的完整作品对象。

### 2.5 删除作品

```
DELETE /api/v1/works/:id
```

**响应：** 200，关联的步骤和图片文件一并删除。

```json
{ "success": true, "data": null, "message": "作品已删除" }
```

---

## 3. 教程步骤接口

### 3.1 获取某作品的所有步骤

```
GET /api/v1/works/:workId/steps
```

**响应：** 200，返回按 `sort_order` 排序的步骤数组。

### 3.2 批量保存步骤（新增 + 更新 + 删除）

```
PUT /api/v1/works/:workId/steps
Content-Type: multipart/form-data
```

采用批量操作而非单条 CRUD，原因是后台表单中教程步骤作为一个整体编辑（支持拖拽排序、新增、删除），提交时一次性发送所有步骤更合理。

**请求字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| steps | string | JSON 数组字符串，每项含 `id`（已有步骤）或不含（新步骤）、`sort_order`、`description` |
| step_images_0, step_images_1, ... | File | 按下标对应步骤的图片文件 |

**处理逻辑：** 后端对比现有步骤与提交的步骤列表，自动处理新增、更新和删除（不在列表中的已有步骤将被删除）。

**响应：** 200，返回更新后的完整步骤数组。

---

## 4. AI 接口

### 4.1 AI 生成作品描述与材料推荐

```
POST /api/v1/ai/generate
Content-Type: multipart/form-data
```

**请求字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image | File | 是 | 作品图片 |
| craft_type | string | 否 | 工艺类别提示，帮助 AI 更准确识别 |

**响应示例：**

```json
{
  "success": true,
  "data": {
    "description": "这是一款使用钩针编织的可爱小熊挂件，采用奶棉线制作，适合初学者练习基础针法。成品大小约 8cm，可作为钥匙扣或包包挂饰。",
    "materials": ["3mm 钩针", "奶棉线（米白色）50g", "奶棉线（棕色）少量", "填充棉适量", "6mm 安全眼一对"],
    "tools": ["3mm 钩针", "缝合针", "记号扣", "剪刀"]
  },
  "message": "ok"
}
```

---

## 5. 文件访问

上传的图片通过 FastAPI 的 StaticFiles 中间件对外提供访问：

```
GET /uploads/:filename
```

图片命名规则：`{timestamp}-{random}_{original_name}`，避免重名冲突。
