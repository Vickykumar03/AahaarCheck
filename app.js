// =============================================
// AAHAAR — App Logic
// =============================================

let currentCategory = 'all';
let searchQuery = '';

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateCompareSelects();
  renderFoods();
  renderTips();
  setupSearch();
  setupCategoryPills();
  setupModal();
  setupCompare();
  setupCalculator();
  setupNavHamburger();
  revealOnScroll();
});

// ─── FOOD GRID ───────────────────────────────
function renderFoods() {
  const grid = document.getElementById('foodGrid');
  const noResults = document.getElementById('noResults');
  let filtered = FOODS;

  if (currentCategory !== 'all') {
    filtered = filtered.filter(f => f.category === currentCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(q) ||
      (f.tags || []).some(t => t.toLowerCase().includes(q)) ||
      f.description.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'flex';
    return;
  }
  noResults.style.display = 'none';

  grid.innerHTML = filtered.map((food, i) => `
    <div class="food-card" data-id="${food.id}" style="animation-delay:${i * 40}ms">
      <div class="card-emoji">${food.emoji}</div>
      ${food.badge ? `<span class="card-badge">${food.badge}</span>` : ''}
      <h3 class="card-name">${food.name}</h3>
      <p class="card-category">${getCatLabel(food.category)}</p>
      <div class="card-macros">
        <div class="macro-pill macro-protein" title="Protein">
          <span class="macro-icon">💪</span>
          <span>${food.protein}g P</span>
        </div>
        <div class="macro-pill macro-carb" title="Carbs">
          <span class="macro-icon">⚡</span>
          <span>${food.carbs}g C</span>
        </div>
        <div class="macro-pill macro-fat" title="Fat">
          <span class="macro-icon">🫧</span>
          <span>${food.fat}g F</span>
        </div>
      </div>
      <div class="card-cal">
        <span class="cal-num">${food.calories}</span>
        <span class="cal-label">kcal / 100g</span>
      </div>
      <div class="card-bar-wrap">
        ${macroBar(food)}
      </div>
      <button class="card-btn" onclick="openModal('${food.id}')">Full Nutrition →</button>
    </div>
  `).join('');
}

function getCatLabel(cat) {
  const map = {
    grains: 'Grains & Cereals', lentils: 'Dal & Legumes',
    vegetables: 'Vegetables', dairy: 'Dairy',
    snacks: 'Snacks', sweets: 'Sweets',
    beverages: 'Beverages', nonveg: 'Non-Veg'
  };
  return map[cat] || cat;
}

function macroBar(food) {
  const total = food.protein + food.carbs + food.fat;
  if (total === 0) return '';
  const pW = ((food.protein / total) * 100).toFixed(1);
  const cW = ((food.carbs / total) * 100).toFixed(1);
  const fW = ((food.fat / total) * 100).toFixed(1);
  return `<div class="macro-bar">
    <div class="bar-seg bar-p" style="width:${pW}%" title="Protein ${pW}%"></div>
    <div class="bar-seg bar-c" style="width:${cW}%" title="Carbs ${cW}%"></div>
    <div class="bar-seg bar-f" style="width:${fW}%" title="Fat ${fW}%"></div>
  </div>
  <div class="bar-legend">
    <span><span class="dot dot-p"></span>P ${pW}%</span>
    <span><span class="dot dot-c"></span>C ${cW}%</span>
    <span><span class="dot dot-f"></span>F ${fW}%</span>
  </div>`;
}

// ─── SEARCH ───────────────────────────────────
function setupSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');

  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    renderFoods();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    renderFoods();
  });
}

// ─── CATEGORY PILLS ──────────────────────────
function setupCategoryPills() {
  document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      renderFoods();
    });
  });
}

