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
Phân tích bức ảnh này và dự đoán chính xác khối lượng thức ăn trong ảnh tính bằng gam.

Trả về dưới dạng json với cấu trúc như sau:
danh sách các món ăn được dự đoán trong ảnh:
apple_pie
baby_back_ribs
baklava
banh_bao
banh_beo
banh_bot_loc
banh_can
banh_canh
banh_chung
banh_cuon
banh_duc
banh_gio
banh_khot
banh_mi
banh_pia
banh_tet
banh_trang_nuong
banh_xeo
beef_carpaccio
beef_tartare
beet_salad
beignets
bibimbap
bo_kho
bread_pudding
breakfast_burrito
bruschetta
bun_bo_hue
bun_cha
bun_dau_mam_tom
bun_mam
bun_rieu
bun_thit_nuong
caesar_salad
ca_kho_to
canh_chua
cannoli
cao_lau
caprese_salad
carrot_cake
ceviche
chao_long
cheesecake
cheese_plate
chicken_curry
chicken_quesadilla
chicken_wings
chocolate_cake
chocolate_mousse
churros
clam_chowder
club_sandwich
com_tam
crab_cakes
creme_brulee
croque_madame
cup_cakes
deviled_eggs
donuts
dumplings
edamame
eggs_benedict
escargots
falafel
filet_mignon
fish_and_chips
foie_gras
french_fries
french_onion_soup
french_toast
fried_calamari
fried_rice
frozen_yogurt
garlic_bread
gnocchi
goi_cuon
greek_salad
grilled_cheese_sandwich
grilled_salmon
guacamole
gyoza
hamburger
hot_and_sour_soup
hot_dog
huevos_rancheros
hummus
hu_tieu
hu_tieu_nam_vang
ice_cream
lasagna
lobster_bisque
lobster_roll_sandwich
macaroni_and_cheese
macarons
mi_quang
miso_soup
mussels
nachos
nem_chua
omelette
onion_rings
oysters
pad_thai
paella
pancakes
panna_cotta
peking_duck
pho
pizza
pork_chop
poutine
prime_rib
pulled_pork_sandwich
ramen
ravioli
red_velvet_cake
risotto
samosa
sashimi
scallops
seaweed_salad
shrimp_and_grits
spaghetti_bolognese
spaghetti_carbonara
spring_rolls
steak
strawberry_shortcake
sushi
tacos
takoyaki
tiramisu
tuna_tartare
waffles
xoi_xeo
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