from sqlalchemy.orm import Session
from app.models.step import Step


def get_steps(db: Session, work_id: int) -> list[Step]:
    return db.query(Step).filter(Step.work_id == work_id).order_by(Step.sort_order).all()


def batch_save_steps(db: Session, work_id: int, steps_data: list[dict],
                     image_map: dict[int, str]) -> list[Step]:
    """
    批量保存步骤：对比现有步骤，处理新增、更新和删除。

    steps_data: [{"id": 1, "sort_order": 0, "description": "..."}, {"sort_order": 1, "description": "..."}]
    image_map: {0: "/uploads/xxx.jpg", 1: "/uploads/yyy.jpg"}  按下标对应步骤图片路径
    """
    existing_steps = {s.id: s for s in get_steps(db, work_id)}
    submitted_ids = set()
    result = []

    for idx, step_info in enumerate(steps_data):
        step_id = step_info.get("id")
        image_path = image_map.get(idx, "")

        if step_id and step_id in existing_steps:
            # 更新已有步骤
            step = existing_steps[step_id]
            step.sort_order = step_info.get("sort_order", idx)
            step.description = step_info.get("description", "")
            if image_path:
                step.image = image_path
            submitted_ids.add(step_id)
            result.append(step)
        else:
            # 新增步骤
            step = Step(
                work_id=work_id,
                sort_order=step_info.get("sort_order", idx),
                description=step_info.get("description", ""),
                image=image_path,
            )
            db.add(step)
            result.append(step)

    # 删除不在提交列表中的步骤
    for old_id, old_step in existing_steps.items():
        if old_id not in submitted_ids:
            db.delete(old_step)

    db.commit()
    for step in result:
        db.refresh(step)
    return result
