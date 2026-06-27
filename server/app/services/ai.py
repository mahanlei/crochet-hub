import base64
import json
from openai import OpenAI
from app.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

PROMPT_TEMPLATE = """你是一位手工编织专家。请根据这张手工作品图片，生成以下信息：

1. 作品描述：50-100字，描述作品的外观特点、适用场景
2. 材料清单：列出制作所需的所有材料（线材及用量、配件等）
3. 工具清单：列出制作所需的所有工具

{craft_hint}

请严格以如下 JSON 格式返回，不要添加任何其他内容：
{{"description": "...", "materials": ["材料1", "材料2"], "tools": ["工具1", "工具2"]}}"""


async def generate_from_image(image_bytes: bytes, craft_type: str = "") -> dict:
    """调用 OpenAI GPT-4o，根据作品图片生成描述、材料和工具推荐。"""
    if not client:
        raise ValueError("OpenAI API Key 未配置，请在 .env 文件中设置 OPENAI_API_KEY")

    craft_hint = ""
    if craft_type == "crochet":
        craft_hint = "提示：这是一件钩针（crochet）作品。"
    elif craft_type == "knitting":
        craft_hint = "提示：这是一件棒针（knitting）作品。"

    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT_TEMPLATE.format(craft_hint=craft_hint)},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ],
        max_tokens=500,
    )

    content = response.choices[0].message.content.strip()
    # 尝试从 markdown 代码块中提取 JSON
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    return json.loads(content)
