# 🌿 Aahaar — Indian Food Nutrition Guide

> *"Aahaar"* is the Sanskrit word for food and nourishment.  
> A complete, free nutrition reference built specifically for Indian foods and the Indian lifestyle.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🔗 Live Demo

**[→ View Aahaar Live](https://vickykumar03.github.io/AahaarCheck)**

---

## 📌 About

Most nutrition databases online are built around Western diets — values in cups and ounces, foods like kale and quinoa, no dal, no roti, no paneer.

**Aahaar** fills that gap. It's a 100% frontend nutrition guide covering 80+ traditional Indian foods with complete macronutrient and micronutrient breakdowns, a personalised daily needs calculator, and a food comparison tool — all in one clean, mobile-friendly interface.

Data sourced from **ICMR-NIN (Indian Council of Medical Research — National Institute of Nutrition)** and **USDA** databases.

---

## ✨ Features

### 🥘 Food Database (80+ Indian Foods)
- **8 categories** — Grains & Cereals, Dal & Legumes, Vegetables, Dairy, Snacks & Street Food, Sweets, Beverages, Non-Veg
- Full nutrition per 100g — Calories, Protein, Carbs, Fat, Fiber, Sugar
- Vitamins (A, B1, B2, B3, B6, B12, C, D, E, K, Folate) and Minerals (Iron, Calcium, Magnesium, Zinc, Potassium, Phosphorus)
- **Glycemic Index** for every food — crucial for diabetics and weight management

### 🔍 Search & Filter
- Real-time search by food name, tag, or description
- One-click category filters

### 📊 Food Comparison Tool
- Compare up to 3 foods side by side
- Winner highlighting for each nutrient

### 🧮 Daily Nutrition Calculator
- Uses the **Mifflin-St Jeor BMR formula**
- Inputs: Age, Weight, Height, Gender, Activity Level, Goal (Maintain / Lose / Gain)
- Outputs: Daily kcal target, Protein, Carbs, Fat, Fiber, Water + BMI

### 💡 Indian Diet Tips
- 6 evidence-based tips on meal timing, spice benefits, vegetarian protein pairing, diabetes management, and more

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Playfair Display, DM Sans, Noto Sans Devanagari |
| Data | ICMR-NIN / USDA nutrition databases |
| Hosting | GitHub Pages |

**No frameworks. No dependencies. No build step.** Just open `index.html` in a browser.

---

## 📁 Project Structure

```
aahaar/
├── index.html      # Main HTML — all sections and layout
├── style.css       # Complete styling — saffron + sage theme
├── app.js          # All interactivity — search, modal, compare, calculator
└── data.js         # Nutrition database for 80+ Indian foods
```

---

## 🚀 Getting Started

### Run Locally
```bash
git clone https://github.com/vickykumar03/AahaarCheck.git
cd AahaarCheck
# Just open index.html in your browser — no server needed
open index.html
```

### Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
# Then: Settings → Pages → Branch: main → Save
```

---

## 📸 Screenshots

| Food Browser | Nutrition Modal | Compare Tool |
|---|---|---|
| Search & filter 80+ foods | Full vitamin & mineral breakdown | Side-by-side comparison |

---

## 🥗 Foods Covered (Sample)

| Category | Foods |
|----------|-------|
| Grains | Chapati, Brown Rice, Idli, Dosa, Bajra Roti, Jowar Roti, Poha, Upma, Quinoa |
| Dal & Legumes | Moong Dal, Masoor Dal, Chana Dal, Rajma, Chole, Urad Dal, Moth Beans |
| Vegetables | Palak, Methi, Karela, Lauki, Sweet Potato, Drumstick, Tomato, Pumpkin |
| Dairy | Paneer, Dahi, Ghee, Lassi, Milk, Haldi Doodh |
| Snacks | Samosa, Pakoda, Peanuts, Pani Puri |
| Beverages | Masala Chai, Amla Juice, Coconut Water, Golden Milk |
| Non-Veg | Chicken Curry, Egg, Fish Curry, Mutton |

---

## 👥 Team

| Name | Contribution |
|------|-------------|
| **Vicky Kumar** | Development — HTML, CSS, JS, data research |
| **Yash Kumar Kohle** | UI feedback and design suggestions |
| **Yash Raj Singh** | Testing, QA and edge case catching |
| **Abhay Raj** | Architecture discussions and design inputs |

---

## 📄 License

MIT License — free to use, modify and distribute.

---

## 🙌 Acknowledgements

- **ICMR-NIN** — Indian nutritional data reference
- **USDA FoodData Central** — supplementary nutritional values
- Built as part of the **#30Days30Projects** challenge — Day 28

---

<p align="center">Made with ❤️ in India 🇮🇳 | Eat smart, live well 🌿</p>
