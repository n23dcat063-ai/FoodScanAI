import os
import json
import google.generativeai as genai

from dotenv import load_dotenv
from PIL import Image

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
def estimate_calories(image: Image.Image, food_prediction):

    prompt = f"""
    You are a professional nutrition estimation AI.

    Food classifier prediction:

    {food_prediction}

    Analyze the food image carefully.

    Return ONLY valid raw JSON.

    Do NOT use markdown.
    Do NOT explain.
    Do NOT add extra text.

    JSON schema:

    {{
        "food": "string",
        "estimated_weight_g": number,
        "estimated_calories": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number,
        "confidence": number
    }}
    """

    response = model.generate_content(
        [prompt, image]
    )

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")

    try:

        result = json.loads(text)

    except Exception as e:

        print("Gemini JSON parse error:", e)

        result = {
            "food": food_prediction.get("food", "unknown"),
            "estimated_weight_g": 0,
            "estimated_calories": 0,
            "protein_g": 0,
            "carbs_g": 0,
            "fat_g": 0,
            "confidence": 0
        }

    return result