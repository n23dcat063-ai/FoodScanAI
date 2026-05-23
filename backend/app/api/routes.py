from fastapi import APIRouter, UploadFile, File
from PIL import Image
import io
import traceback
from app.api.gemini_service import estimate_portion
from app.api.classifier import predict_food
from app.api.nutrition_calculator import calculate_nutrition
router = APIRouter()

@router.post("/predict-food")
async def predict_food_api(file: UploadFile = File(...)):

    try:

        print("API called")

        image_bytes = await file.read()

        print("Image bytes received")

        image = Image.open(io.BytesIO(image_bytes))

        print("Image opened")

        result = predict_food(image)

        print("Prediction success")

        return result

    except Exception as e:

        print("ERROR:")
        traceback.print_exc()

        return {
            "error": str(e)
        }
@router.post("/analyze-food")
async def analyze_food(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image = Image.open(io.BytesIO(image_bytes))

    prediction = predict_food(image)

    portion = estimate_portion(
    image=image,
    food_prediction=prediction
)   
    nutrition = calculate_nutrition(
    food=portion["food"],
    weight=portion["estimated_weight_g"]
)
    
    return {

    "classifier_result": prediction,

    "portion_result": portion,

    "nutrition_result": nutrition
}