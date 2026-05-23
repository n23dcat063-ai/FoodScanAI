from app.api.nutrition_db import NUTRITION_DB


def calculate_nutrition(food, weight):

    food = food.lower().replace(" ", "_")

    if food not in NUTRITION_DB:

        return {
            "estimated_calories": 0,
            "protein_g": 0,
            "carbs_g": 0,
            "fat_g": 0
        }

    data = NUTRITION_DB[food]

    factor = weight / 100

    return {

        "estimated_calories":
            round(data["kcal_per_100g"] * factor, 1),

        "protein_g":
            round(data["protein_per_100g"] * factor, 1),

        "carbs_g":
            round(data["carbs_per_100g"] * factor, 1),

        "fat_g":
            round(data["fat_per_100g"] * factor, 1)
    }