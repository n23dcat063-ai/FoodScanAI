import os
import json
import google.generativeai as genai

from dotenv import load_dotenv
from PIL import Image

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
def estimate_portion(image: Image.Image, food_prediction):

    prompt = f"""
Analyze this food image.

Possible food classes:
- pizza
- banh_trang_nuong
- lasagna

Estimate the approximate edible weight
of the food in grams.

Use realistic serving sizes.

Avoid extreme estimates.

Return ONLY JSON.

{{
  "food": "string",
  "estimated_weight_g": number
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
    "confidence": 0
}

    return result