// ─── MODAL ────────────────────────────────────
function setupModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(id) {
  const food = FOODS.find(f => f.id === id);
  if (!food) return;
  document.getElementById('modalInner').innerHTML = buildModalContent(food);
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  animateModalBars();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function buildModalContent(food) {
  const vitaminList = Object.entries(food.vitamins || {}).map(([k, v]) =>
    `<div class="nutrient-chip"><span class="chip-name">Vit ${k}</span><span class="chip-val">${v}${getUnit(k, 'vitamin')}</span></div>`
  ).join('');

  const mineralList = Object.entries(food.minerals || {}).map(([k, v]) =>
    `<div class="nutrient-chip"><span class="chip-name">${k}</span><span class="chip-val">${v}${getUnit(k, 'mineral')}</span></div>`
  ).join('');

  const giColor = food.glycemicIndex < 40 ? '#27ae60' : food.glycemicIndex < 70 ? '#f39c12' : '#e74c3c';
  const giLabel = food.glycemicIndex < 40 ? 'Low GI' : food.glycemicIndex < 70 ? 'Medium GI' : 'High GI';

  return `
    <div class="modal-top">
      <div class="modal-emoji">${food.emoji}</div>
      <div class="modal-title-block">
        <h2>${food.name}</h2>
        <p class="modal-category">${getCatLabel(food.category)} · ${food.serving}</p>
        ${food.badge ? `<span class="modal-badge">${food.badge}</span>` : ''}
      </div>
    </div>
    
    <p class="modal-desc">${food.description}</p>

    <div class="modal-calories-big">
      <span class="cal-big-num">${food.calories}</span>
      <span class="cal-big-label">kcal per 100g</span>
    </div>

    <h4 class="modal-section-title">Macronutrients</h4>
    <div class="macro-detail-grid">
      ${buildMacroDetail('Protein', food.protein, 'g', '#e74c3c', '💪', 'Muscle building & repair')}
      ${buildMacroDetail('Carbohydrates', food.carbs, 'g', '#f39c12', '⚡', 'Primary energy source')}
      ${buildMacroDetail('Total Fat', food.fat, 'g', '#9b59b6', '🫧', 'Hormone & brain health')}
      ${buildMacroDetail('Dietary Fiber', food.fiber, 'g', '#27ae60', '🌿', 'Gut health & satiety')}
      ${buildMacroDetail('Sugar', food.sugar, 'g', '#e67e22', '🍬', 'Simple carbohydrates')}
    </div>

    <div class="stacked-bar-wrap">
      <h4 class="modal-section-title">Macro Distribution</h4>
      ${buildStackedBar(food)}
    </div>

    <div class="gi-block">
      <span class="gi-label">Glycemic Index</span>
      <span class="gi-badge" style="background:${giColor}">${food.glycemicIndex} — ${giLabel}</span>
    </div>

    ${vitaminList ? `<h4 class="modal-section-title">Vitamins (per 100g)</h4><div class="nutrient-chips">${vitaminList}</div>` : ''}
    ${mineralList ? `<h4 class="modal-section-title">Minerals & Electrolytes (mg per 100g)</h4><div class="nutrient-chips">${mineralList}</div>` : ''}

    <div class="health-tip-box">
      <span class="tip-icon">💡</span>
      <div>
        <strong>Diet Tip</strong>
        <p>${food.healthTip}</p>
      </div>
    </div>

    <div class="modal-tags">
      ${(food.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}
    </div>
  `;
}

function buildMacroDetail(name, value, unit, color, icon, subtitle) {
  const maxMap = { Protein: 50, Carbohydrates: 100, 'Total Fat': 80, 'Dietary Fiber': 38, Sugar: 50 };
  const max = maxMap[name] || 100;
  const pct = Math.min((value / max) * 100, 100);
  return `
    <div class="macro-detail-card">
      <div class="mdc-header">
        <span class="mdc-icon">${icon}</span>
        <div>
          <span class="mdc-name">${name}</span>
          <span class="mdc-sub">${subtitle}</span>
        </div>
        <span class="mdc-value" style="color:${color}">${value}${unit}</span>
      </div>
      <div class="mdc-bar-bg">
        <div class="mdc-bar-fill modal-bar" style="background:${color};width:0%" data-width="${pct}%"></div>
      </div>
    </div>
  `;
}

function buildStackedBar(food) {
  const total = food.protein + food.carbs + food.fat + food.fiber;
  if (!total) return '';
  const segments = [
    { label: 'Protein', val: food.protein, color: '#e74c3c' },
    { label: 'Carbs', val: food.carbs, color: '#f39c12' },
    { label: 'Fat', val: food.fat, color: '#9b59b6' },
    { label: 'Fiber', val: food.fiber, color: '#27ae60' },
  ];
  const bars = segments.map(s => {
    const pct = ((s.val / total) * 100).toFixed(1);
    return `<div class="stack-seg" style="width:${pct}%;background:${s.color}" title="${s.label}: ${s.val}g (${pct}%)"></div>`;
  }).join('');
  const legend = segments.map(s => `
    <span class="stack-legend-item">
      <span class="stack-dot" style="background:${s.color}"></span>${s.label} ${s.val}g
    </span>`).join('');
  return `<div class="stacked-bar">${bars}</div><div class="stack-legend">${legend}</div>`;
}

function getUnit(key, type) {
  const mcg = ['A', 'D', 'K', 'B12', 'Folate', 'Selenium'];
  if (mcg.includes(key)) return ' µg';
  if (key === 'Omega3') return 'g';
  return ' mg';
}

function animateModalBars() {
  setTimeout(() => {
    document.querySelectorAll('.modal-bar').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 80);
}

// ─── COMPARE ──────────────────────────────────
function populateCompareSelects() {
  const options = FOODS.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  ['compareSelect0', 'compareSelect1', 'compareSelect2'].forEach(id => {
    document.getElementById(id).innerHTML = '<option value="">— Choose food —</option>' + options;
  });
}

function setupCompare() {
  document.getElementById('compareBtn').addEventListener('click', () => {
    const ids = ['compareSelect0', 'compareSelect1', 'compareSelect2']
      .map(id => document.getElementById(id).value)
      .filter(Boolean);

    if (ids.length < 2) {
      showNotice('Please select at least 2 foods to compare.');
      return;
    }

    const foods = ids.map(id => FOODS.find(f => f.id === id)).filter(Boolean);
    renderCompareTable(foods);
  });
}

function renderCompareTable(foods) {
  const result = document.getElementById('compareResult');
  const fields = [
    { key: 'calories', label: 'Calories (kcal)', icon: '🔥', higherWorse: true },
    { key: 'protein', label: 'Protein (g)', icon: '💪', higherWorse: false },
    { key: 'carbs', label: 'Carbs (g)', icon: '⚡', higherWorse: false },
    { key: 'fat', label: 'Fat (g)', icon: '🫧', higherWorse: false },
    { key: 'fiber', label: 'Fiber (g)', icon: '🌿', higherWorse: false },
    { key: 'sugar', label: 'Sugar (g)', icon: '🍬', higherWorse: true },
  ];

  const header = `<tr><th>Nutrient</th>${foods.map(f => `<th>${f.emoji} ${f.name}</th>`).join('')}</tr>`;

  const rows = fields.map(({ key, label, icon, higherWorse }) => {
    const vals = foods.map(f => Number(f[key]));
    const best = higherWorse ? Math.min(...vals) : Math.max(...vals);

    const cells = foods.map(f => {
      const isBest = Number(f[key]) === best;
      return `<td class="${isBest ? 'best-val' : ''}">${f[key]}${isBest ? ' ✓' : ''}</td>`;
    }).join('');

    return `<tr><td class="field-label">${icon} ${label}</td>${cells}</tr>`;
  }).join('');

  result.innerHTML = `
    <div class="compare-note">✓ marks the healthier value for each nutrient</div>
    <div class="compare-table-wrap">
      <table class="compare-table"><thead>${header}</thead><tbody>${rows}</tbody></table>
    </div>
  `;
  result.classList.add('visible');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── CALCULATOR ───────────────────────────────
function setupCalculator() {
  document.getElementById('calcBtn').addEventListener('click', () => {
    const age = +document.getElementById('calcAge').value;
    const weight = +document.getElementById('calcWeight').value;
    const height = +document.getElementById('calcHeight').value;
    const gender = document.getElementById('calcGender').value;
    const activity = +document.getElementById('calcActivity').value;
    const goal = document.getElementById('calcGoal').value;

    if (!age || !weight || !height) {
      showNotice('Please fill in age, weight and height.');
      return;
    }

    // Mifflin-St Jeor BMR
    let bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    let tdee = bmr * activity;
    if (goal === 'lose') tdee -= 400;
    if (goal === 'gain') tdee += 300;

    const protein = Math.round(weight * (goal === 'gain' ? 2.0 : goal === 'lose' ? 1.8 : 1.5));
    const fat = Math.round((tdee * 0.28) / 9);
    const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);
    const fiber = gender === 'male' ? 38 : 25;
    const water = Math.round(weight * 35);

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const bmiCat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    const bmiColor = bmi < 18.5 ? '#3498db' : bmi < 25 ? '#27ae60' : bmi < 30 ? '#f39c12' : '#e74c3c';

    const goalText = { maintain: 'Maintain Weight', lose: 'Lose Weight', gain: 'Gain Muscle' }[goal];

    document.getElementById('calcResult').innerHTML = `
      <div class="result-goal-tag">${goalText}</div>
      <div class="result-bmi">
        <span>BMI: <strong style="color:${bmiColor}">${bmi}</strong></span>
        <span class="bmi-cat" style="color:${bmiColor}">${bmiCat}</span>
      </div>
      <div class="result-tdee">
        <span class="tdee-num">${Math.round(tdee)}</span>
        <span class="tdee-label">kcal / day target</span>
      </div>
      <div class="result-macros-grid">
        ${buildResultCard('💪', 'Protein', protein, 'g/day', '#e74c3c', `~${Math.round(protein/weight*10)/10}g per kg body weight`)}
        ${buildResultCard('⚡', 'Carbohydrates', carbs, 'g/day', '#f39c12', 'Prefer complex carbs')}
        ${buildResultCard('🫧', 'Healthy Fats', fat, 'g/day', '#9b59b6', 'Include ghee, nuts, fish')}
        ${buildResultCard('🌿', 'Dietary Fiber', fiber, 'g/day', '#27ae60', 'Dal, veggies, whole grains')}
        ${buildResultCard('💧', 'Water', water, 'ml/day', '#3498db', `~${Math.round(water/250)} glasses`)}
      </div>
      <div class="result-tip">
        <strong>💡 Indian Foods to hit your targets:</strong>
        <ul>
          <li><strong>Protein:</strong> 2 cups dal + 100g paneer/chicken + curd daily</li>
          <li><strong>Fiber:</strong> 3 servings vegetables + 2 bajra/jowar rotis</li>
          <li><strong>Iron:</strong> Rajma + spinach + amla juice every day</li>
        </ul>
      </div>
    `;
    document.getElementById('calcResult').style.display = 'block';
  });
}

function buildResultCard(icon, name, val, unit, color, note) {
  return `
    <div class="result-card" style="border-color:${color}20">
      <span class="rc-icon">${icon}</span>
      <span class="rc-name">${name}</span>
      <span class="rc-val" style="color:${color}">${val}<span class="rc-unit">${unit}</span></span>
      <span class="rc-note">${note}</span>
    </div>
  `;
}

// ─── TIPS ─────────────────────────────────────
function renderTips() {
  document.getElementById('tipsGrid').innerHTML = TIPS.map((tip, i) => `
    <div class="tip-card reveal" style="animation-delay:${i * 80}ms">
      <span class="tip-icon-big">${tip.icon}</span>
      <span class="tip-tag-badge">${tip.tag}</span>
      <h3>${tip.title}</h3>
      <p>${tip.body}</p>
    </div>
  `).join('');
}

// ─── HELPERS ─────────────────────────────────
function showNotice(msg) {
  const el = document.createElement('div');
  el.className = 'notice-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3000);
}

function setupNavHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

function revealOnScroll() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.nav-links').classList.remove('open');
  });
});
