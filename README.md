# AI Food Calorie System

Hệ thống nhận diện món ăn và ước lượng calories bằng AI sử dụng Computer Vision, Deep Learning và Vision-Language Model.

Hệ thống cho phép:

* nhận diện món ăn từ hình ảnh
* ước lượng khẩu phần (gram)
* tính toán calories
* tính toán protein, carbs và fat

---

# Kiến Trúc Hệ Thống

```text
Người dùng upload ảnh
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
Estimated Weight (gram)
        ↓
Nutrition Calculation Engine
        ↓
Calories & Macronutrients
        ↓
Frontend Visualization
```

---

# Công Nghệ Sử Dụng

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Framer Motion

## Backend

* FastAPI
* Python

## Artificial Intelligence

* EfficientNet (CNN)
* Gemini 2.5 Flash (Vision-Language Model)

## Image Processing

* Pillow (PIL)
* OpenCV

---

# AI

## 1. Nhận Diện Món Ăn

Ảnh món ăn được xử lý bằng mô hình EfficientNet CNN.

Model dự đoán:

* tên món ăn
* confidence score
* top 3 predictions

Ví dụ:

```json
{
  "food": "pizza",
  "confidence": 0.90
}
```

---

## 2. Ước Lượng Khẩu Phần

Ảnh món ăn và top predictions được gửi đến Gemini Vision API.

Gemini sẽ:

* phân tích hình ảnh
* ước lượng khẩu phần thực tế
* trả về estimated weight (gram)

Ví dụ:

```json
{
  "food": "pizza",
  "estimated_weight_g": 320
}
```

---

## 3. Tính Toán Calories & Dinh Dưỡng

Backend sử dụng nutrition database để tính toán:

* calories
* protein
* carbs
* fat

dựa trên:

* nutrition per 100g
* estimated weight

---

# Công Thức Tính Calories

Calories:

Calories = (kcal_per_100g × weight_g) / 100

Protein:

Protein = (protein_per_100g × weight_g) / 100

Carbohydrates:

Carbs = (carbs_per_100g × weight_g) / 100

Fat:

Fat = (fat_per_100g × weight_g) / 100

---

# Tính Năng Chính

 

* Nhận diện món ăn bằng AI
* Ước lượng khẩu phần ăn
* Tính toán lượng calo theo thời gian thực
* Bảng điều khiển phân tích dinh dưỡng
* Hiển thị Top-3 dự đoán kết quả

  

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
    "food": "pho",
    "confidence": 0.9124,
    "top_3": [
      {
        "food": "pho",
        "confidence": 0.9124
      },
      {
        "food": "bun_bo_hue",
        "confidence": 0.0541
      },
      {
        "food": "hu_tieu",
        "confidence": 0.0217
      }
    ]
  },

  "portion_result": {
    "food": "pho",
    "estimated_weight_g": 550
  },

  "nutrition_result": {
    "estimated_calories": 478.5,
    "protein_g": 32.4,
    "carbs_g": 58.7,
    "fat_g": 12.6
  }
}
```

---

# Cấu Trúc Project

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

# Yêu Cầu Hệ Thống

* Python 3.10 hoặc 3.11
* Node.js 18+
* npm
* Git
* Gemini API Key

---

# Cài Đặt Backend

Di chuyển vào backend:

```bash
cd backend
```

Tạo virtual environment:

```bash
python -m venv venv
```

Kích hoạt môi trường ảo:

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Cài dependencies:

```bash
pip install -r requirements.txt
```

Tạo file `.env`:

```env
GEMINI_API_KEY=your_api_key
```

Chạy backend:

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

# Cài Đặt Frontend

Di chuyển vào frontend:

```bash
cd frontend
```

Cài dependencies:

```bash
npm install
```

Chạy frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

# Backend Dependencies

```txt
fastapi
uvicorn
tensorflow
keras
numpy
pillow
opencv-python
python-dotenv
python-multipart
google-generativeai
```

---

# Hướng Phát Triển Trong Tương Lai

 

* Tích hợp YOLOv8 để phát hiện nhiều món ăn
* Áp dụng Food Segmentation để tách vùng thực phẩm
* Ước lượng độ sâu và thể tích món ăn
* Cải thiện độ chính xác tính calo và khẩu phần
* Lưu lịch sử dinh dưỡng người dùng
* Phát triển ứng dụng Android/iOS
* Triển khai hệ thống trên Cloud
* Hỗ trợ nhận diện món ăn thời gian thực
* Mở rộng dataset món ăn Việt Nam
* Tối ưu tốc độ suy luận AI (ONNX/TensorRT)

  

---

# Thành Viên Nhóm

* Lưu Tấn Phát
* Phan Minh Thắng
* Bùi Huỳnh Tuấn Thành
