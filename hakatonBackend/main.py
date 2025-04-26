from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Импорт middleware для CORS
from typing import List, Dict
import json
from pathlib import Path

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все домены (для продакшена укажите конкретные)
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

DATA_FILE = Path("data/users.json")

def load_users() -> List[Dict]:
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f).get("users", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/all", response_model=List[Dict])
async def get_all_users():
    """
    Получить всех пользователей со всеми их навыками
    """
    return load_users()

@app.get("/api/users/by-skill/{skill_name}", response_model=List[Dict])
async def get_users_by_skill(
    skill_name: str,
    min_points: int = None,
    max_points: int = None
):
    """
    Поиск пользователей по названию навыка с фильтрацией по баллам
    Примеры:
    /api/users/by-skill/Python
    /api/users/by-skill/Python?min_points=50
    /api/users/by-skill/Python?min_points=50&max_points=100
    """
    users = load_users()
    result = []
    
    for user in users:
        for skill in user.get("skills", []):
            if skill["name"].lower() == skill_name.lower():
                points = skill["points"]
                
                # Проверка фильтров по баллам
                if min_points is not None and points < min_points:
                    continue
                if max_points is not None and points > max_points:
                    continue
                
                # Добавляем пользователя с информацией о баллах за этот навык
                user_data = user.copy()
                user_data["skill_info"] = {
                    "name": skill["name"],
                    "points": points
                }
                result.append(user_data)
                break
    
    return result

@app.get("/api/users/by-skills", response_model=List[Dict])
async def get_users_by_multiple_skills(
    skills: str,
    min_points: int = None,
    logic: str = "AND"
):
    """
    Поиск пользователей по нескольким навыкам с разной логикой
    Примеры:
    /api/users/by-skills?skills=Python,SQL
    /api/users/by-skills?skills=Python,SQL&min_points=50
    /api/users/by-skills?skills=Python,SQL&logic=OR
    """
    required_skills = [s.strip().lower() for s in skills.split(",")]
    users = load_users()
    result = []
    
    for user in users:
        user_skills = {
            skill["name"].lower(): skill["points"] 
            for skill in user.get("skills", [])
        }
        
        matched = []
        for skill in required_skills:
            points = user_skills.get(skill)
            if points is not None:
                if min_points is None or points >= min_points:
                    matched.append((skill, points))
        
        # Проверка логики AND/OR
        if (logic.upper() == "AND" and len(matched) == len(required_skills)) or \
           (logic.upper() == "OR" and len(matched) > 0):
            
            user_data = user.copy()
            user_data["matched_skills"] = [
                {"name": skill, "points": points}
                for skill, points in matched
            ]
            result.append(user_data)
    
    return result

@app.get("/api/skills/stats", response_model=Dict)
async def get_skill_stats():
    """
    Статистика по всем навыкам:
    - Общее количество пользователей с навыком
    - Средний балл
    - Максимальный балл
    """
    users = load_users()
    stats = {}
    
    for user in users:
        for skill in user.get("skills", []):
            name = skill["name"]
            points = skill["points"]
            
            if name not in stats:
                stats[name] = {
                    "count": 0,
                    "total_points": 0,
                    "max_points": 0,
                    "users": []
                }
            
            stats[name]["count"] += 1
            stats[name]["total_points"] += points
            if points > stats[name]["max_points"]:
                stats[name]["max_points"] = points
            
            # Добавляем пользователей с этим навыком
            stats[name]["users"].append({
                "username": user["username"],
                "points": points
            })
    
    # Вычисляем средний балл
    for name, data in stats.items():
        data["avg_points"] = round(data["total_points"] / data["count"], 2)
        # Сортируем пользователей по баллам (по убыванию)
        data["users"].sort(key=lambda x: x["points"], reverse=True)
    
    return stats