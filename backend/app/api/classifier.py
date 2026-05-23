import numpy as np
import tensorflow as tf

from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input

MODEL_PATH = "app/models/food_classifier.keras"

IMG_SIZE = (224, 224)

model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    "apple_pie",
    "baby_back_ribs",
    "baklava",
    "banh_bao",
    "banh_beo",
    "banh_bot_loc",
    "banh_can",
    "banh_canh",
    "banh_chung",
    "banh_cuon",
    "banh_duc",
    "banh_gio",
    "banh_khot",
    "banh_mi",
    "banh_pia",
    "banh_tet",
    "banh_trang_nuong",
    "banh_xeo",
    "beef_carpaccio",
    "beef_tartare",
    "beet_salad",
    "beignets",
    "bibimbap",
    "bo_kho",
    "bread_pudding",
    "breakfast_burrito",
    "bruschetta",
    "bun_bo_hue",
    "bun_cha",
    "bun_dau_mam_tom",
    "bun_mam",
    "bun_rieu",
    "bun_thit_nuong",
    "caesar_salad",
    "ca_kho_to",
    "canh_chua",
    "cannoli",
    "cao_lau",
    "caprese_salad",
    "carrot_cake",
    "ceviche",
    "chao_long",
    "cheesecake",
    "cheese_plate",
    "chicken_curry",
    "chicken_quesadilla",
    "chicken_wings",
    "chocolate_cake",
    "chocolate_mousse",
    "churros",
    "clam_chowder",
    "club_sandwich",
    "com_tam",
    "crab_cakes",
    "creme_brulee",
    "croque_madame",
    "cup_cakes",
    "deviled_eggs",
    "donuts",
    "dumplings",
    "edamame",
    "eggs_benedict",
    "escargots",
    "falafel",
    "filet_mignon",
    "fish_and_chips",
    "foie_gras",
    "french_fries",
    "french_onion_soup",
    "french_toast",
    "fried_calamari",
    "fried_rice",
    "frozen_yogurt",
    "garlic_bread",
    "gnocchi",
    "goi_cuon",
    "greek_salad",
    "grilled_cheese_sandwich",
    "grilled_salmon",
    "guacamole",
    "gyoza",
    "hamburger",
    "hot_and_sour_soup",
    "hot_dog",
    "huevos_rancheros",
    "hummus",
    "hu_tieu",
    "hu_tieu_nam_vang",
    "ice_cream",
    "lasagna",
    "lobster_bisque",
    "lobster_roll_sandwich",
    "macaroni_and_cheese",
    "macarons",
    "mi_quang",
    "miso_soup",
    "mussels",
    "nachos",
    "nem_chua",
    "omelette",
    "onion_rings",
    "oysters",
    "pad_thai",
    "paella",
    "pancakes",
    "panna_cotta",
    "peking_duck",
    "pho",
    "pizza",
    "pork_chop",
    "poutine",
    "prime_rib",
    "pulled_pork_sandwich",
    "ramen",
    "ravioli",
    "red_velvet_cake",
    "risotto",
    "samosa",
    "sashimi",
    "scallops",
    "seaweed_salad",
    "shrimp_and_grits",
    "spaghetti_bolognese",
    "spaghetti_carbonara",
    "spring_rolls",
    "steak",
    "strawberry_shortcake",
    "sushi",
    "tacos",
    "takoyaki",
    "tiramisu",
    "tuna_tartare",
    "waffles",
    "xoi_xeo"
]


def preprocess_image(image: Image.Image):

    image = image.convert("RGB")

    img = image.resize(IMG_SIZE)

    img_array = tf.keras.preprocessing.image.img_to_array(img)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = preprocess_input(img_array)

    return img_array


def predict_food(image: Image.Image):

    processed = preprocess_image(image)

    predictions = model.predict(processed, verbose=0)[0]

    max_index = int(np.argmax(predictions))

    confidence = float(predictions[max_index])

    predicted_class = CLASS_NAMES[max_index]

    top_3_indices = np.argsort(predictions)[-3:][::-1]

    top_3 = [
        {
            "food": CLASS_NAMES[i],
            "confidence": round(float(predictions[i]), 4)
        }
        for i in top_3_indices
    ]

    return {
        "food": predicted_class,
        "confidence": round(confidence, 4),
        "top_3": top_3
    }