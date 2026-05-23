# AI Food Calorie System

AI-powered food recognition and calorie estimation system using Computer Vision, Deep Learning, and Vision-Language Models.

The system analyzes food images and estimates:

* Food name
* Portion weight
* Calories
* Protein
* Carbohydrates
* Fat

---

# System Architecture

```text
User Upload Image
        ↓
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
EfficientNet Food Classification
        ↓
Top Food Predictions
        ↓
Gemini Vision Portion Estimation
        ↓
Estimated Weight (grams)
        ↓
Nutrition Calculation Engine
        ↓
Calories & Macronutrients
        ↓
Frontend Visualization
```

---

# Core Technologies

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

## Backend

* FastAPI
* Python

## Artificial Intelligence

* EfficientNet (CNN)
* Gemini 2.5 Flash (Vision-Language Model)

## Image Processing

* Pillow (PIL)

---

# AI Pipeline

## 1. Food Classification

The uploaded image is processed using an EfficientNet-based CNN model.

The model predicts:

* food label
* confidence score
* top 3 food predictions

Example:

```json
{
  "food": "pizza",
  "confidence": 0.37
}
```

---

## 2. Portion Estimation

The food image and top predictions are sent to Gemini Vision API.

Gemini estimates:

* actual food type
* approximate edible weight (grams)

Example:

```json
{
  "food": "pizza",
  "estimated_weight_g": 320
}
```

---

## 3. Nutrition Calculation

The backend calculates calories and macronutrients using nutrition data per 100g.

### Calories Formula

Calories = (kcal_per_100g × weight_g) / 100

### Protein Formula

Protein = (protein_per_100g × weight_g) / 100

### Carbohydrates Formula

Carbs = (carbs_per_100g × weight_g) / 100

### Fat Formula

Fat = (fat_per_100g × weight_g) / 100

---

# Features

* AI food recognition
* Portion size estimation
* Real-time calorie estimation
* Nutrition analysis dashboard
* Modern responsive UI
* Top-3 prediction visualization
* FastAPI REST API
* AI-assisted nutrition reasoning

---

# API Endpoint

## Analyze Food

POST `/analyze-food`

### Request

Content-Type:

```text
multipart/form-data
```

Field:

```text
file
```

---

# Example Response

```json
{
  "classifier_result": {
    "food": "pizza",
    "confidence": 0.3758,
    "top_3": [
      {
        "food": "pizza",
        "confidence": 0.3758
      },
      {
        "food": "banh_trang_nuong",
        "confidence": 0.3503
      },
      {
        "food": "lasagna",
        "confidence": 0.2012
      }
    ]
  },

  "portion_result": {
    "food": "pizza",
    "estimated_weight_g": 320
  },

  "nutrition_result": {
    "estimated_calories": 851.2,
    "protein_g": 35.2,
    "carbs_g": 105.6,
    "fat_g": 32
  }
}
```

---

# Project Structure

```text
ai-food-calorie-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── classifier.py
│   │   │   ├── gemini_service.py
│   │   │   ├── nutrition_db.py
│   │   │   ├── nutrition_calculator.py
│   │   │   └── routes.py
│   │   │
│   │   ├── models/
│   │   │   └── food_classifier.keras
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
└── frontend/
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd ai-food-calorie-system
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

# Future Improvements

* YOLO food detection
* Food segmentation
* Depth estimation
* Volume estimation
* Nutrition tracking history
* Mobile application
* Cloud deployment

---

# Author

Phan Minh Thang
Bui Huynh Tuan Thanh
Luu Tan Phat
