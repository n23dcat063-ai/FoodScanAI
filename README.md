# AI Food Calorie System

AI-powered food recognition and calorie estimation system using:

* EfficientNet Food Classifier
* Gemini Vision API
* FastAPI Backend
* Next.js Frontend

The system analyzes food images and estimates:

* Food name
* Portion size
* Calories
* Protein
* Carbohydrates
* Fat

---

# Features

* Food image classification using EfficientNet
* Top-3 food predictions
* AI calorie estimation using Gemini Vision
* Modern Next.js frontend
* FastAPI REST API backend
* Nutrition analysis dashboard
* Responsive UI
* Real-time food analysis

---

# System Architecture

```text id="7m2q5v"
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
EfficientNet Food Classifier
        ↓
Gemini Vision AI
        ↓
Nutrition Estimation
```

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

## Backend

* FastAPI
* TensorFlow / Keras
* Pillow
* Google Gemini API

## AI Models

* EfficientNet
* Gemini 2.5 Flash

---

# Project Structure

```text id="3v8m1q"
ai-food-calorie-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── classifier.py
│   │   │   ├── gemini_service.py
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

# API Endpoint

## Analyze Food

```http id="5m2q8v"
POST /analyze-food
```

### Request

```text id="8q1m4v"
multipart/form-data
```

Field:

```text id="1m8q4v"
file
```

---

# Example Response

```json id="6v2m7q"
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

  "nutrition_result": {
    "food": "pizza",
    "estimated_weight_g": 320,
    "estimated_calories": 780,
    "protein_g": 28,
    "carbs_g": 72,
    "fat_g": 35,
    "confidence": 0.82
  }
}
```

---

# Installation

## Clone Repository

```bash id="9q2m5v"
git clone <your-repo-url>
cd ai-food-calorie-system
```

---

# Backend Setup

```bash id="4m7q1v"
cd backend

python -m venv venv

venv\Scripts\activate
```

Install dependencies:

```bash id="2q7m5v"
pip install -r requirements.txt
```

Create `.env` file:

```env id="5m2q8v"
GEMINI_API_KEY=your_api_key
```

Run backend:

```bash id="8q1m4v"
uvicorn app.main:app --reload
```

Backend URL:

```text id="1m8q4v"
http://127.0.0.1:8000
```

Swagger Docs:

```text id="6v2m7q"
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash id="9q2m5v"
cd frontend

npm install

npm run dev
```

Frontend URL:

```text id="4m7q1v"
http://localhost:3000
```

---

# AI Workflow

```text id="2q7m5v"
1. Upload food image
2. EfficientNet predicts food type
3. Top-3 predictions generated
4. Gemini Vision analyzes image
5. Calories and nutrition estimated
6. Frontend displays results
```

---

# Future Improvements

* YOLO food detection
* Food segmentation
* Depth estimation
* Volume estimation
* Nutrition tracking history
* User authentication
* Cloud deployment
* Mobile application
* Meal recommendation system

---

# Screenshots

Add your screenshots here.

---

# License

MIT License

---

# Author

Your Name

---

# Acknowledgements

* TensorFlow
* FastAPI
* Next.js
* Google Gemini API
* Food-101 Dataset
