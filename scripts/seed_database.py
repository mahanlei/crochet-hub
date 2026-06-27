"""
Seed the CrochetHub database with demo data from Xiaohongshu posts.
This script creates the SQLite database and tables, then inserts seed data.
"""
import json
import os
import sqlite3
from datetime import datetime, timedelta
import random

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_PATH = os.path.join(PROJECT_ROOT, "server", "crochet_hub.db")
DATA_FILE = os.path.join(SCRIPT_DIR, "xhs_data.json")
UPLOAD_DIR = os.path.join(PROJECT_ROOT, "server", "uploads")


def create_tables(conn):
    """Create works and steps tables matching the SQLAlchemy ORM models."""
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS works (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            craft_type VARCHAR(20) DEFAULT '钩针',
            difficulty VARCHAR(20) DEFAULT '中级',
            cover_image VARCHAR(500),
            materials TEXT,
            tools TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            work_id INTEGER NOT NULL,
            sort_order INTEGER NOT NULL DEFAULT 0,
            image VARCHAR(500),
            description TEXT,
            FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
        );
    """)
    conn.commit()
    print("Tables created successfully.")


def seed_works(conn):
    """Insert seed works from xhs_data.json."""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        posts = json.load(f)

    # Check which images exist locally
    existing_images = set(os.listdir(UPLOAD_DIR)) if os.path.exists(UPLOAD_DIR) else set()

    cursor = conn.cursor()

    # Clear existing data
    cursor.execute("DELETE FROM steps")
    cursor.execute("DELETE FROM works")
    conn.commit()

    base_time = datetime(2025, 3, 1, 10, 0, 0)

    for i, post in enumerate(posts):
        # Find local images for this work
        work_images = []
        j = 1
        while True:
            fname = f"work_{i+1}_img_{j}.webp"
            if fname in existing_images:
                work_images.append(fname)
                j += 1
            else:
                break

        # Cover image is the first image
        cover_image = work_images[0] if work_images else None

        # Materials and tools as JSON arrays
        materials_json = json.dumps(post.get("materials", []), ensure_ascii=False)
        tools_json = json.dumps(post.get("tools", []), ensure_ascii=False)

        # Stagger creation times
        created_at = base_time + timedelta(days=i * 7, hours=random.randint(0, 12))
        updated_at = created_at + timedelta(hours=random.randint(1, 48))

        cursor.execute("""
            INSERT INTO works (title, description, craft_type, difficulty,
                             cover_image, materials, tools, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            post["title"],
            post["desc"],
            post.get("craft_type", "钩针"),
            post.get("difficulty", "中级"),
            cover_image,
            materials_json,
            tools_json,
            created_at.isoformat(),
            updated_at.isoformat(),
        ))

        work_id = cursor.lastrowid
        print(f"  [{i+1}] Inserted work: {post['title']} (id={work_id}, {len(work_images)} images)")

        # Create steps from remaining images (skip the first one as it's the cover)
        step_descriptions = generate_step_descriptions(post["title"], len(work_images) - 1)

        for si, img_file in enumerate(work_images[1:], start=1):
            desc = step_descriptions[si - 1] if si - 1 < len(step_descriptions) else f"步骤 {si}"
            cursor.execute("""
                INSERT INTO steps (work_id, sort_order, image, description)
                VALUES (?, ?, ?, ?)
            """, (work_id, si, img_file, desc))

    conn.commit()
    print(f"\nSeeded {len(posts)} works successfully!")


def generate_step_descriptions(title, num_steps):
    """Generate meaningful step descriptions based on the work title."""
    if num_steps <= 0:
        return []

    if "包包" in title or "手提包" in title or "菜篮子" in title:
        templates = [
            "起针并编织包底，使用锁针起针法",
            "编织包身主体花样，按照图解重复花样段",
            "编织包口收边，注意保持松紧一致",
            "编织提手/肩带部分",
            "缝合各部分并整理线头",
            "完成效果展示",
        ]
    elif "三角巾" in title:
        templates = [
            "起针并编织三角巾的起始角",
            "逐行加针，编织主体花样",
            "继续扩展编织，注意花样的对称性",
            "编织花边装饰部分",
            "收针并整理，完成效果展示",
            "搭配展示效果",
            "旅行实拍效果",
        ]
    elif "耳机套" in title or "苹果" in title:
        templates = [
            "编织耳机套主体，从底部开始圈织",
            "编织苹果造型的装饰部分",
            "完成效果展示与实物对比",
        ]
    else:
        templates = [f"步骤 {i+1}" for i in range(num_steps)]

    return templates[:num_steps]


def print_summary(conn):
    """Print a summary of the seeded data."""
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM works")
    work_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM steps")
    step_count = cursor.fetchone()[0]
    cursor.execute("SELECT id, title, craft_type, difficulty, cover_image FROM works ORDER BY id")
    works = cursor.fetchall()

    print("\n" + "=" * 60)
    print(f"Database Summary: {work_count} works, {step_count} steps")
    print("=" * 60)
    for w in works:
        cursor.execute("SELECT COUNT(*) FROM steps WHERE work_id=?", (w[0],))
        sc = cursor.fetchone()[0]
        print(f"  [{w[0]}] {w[1]}")
        print(f"       类型={w[2]}, 难度={w[3]}, 封面={w[4]}, 步骤数={sc}")
    print("=" * 60)


def main():
    print(f"Database path: {DB_PATH}")
    print(f"Data file: {DATA_FILE}")
    print(f"Upload dir: {UPLOAD_DIR}")
    print()

    conn = sqlite3.connect(DB_PATH)
    try:
        create_tables(conn)
        seed_works(conn)
        print_summary(conn)
    finally:
        conn.close()

    print(f"\nDone! Database saved to: {DB_PATH}")


if __name__ == "__main__":
    main()
