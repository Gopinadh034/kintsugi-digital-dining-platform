/**
 * app.js - Main Application Logic for KINTSUGI Japanese Haute Dining & 3D Interactive Showcase
 * Features: Three.js 3D stage sync, Japanese cuisine catalog + DummyJSON fallback,
 * 3D Dish Inspection modal, Order Tray cart drawer, Table Reservation, Search, Filters, and Favorites.
 */

// Japanese Haute Dining Curated Specialties Catalog
const JAPANESE_CATALOG = [
    {
        id: 101,
        name: 'Imperial Dragon King Nigiri Platter',
        kanji: '極上 龍王 握り盛り合わせ',
        cuisine: 'Japanese / Edomae Sushi',
        dishType: 'sushi',
        stage3DIndex: 0,
        price: 5799,
        rating: 4.95,
        reviewsCount: 142,
        caloriesPerServing: 420,
        prepTimeMinutes: 18,
        cookTimeMinutes: 0,
        difficulty: 'Master Craft',
        spiciness: 1,
        isChefSpecial: true,
        isMichelin: true,
        tags: ['Sushi', 'Raw Bar', 'Chef Special', 'Michelin Select', 'Gluten-Free'],
        mealType: ['Dinner', 'Omakase'],
        image: 'images/japanese_sushi_platter_1786549536224.png',
        fallbackImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
        description: 'Tasting flight of Norwegian Bluefin Otoro, Wild Tasmanian King Salmon, Hokkaido Sea Urchin (Uni), and Caspian Caviar draped with 24-karat edible gold leaves over seasoned Koshihikari shari.',
        story: 'Prepared in the strict 200-year-old Edomae tradition using vintage red akazu vinegar and fish aged for 5 to 14 days under cedar kelp wrap to reach peak glutamic umami.',
        ingredients: [
            'Aged Bluefin Otoro Belly',
            'Tasmanian King Salmon',
            'Hokkaido Murasaki Sea Urchin',
            'Freshly Grated Shizuoka Wasabi',
            'Aged Akazu Red Vinegar Koshihikari Rice',
            '24k Edible Gold Leaf',
            'Barrel-Aged Smoked Shoyu'
        ],
        flavorRadar: { umami: 98, sweetness: 45, heat: 20, richness: 92, acidity: 40 },
        pairing: 'Dassai 23 Junmai Daiginjo (Dassai Brewery, Yamaguchi)'
    },
    {
        id: 102,
        name: 'Smoked Tonkotsu Black Garlic Ramen',
        kanji: '特製 黒大蒜 豚骨拉麺',
        cuisine: 'Japanese / Hakata Ramen',
        dishType: 'ramen',
        stage3DIndex: 1,
        price: 2699,
        rating: 4.92,
        reviewsCount: 218,
        caloriesPerServing: 680,
        prepTimeMinutes: 25,
        cookTimeMinutes: 120,
        difficulty: 'Artisanal',
        spiciness: 2,
        isChefSpecial: true,
        isMichelin: true,
        tags: ['Ramen', 'Chef Special', 'Popular', 'Hot Broth'],
        mealType: ['Lunch', 'Dinner'],
        image: 'images/japanese_ramen_bowl_1786549497339.png',
        fallbackImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
        description: '24-hour simmered Berkshire pork bone broth infused with charred black garlic oil (mayu), hand-pulled wavy noodles, torched chashu pork belly, marinated ajitsuke egg, and menma.',
        story: 'Broth simmered over binchotan embers for a full solar cycle to extract deep marrow collagen, producing a velvety soup with unprecedented aroma.',
        ingredients: [
            '24h Simmered Berkshire Pork Bone Broth',
            'Hand-Pulled Wavy Alkaline Noodles',
            'Sous-Vide & Torched Chashu Pork Belly',
            '7-Minute Soy-Marinated Ajitsuke Egg',
            'Roasted Black Garlic Mayu Oil',
            'Crispy Roasted Nori Seaweed',
            'Fermented Menma Bamboo Shoots'
        ],
        flavorRadar: { umami: 99, sweetness: 35, heat: 35, richness: 96, acidity: 15 },
        pairing: 'Echigo Koshihikari Rice Beer or Yoichi Single Malt Highball'
    },
    {
        id: 103,
        name: 'Miyazaki A5 Wagyu Robatayaki Skewers',
        kanji: '宮崎牛 A5 炉端焼き 炭火串',
        cuisine: 'Japanese / Robatayaki',
        dishType: 'wagyu',
        stage3DIndex: 2,
        price: 7499,
        rating: 4.98,
        reviewsCount: 96,
        caloriesPerServing: 540,
        prepTimeMinutes: 15,
        cookTimeMinutes: 12,
        difficulty: 'Master Craft',
        spiciness: 0,
        isChefSpecial: true,
        isMichelin: true,
        tags: ['Wagyu', 'Robata', 'Michelin Select', 'Gluten-Free', 'Grill'],
        mealType: ['Dinner', 'Chef Special'],
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        fallbackImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        description: 'Certified Miyazaki A5 black cattle tenderloin char-grilled over Kishu Binchotan white oak coals, brushed with 10-year tare glaze, served with fresh Shizuoka wasabi and smoked sea salt.',
        story: 'Sourced directly from certified heritage farms in Miyazaki prefecture, boasting BMS (Beef Marbling Score) 11 with a melting point lower than human body temperature.',
        ingredients: [
            'Miyazaki A5 Japanese Wagyu Rib Cap',
            '10-Year Aged Tamari Tare Glaze',
            'Kishu Binchotan White Oak Coals Smoke',
            'Freshly Grated Shizuoka Shark-Skin Wasabi',
            'Maldon Smoked Flake Sea Salt',
            'Grilled Enoki & King Oyster Mushrooms'
        ],
        flavorRadar: { umami: 96, sweetness: 50, heat: 10, richness: 98, acidity: 10 },
        pairing: 'Kenbishi Mizuho Junmai Sake or 2018 Kenzo Estate Rindo Cabernet'
    },
    {
        id: 104,
        name: 'Ceremonial Matcha Mousse & Gold Dome',
        kanji: '宇治 抹茶 ムース 金箔仕立て',
        cuisine: 'Japanese / Wagashi Dessert',
        dishType: 'matcha',
        stage3DIndex: 3,
        price: 1999,
        rating: 4.88,
        reviewsCount: 88,
        caloriesPerServing: 310,
        prepTimeMinutes: 30,
        cookTimeMinutes: 0,
        difficulty: 'Pastry Art',
        spiciness: 0,
        isChefSpecial: false,
        isMichelin: false,
        tags: ['Matcha', 'Dessert', 'Vegetarian', 'Sweet'],
        mealType: ['Dessert', 'Snack'],
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
        fallbackImage: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
        description: 'First-harvest Uji ceremonial matcha whipped mousse layered over black sesame dacquoise sponge, yuzu citrus curd heart, red bean mochi pearls, and edible gold flakes.',
        story: 'Crafted using spring harvest tencha tea leaves stone-ground for over 3 hours at Kyoto Marukyu Koyamaen to preserve vibrant chlorophyll and delicate sweet fragrance.',
        ingredients: [
            'Kyoto Uji Ceremonial Grade Matcha Powder',
            'Organic Hokkaido Whipped Cream',
            'Yuzu Citrus Gelee Core',
            'Kurogoma Black Sesame Dacquoise',
            'Sweetened Azuki Red Bean Pearls',
            '24k Gold Leaf Flakes'
        ],
        flavorRadar: { umami: 40, sweetness: 75, heat: 0, richness: 65, acidity: 55 },
        pairing: 'Whisked Ippodo Gyokuro Green Tea or Japanese Plum Umeshu on the Rocks'
    },
    {
        id: 105,
        name: 'Crispy Black Truffle Wagyu Gyoza',
        kanji: '黒トリュフ 和牛 焼き餃子',
        cuisine: 'Japanese / Izakaya Starters',
        dishType: 'gyoza',
        stage3DIndex: 4,
        price: 2399,
        rating: 4.90,
        reviewsCount: 165,
        caloriesPerServing: 380,
        prepTimeMinutes: 20,
        cookTimeMinutes: 10,
        difficulty: 'Easy',
        spiciness: 1,
        isChefSpecial: true,
        isMichelin: false,
        tags: ['Izakaya', 'Dumpling', 'Popular', 'Truffle'],
        mealType: ['Lunch', 'Dinner', 'Snack'],
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80',
        fallbackImage: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80',
        description: 'Handmade pan-seared dumplings stuffed with minced Wagyu beef, Berkshire pork, black winter truffle essence, and scallions, served with a crispy lace skirt and yuzu ponzu dip.',
        story: 'Pan-seared on cast iron with a delicate potato starch lace lattice, giving an unforgettable shatter-crisp crunch yielding to luscious juicy filling.',
        ingredients: [
            'Hand-Rolled Ultra-Thin Gyoza Wrappers',
            'Minced Japanese Wagyu & Kurobuta Pork',
            'Perigord Black Winter Truffle Pate',
            'Organic Garlic Chives & Scallions',
            'Cold-Pressed Sesame Oil',
            'Aged Yuzu Citrus Soy Dipping Sauce'
        ],
        flavorRadar: { umami: 94, sweetness: 30, heat: 25, richness: 85, acidity: 45 },
        pairing: 'Asahi Super Dry Draft or Suntory Yamazaki Highball'
    },
    {
        id: 106,
        name: 'Hakutsuru Junmai Daiginjo & Omakase Sake Flight',
        kanji: '純米大吟醸 利き酒 セット',
        cuisine: 'Japanese / Artisanal Sake',
        dishType: 'sake',
        stage3DIndex: 5,
        price: 3799,
        rating: 4.96,
        reviewsCount: 74,
        caloriesPerServing: 160,
        prepTimeMinutes: 5,
        cookTimeMinutes: 0,
        difficulty: 'Sommelier',
        spiciness: 0,
        isChefSpecial: true,
        isMichelin: true,
        tags: ['Sake', 'Drinks', 'Omakase', 'Michelin Select'],
        mealType: ['Dinner', 'Drinks'],
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
        fallbackImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
        description: 'Trio of ultra-premium Japanese sakes milled to 35% Yamada Nishiki rice grain, served in hand-blown Edo Kiriko crystal ochoko cups over crushed cedar ice.',
        story: 'Brewed during the depths of winter using alpine snowmelt water from Hyogo, providing notes of white peach, melon blossom, and velvet mineral finish.',
        ingredients: [
            'Yamada Nishiki 35% Polished Rice',
            'Alpine Snowmelt Mineral Water',
            'Heritage Koji Kin Mold',
            'Handmade Edo Kiriko Crystal Glassware',
            'Japanese Hinoki Cedar Wood Stand'
        ],
        flavorRadar: { umami: 70, sweetness: 60, heat: 0, richness: 30, acidity: 35 },
        pairing: 'Pairs harmoniously with Fresh Sashimi, Uni, and Caviar'
    }
];

// Application State
const state = {
    allRecipes: [...JAPANESE_CATALOG],
    currentDisplayList: [...JAPANESE_CATALOG],
    favorites: JSON.parse(localStorage.getItem('kintsugi_favorites') || '[]'),
    cart: JSON.parse(localStorage.getItem('kintsugi_cart') || '[]'),
    currentMealType: 'All',
    currentTag: 'All',
    currentSearch: '',
    sortBy: 'recommended',
    selected3DDishIndex: 0,
    currentModalRecipe: null,
    activeApiUrl: 'https://dummyjson.com/recipes?limit=50',
    apiLatencyMs: 0
};

// DOM References
const recipesGrid = document.getElementById('recipesGrid');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('recipeSearchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const emptyGridState = document.getElementById('emptyGridState');
const activeApiUrlEl = document.getElementById('activeApiUrl');
const apiStatusBadge = document.getElementById('apiStatusBadge');
const apiLatencyBadge = document.getElementById('apiLatencyBadge');
const apiCountBadge = document.getElementById('apiCountBadge');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const cartBadgeCount = document.getElementById('cartBadgeCount');
const cartSubtotalPrice = document.getElementById('cartSubtotalPrice');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const dishDetailModal = document.getElementById('dishDetailModal');
const reservationModal = document.getElementById('reservationModal');

// Format price in Indian Rupees with commas
function formatINR(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAllDummyJsonRecipes();
    updateCartUI();
    renderHeroFeaturedDish(0);
    setup3DControls();
});

/**
 * Format raw DummyJSON recipe object into unified presentation format
 */
function formatDummyRecipe(r) {
    const kanjiMap = {
        'Italian': 'イタリアン創作',
        'Asian': 'アジア特選料理',
        'Japanese': '極上 日本料理',
        'Mexican': 'メキシカン極み',
        'Indian': 'スパイス懐石',
        'American': 'グリル特選',
        'Greek': '地中海美食',
        'Thai': 'タイ宮廷料理'
    };

    const kanji = kanjiMap[r.cuisine] || '厳選 おすすめ料理';
    const price = Math.floor(((r.caloriesPerServing ? r.caloriesPerServing / 20 : 25) + 15) * 83);

    return {
        id: r.id, // Original DummyJSON ID (1 to 50)
        isExternal: true,
        name: r.name,
        kanji: kanji,
        cuisine: r.cuisine ? `${r.cuisine} Cuisine` : 'International Gourmet',
        dishType: (r.mealType && r.mealType[0]) ? r.mealType[0].toLowerCase() : 'gourmet',
        stage3DIndex: (r.id % 6), // Cycle through 3D models
        price: price,
        rating: r.rating || 4.8,
        reviewsCount: r.reviewCount || Math.floor(40 + (r.id * 7) % 160),
        caloriesPerServing: r.caloriesPerServing || 450,
        prepTimeMinutes: r.prepTimeMinutes || 20,
        cookTimeMinutes: r.cookTimeMinutes || 25,
        servings: r.servings || 4,
        difficulty: r.difficulty || 'Medium',
        spiciness: r.difficulty === 'Hard' ? 2 : (r.difficulty === 'Medium' ? 1 : 0),
        isChefSpecial: r.rating >= 4.8,
        isMichelin: r.rating >= 4.9,
        tags: r.tags || ['Gourmet', 'Specialty'],
        mealType: r.mealType || ['Dinner'],
        image: r.image,
        fallbackImage: r.image,
        description: `Artisanal ${r.cuisine || 'gourmet'} delicacy prepared with premium seasonal ingredients, harmonizing rich tradition and contemporary plating precision.`,
        story: `Crafted according to culinary excellence standards, balancing delicate aromas, textural harmony, and nutritional value.`,
        ingredients: r.ingredients || [],
        instructions: r.instructions || [],
        flavorRadar: {
            umami: Math.min(98, Math.floor(65 + ((r.id * 13) % 32))),
            sweetness: Math.min(90, Math.floor(30 + ((r.id * 17) % 55))),
            heat: (r.tags && r.tags.some(t => /spicy|chili|curry/i.test(t))) ? 75 : 20,
            richness: Math.min(95, Math.floor(55 + ((r.id * 19) % 40))),
            acidity: Math.min(85, Math.floor(25 + ((r.id * 11) % 50)))
        },
        pairing: r.cuisine === 'Italian' 
            ? 'Barolo DOCG or Crisp Junmai Ginjo Sake' 
            : (r.cuisine === 'Japanese' || r.cuisine === 'Asian' 
                ? 'Dassai 23 Junmai Daiginjo' 
                : 'House Reserve Sake or High-Mountain Green Tea')
    };
}

/**
 * Update the Live API Monitor HUD UI
 */
function updateApiMonitorHUD(url, count, status = '200 OK', latencyMs = 0) {
    state.activeApiUrl = url;
    state.apiLatencyMs = latencyMs;

    if (activeApiUrlEl) activeApiUrlEl.innerText = url;
    if (apiStatusBadge) {
        apiStatusBadge.innerHTML = status === '200 OK'
            ? `<i class="fas fa-check-circle"></i> ${status}`
            : `<i class="fas fa-exclamation-triangle"></i> ${status}`;
        apiStatusBadge.className = status === '200 OK' ? 'api-status-badge' : 'api-status-badge status-err';
    }
    if (apiLatencyBadge) apiLatencyBadge.innerHTML = `<i class="fas fa-bolt"></i> ${latencyMs}ms`;
    if (apiCountBadge) apiCountBadge.innerHTML = `<i class="fas fa-database"></i> ${count} Recipes`;
}

/* ==========================================================================
   1. GET ALL RECIPES (Endpoint 1: https://dummyjson.com/recipes)
   ========================================================================== */
async function fetchAllDummyJsonRecipes() {
    const url = 'https://dummyjson.com/recipes?limit=50';
    const startTime = performance.now();

    try {
        const response = await fetch(url);
        const latency = Math.round(performance.now() - startTime);

        if (response.ok) {
            const data = await response.json();
            const dummyList = (data.recipes || []).map(formatDummyRecipe);

            // Combine curated Japanese Kaiseki specialties with DummyJSON items
            state.allRecipes = [...JAPANESE_CATALOG, ...dummyList];
            state.currentDisplayList = [...state.allRecipes];

            updateApiMonitorHUD(url, state.allRecipes.length, '200 OK', latency);
            applySortingAndRender();
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (err) {
        console.warn('API fetch fallback to local catalog:', err);
        const latency = Math.round(performance.now() - startTime);
        state.allRecipes = [...JAPANESE_CATALOG];
        state.currentDisplayList = [...state.allRecipes];
        updateApiMonitorHUD(url, state.allRecipes.length, 'Offline / Cache', latency);
        applySortingAndRender();
    }
}

/* ==========================================================================
   2. GET SINGLE RECIPE (Endpoint 2: https://dummyjson.com/recipes/{id})
   ========================================================================== */
async function fetchSingleRecipeApi(id) {
    // Check if it's already a local Japanese dish
    const local = JAPANESE_CATALOG.find(d => d.id === id);
    if (local) {
        return local;
    }

    const url = `https://dummyjson.com/recipes/${id}`;
    const startTime = performance.now();

    try {
        const res = await fetch(url);
        const latency = Math.round(performance.now() - startTime);
        if (res.ok) {
            const raw = await res.json();
            const formatted = formatDummyRecipe(raw);
            updateApiMonitorHUD(url, 1, '200 OK', latency);
            return formatted;
        }
    } catch (e) {
        console.warn('Single recipe fetch failed, finding in memory:', e);
    }

    return state.allRecipes.find(r => r.id === id) || JAPANESE_CATALOG[0];
}

/* ==========================================================================
   3. SEARCH RECIPES (Endpoint 3: https://dummyjson.com/recipes/search?q={query})
   ========================================================================== */
let searchDebounceTimer = null;

function handleSearch(event) {
    const q = event.target.value.trim();
    state.currentSearch = q;

    if (searchClearBtn) {
        searchClearBtn.style.display = q ? 'flex' : 'none';
    }

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        executeSearchApi(q);
    }, 280);
}

function clearSearch() {
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    state.currentSearch = '';
    executeSearchApi('');
}

function quickSearchQuery(term) {
    if (searchInput) {
        searchInput.value = term;
        if (searchClearBtn) searchClearBtn.style.display = 'flex';
    }
    state.currentSearch = term;
    executeSearchApi(term);
    if (window.zenAudio) window.zenAudio.playChime();
}

async function executeSearchApi(query) {
    if (!query) {
        // Reset to all or active meal/tag filter
        if (state.currentMealType !== 'All') {
            filterByMealType(state.currentMealType);
        } else if (state.currentTag !== 'All') {
            filterByTag(state.currentTag);
        } else {
            state.currentDisplayList = [...state.allRecipes];
            updateApiMonitorHUD('https://dummyjson.com/recipes?limit=50', state.currentDisplayList.length, '200 OK', 10);
            applySortingAndRender();
        }
        return;
    }

    const url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}`;
    const startTime = performance.now();

    try {
        const response = await fetch(url);
        const latency = Math.round(performance.now() - startTime);

        if (response.ok) {
            const data = await response.json();
            const apiMatches = (data.recipes || []).map(formatDummyRecipe);

            // Also search local Japanese catalog
            const qLower = query.toLowerCase();
            const localMatches = JAPANESE_CATALOG.filter(d => 
                d.name.toLowerCase().includes(qLower) ||
                d.kanji.includes(query) ||
                d.cuisine.toLowerCase().includes(qLower) ||
                d.tags.some(t => t.toLowerCase().includes(qLower)) ||
                (d.description && d.description.toLowerCase().includes(qLower))
            );

            // Merge unique
            const combined = [...localMatches, ...apiMatches.filter(a => !localMatches.some(l => l.name.toLowerCase() === a.name.toLowerCase()))];
            state.currentDisplayList = combined;

            updateApiMonitorHUD(url, combined.length, '200 OK', latency);
            applySortingAndRender();
        }
    } catch (e) {
        console.warn('Search API fallback:', e);
        // Local filtering
        const qLower = query.toLowerCase();
        state.currentDisplayList = state.allRecipes.filter(d => 
            d.name.toLowerCase().includes(qLower) ||
            d.kanji.includes(query) ||
            d.tags.some(t => t.toLowerCase().includes(qLower))
        );
        updateApiMonitorHUD(url, state.currentDisplayList.length, 'Cached Search', 5);
        applySortingAndRender();
    }
}

/* ==========================================================================
   4. FILTER BY TAGS (Endpoint 4: https://dummyjson.com/recipes/tag/{tag})
   ========================================================================== */
async function filterByTag(tag, element) {
    state.currentTag = tag;
    
    // Sync dropdown select element
    const tagSelect = document.getElementById('tagSelect');
    if (tagSelect) tagSelect.value = tag;
    
    // Update active pill UI
    const pills = document.querySelectorAll('#tagPills .pill');
    pills.forEach(p => p.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else {
        pills.forEach(p => {
            if (p.textContent.includes(tag)) p.classList.add('active');
        });
    }

    if (tag === 'All') {
        state.currentDisplayList = [...state.allRecipes];
        updateApiMonitorHUD('https://dummyjson.com/recipes?limit=50', state.currentDisplayList.length, '200 OK', 12);
        applySortingAndRender();
        return;
    }

    const url = `https://dummyjson.com/recipes/tag/${encodeURIComponent(tag)}`;
    const startTime = performance.now();

    try {
        const response = await fetch(url);
        const latency = Math.round(performance.now() - startTime);

        if (response.ok) {
            const data = await response.json();
            const apiItems = (data.recipes || []).map(formatDummyRecipe);

            // Supplement with local Japanese items matching tag
            const tagLower = tag.toLowerCase();
            const localItems = JAPANESE_CATALOG.filter(d => 
                d.tags.some(t => t.toLowerCase().includes(tagLower)) ||
                (d.dishType && d.dishType.toLowerCase().includes(tagLower))
            );

            const combined = [...localItems, ...apiItems.filter(a => !localItems.some(l => l.name.toLowerCase() === a.name.toLowerCase()))];
            state.currentDisplayList = combined;

            updateApiMonitorHUD(url, combined.length, '200 OK', latency);
            applySortingAndRender();
        }
    } catch (e) {
        console.warn('Tag filter fallback:', e);
        const tagLower = tag.toLowerCase();
        state.currentDisplayList = state.allRecipes.filter(d => 
            d.tags.some(t => t.toLowerCase().includes(tagLower))
        );
        updateApiMonitorHUD(url, state.currentDisplayList.length, 'Cached Filter', 5);
        applySortingAndRender();
    }

    // 3D background camera/dish sync
    if (window.stage3D) {
        const tagDishMap = { 'Japanese': 0, 'Asian': 1, 'Beef': 2, 'Dessert': 3, 'Italian': 4, 'Seafood': 0 };
        if (tagDishMap[tag] !== undefined) {
            window.stage3D.rotateToDish(tagDishMap[tag]);
            renderHeroFeaturedDish(tagDishMap[tag]);
        }
    }

    if (window.zenAudio) window.zenAudio.playChime();
}

/* ==========================================================================
   5. FILTER BY MEAL TYPE (Endpoint 5: https://dummyjson.com/recipes/meal-type/{mealType})
   ========================================================================== */
async function filterByMealType(mealType, element) {
    state.currentMealType = mealType;

    // Sync dropdown select element
    const mealSelect = document.getElementById('mealTypeSelect');
    if (mealSelect) mealSelect.value = mealType;

    // Update active meal pill UI
    const pills = document.querySelectorAll('#mealTypePills .pill');
    pills.forEach(p => p.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else {
        pills.forEach(p => {
            if (p.textContent.includes(mealType)) p.classList.add('active');
        });
    }

    if (mealType === 'All') {
        state.currentDisplayList = [...state.allRecipes];
        updateApiMonitorHUD('https://dummyjson.com/recipes?limit=50', state.currentDisplayList.length, '200 OK', 15);
        applySortingAndRender();
        return;
    }

    const url = `https://dummyjson.com/recipes/meal-type/${encodeURIComponent(mealType.toLowerCase())}`;
    const startTime = performance.now();

    try {
        const response = await fetch(url);
        const latency = Math.round(performance.now() - startTime);

        if (response.ok) {
            const data = await response.json();
            const apiItems = (data.recipes || []).map(formatDummyRecipe);

            // Supplement with local Japanese items matching meal type
            const mLower = mealType.toLowerCase();
            const localItems = JAPANESE_CATALOG.filter(d => 
                d.mealType.some(m => m.toLowerCase().includes(mLower)) ||
                (mLower === 'beverage' && d.dishType === 'sake') ||
                (mLower === 'dessert' && d.dishType === 'matcha')
            );

            const combined = [...localItems, ...apiItems.filter(a => !localItems.some(l => l.name.toLowerCase() === a.name.toLowerCase()))];
            state.currentDisplayList = combined;

            updateApiMonitorHUD(url, combined.length, '200 OK', latency);
            applySortingAndRender();
        }
    } catch (e) {
        console.warn('Meal type API fallback:', e);
        const mLower = mealType.toLowerCase();
        state.currentDisplayList = state.allRecipes.filter(d => 
            d.mealType.some(m => m.toLowerCase().includes(mLower))
        );
        updateApiMonitorHUD(url, state.currentDisplayList.length, 'Cached Filter', 5);
        applySortingAndRender();
    }

    // 3D background sync
    if (window.stage3D) {
        const mealDishMap = { 'Dinner': 0, 'Lunch': 1, 'Breakfast': 4, 'Dessert': 3, 'Beverage': 5, 'Snack': 4 };
        if (mealDishMap[mealType] !== undefined) {
            window.stage3D.rotateToDish(mealDishMap[mealType]);
            renderHeroFeaturedDish(mealDishMap[mealType]);
        }
    }

    if (window.zenAudio) window.zenAudio.playChime();
}

/**
 * Reset all filters to default state
 */
function resetAllApiFilters() {
    state.currentMealType = 'All';
    state.currentTag = 'All';
    state.currentSearch = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';

    const mealSelect = document.getElementById('mealTypeSelect');
    if (mealSelect) mealSelect.value = 'All';
    const tagSelect = document.getElementById('tagSelect');
    if (tagSelect) tagSelect.value = 'All';
    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) sortSelect.value = 'recommended';

    document.querySelectorAll('#mealTypePills .pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    document.querySelectorAll('#tagPills .pill').forEach((p, i) => p.classList.toggle('active', i === 0));

    fetchAllDummyJsonRecipes();
    if (window.zenAudio) window.zenAudio.playChime();
}

/**
 * Apply Sorting to currentDisplayList and Render
 */
function applySortingAndRender() {
    let list = [...state.currentDisplayList];

    if (state.sortBy === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'price-low') {
        list.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
        list.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'time') {
        list.sort((a, b) => (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes));
    } else if (state.sortBy === 'calories') {
        list.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing);
    } else {
        // Chef Recommended
        list.sort((a, b) => (b.isChefSpecial ? 1 : 0) - (a.isChefSpecial ? 1 : 0));
    }

    renderGrid(list);
}

/**
 * Render cards into grid with 3D perspective tilt & motion sheen
 */
function renderGrid(list) {
    if (!recipesGrid) return;
    recipesGrid.innerHTML = '';

    if (list.length === 0) {
        if (resultsCount) resultsCount.innerText = '0 recipes found for this query';
        if (emptyGridState) emptyGridState.style.display = 'flex';
        return;
    }

    if (resultsCount) {
        resultsCount.innerHTML = `<strong>${list.length}</strong> recipes ready • Synchronized with DummyJSON API`;
    }
    if (emptyGridState) emptyGridState.style.display = 'none';

    list.forEach(dish => {
        const isFav = state.favorites.includes(dish.id);
        const cartItem = state.cart.find(c => c.id === dish.id);
        const cartQty = cartItem ? cartItem.quantity : 0;
        const card = document.createElement('div');
        card.className = 'japanese-dish-card glass';

        const imgUrl = dish.image || dish.fallbackImage;
        const spiceDots = dish.spiciness > 0 ? '<i class="fas fa-pepper-hot" style="color:var(--crimson-bright); margin-right: 2px;"></i>'.repeat(dish.spiciness) : '<i class="fas fa-leaf" style="color:#a3e635; margin-right: 2px;"></i> Mild';

        card.innerHTML = `
            <div class="dish-card-image-wrap">
                <img src="${imgUrl}" alt="${dish.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'">
                <div class="card-glare-overlay"></div>
                <div class="dish-card-badges">
                    <span class="card-badge badge-gold"><i class="fas fa-star"></i> ${dish.rating}</span>
                    ${dish.isMichelin ? '<span class="card-badge badge-crimson"><i class="fas fa-award"></i> Michelin</span>' : ''}
                    <span class="card-badge badge-tag">${dish.cuisine}</span>
                </div>
                <button class="card-fav-button ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${dish.id})" title="Save to Favorites">
                    <i class="fa${isFav ? 's' : 'r'} fa-heart"></i>
                </button>
            </div>

            <div class="dish-card-content">
                <div class="dish-kanji-sub">${dish.kanji || '日本料理'}</div>
                <h3 class="dish-title">${dish.name}</h3>
                
                <p class="dish-description">${dish.description ? dish.description.slice(0, 95) + '...' : 'Gourmet recipe prepared with culinary excellence.'}</p>

                <div class="dish-meta-tags">
                    <span class="meta-tag"><i class="far fa-clock"></i> ${dish.prepTimeMinutes + dish.cookTimeMinutes}m</span>
                    <span class="meta-tag"><i class="fas fa-fire"></i> ${dish.caloriesPerServing} kcal</span>
                    <span class="meta-tag">${spiceDots}</span>
                </div>

                <div class="dish-card-footer">
                    <div class="dish-price-wrapper">
                        <span class="currency-symbol">₹</span>
                        <span class="price-amount">${dish.price.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div class="dish-card-actions">
                        <button class="btn-dish-3d" onclick="open3DDishModal(${dish.id})" title="Inspect in 3D & Recipe Matrix">
                            <i class="fas fa-cube"></i> 3D Inspect
                        </button>
                        ${cartQty > 0 ? `
                            <div class="dish-card-qty-wrap">
                                <button class="btn-dish-qty-btn btn-qty-minus" onclick="updateCartQuantity(${dish.id}, -1)" title="Remove one from order tray">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="dish-card-qty-num">${cartQty}</span>
                                <button class="btn-dish-qty-btn btn-qty-plus" onclick="addToOrder(${dish.id})" title="Add another">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        ` : `
                            <button class="btn-dish-order" onclick="addToOrder(${dish.id})" title="Add to Order Tray">
                                <i class="fas fa-plus"></i> Add
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        // RAF-throttled 3D Perspective Tilt (smooth on 4K / high-DPI screens)
        let _rafPending = false;
        let _mx = 0, _my = 0;
        card.addEventListener('mousemove', (e) => {
            _mx = e.clientX;
            _my = e.clientY;
            if (_rafPending) return;
            _rafPending = true;
            requestAnimationFrame(() => {
                _rafPending = false;
                const rect = card.getBoundingClientRect();
                const x = _mx - rect.left;
                const y = _my - rect.top;
                const rotateX = (((y - rect.height / 2) / rect.height) * 2) * -10;
                const rotateY = (((x - rect.width  / 2) / rect.width)  * 2) * 10;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale3d(1.02,1.02,1.02)`;
                const glare = card.querySelector('.card-glare-overlay');
                if (glare) {
                    glare.style.opacity = '1';
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)`;
                }
            });
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            _rafPending = false;
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1,1,1)';
            const glare = card.querySelector('.card-glare-overlay');
            if (glare) glare.style.opacity = '0';
        }, { passive: true });

        recipesGrid.appendChild(card);
    });
}
// Hero Featured 3D Dish Sync
function renderHeroFeaturedDish(index) {
    const dish = JAPANESE_CATALOG[index] || JAPANESE_CATALOG[0];
    state.selected3DDishIndex = index;

    const titleEl = document.getElementById('heroDishTitle');
    const kanjiEl = document.getElementById('heroDishKanji');
    const descEl = document.getElementById('heroDishDesc');
    const priceEl = document.getElementById('heroDishPrice');
    const ratingEl = document.getElementById('heroDishRating');
    const prepEl = document.getElementById('heroDishPrep');
    const cta3DBtn = document.getElementById('heroDish3DBtn');
    const ctaAddBtn = document.getElementById('heroDishAddBtn');

    if (titleEl) titleEl.innerText = dish.name;
    if (kanjiEl) kanjiEl.innerText = dish.kanji;
    if (descEl) descEl.innerText = dish.description;
    if (priceEl) priceEl.innerText = formatINR(dish.price);
    if (ratingEl) ratingEl.innerHTML = `<i class="fas fa-star"></i> ${dish.rating} (${dish.reviewsCount} reviews)`;
    if (prepEl) prepEl.innerText = `${dish.prepTimeMinutes + dish.cookTimeMinutes} mins prep`;

    if (cta3DBtn) {
        cta3DBtn.onclick = () => open3DDishModal(dish.id);
    }
    if (ctaAddBtn) {
        ctaAddBtn.onclick = () => addToOrder(dish.id);
    }

    // Sync active hero pills
    const pills = document.querySelectorAll('.hero-dish-pill');
    pills.forEach((p, i) => {
        p.classList.toggle('active', i === index);
    });
}

// 3D Background & Carousel Controls
function setup3DControls() {
    const orbitToggle = document.getElementById('toggleOrbitBtn');
    if (orbitToggle) {
        orbitToggle.addEventListener('click', () => {
            if (window.stage3D) {
                const isOrbiting = window.stage3D.toggleOrbit();
                orbitToggle.innerHTML = isOrbiting 
                    ? '<i class="fas fa-pause"></i> <span>Pause 3D Orbit</span>' 
                    : '<i class="fas fa-play"></i> <span>Auto 3D Orbit</span>';
                orbitToggle.classList.toggle('active', isOrbiting);
            }
        });
    }

    const next3DBtn = document.getElementById('nextDish3DBtn');
    const prev3DBtn = document.getElementById('prevDish3DBtn');

    if (next3DBtn) {
        next3DBtn.addEventListener('click', () => {
            if (window.stage3D) {
                const nextIdx = window.stage3D.nextDish();
                renderHeroFeaturedDish(nextIdx);
                if (window.zenAudio) window.zenAudio.playDishSwitch();
            }
        });
    }

    if (prev3DBtn) {
        prev3DBtn.addEventListener('click', () => {
            if (window.stage3D) {
                const prevIdx = window.stage3D.prevDish();
                renderHeroFeaturedDish(prevIdx);
                if (window.zenAudio) window.zenAudio.playDishSwitch();
            }
        });
    }
}

// Switch 3D Dish from Hero Pill
function selectHero3DDish(index) {
    if (window.stage3D) {
        window.stage3D.rotateToDish(index);
    }
    renderHeroFeaturedDish(index);
    if (window.zenAudio) window.zenAudio.playDishSwitch();
}

// Switch Camera Mode on 3D Background
function set3DCameraMode(mode, element) {
    if (window.stage3D) {
        window.stage3D.setCameraMode(mode);
    }
    const btns = document.querySelectorAll('.camera-mode-pill');
    btns.forEach(b => b.classList.remove('active'));
    if (element) element.classList.add('active');
    if (window.zenAudio) window.zenAudio.playChime();
}

// Sort handler
function handleSortChange(val) {
    state.sortBy = val;
    applySortingAndRender();
}

// Toggle Favorites
function toggleFavorite(event, id) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const idx = state.favorites.indexOf(id);
    if (idx === -1) {
        state.favorites.push(id);
        showToast('Saved to Favorites 「お気に入りに追加」');
    } else {
        state.favorites.splice(idx, 1);
        showToast('Removed from Favorites');
    }

    localStorage.setItem('kintsugi_favorites', JSON.stringify(state.favorites));
    applySortingAndRender();
    if (window.zenAudio) window.zenAudio.playChime();
}

// Add Item to Order Tray Cart
function addToOrder(id) {
    const dish = state.allRecipes.find(d => d.id === id) || JAPANESE_CATALOG[0];
    if (!dish) return;

    const existing = state.cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({
            id: dish.id,
            name: dish.name,
            kanji: dish.kanji,
            price: dish.price,
            image: dish.image || dish.fallbackImage,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`Added "${dish.name}" to Order Tray!`);
    if (window.zenAudio) window.zenAudio.playOrderSuccess();
}

function updateCartQuantity(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== id);
    }

    saveCart();
    updateCartUI();
}

function clearCart() {
    state.cart = [];
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('kintsugi_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    if (cartBadgeCount) {
        cartBadgeCount.innerText = totalCount;
        cartBadgeCount.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (cartSubtotalPrice) cartSubtotalPrice.innerText = formatINR(subtotal);
    if (cartTotalPrice) cartTotalPrice.innerText = formatINR(total);

    if (cartItemsList) {
        cartItemsList.innerHTML = '';
        if (state.cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-state">
                    <i class="fas fa-utensils"></i>
                    <p>Your Kaiseki order tray is empty.</p>
                    <span>Select signature dishes from our 3D showcase or grand menu.</span>
                </div>
            `;
            return;
        }

        state.cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item-row';
            el.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.style.display='none'">
                <div class="cart-item-info">
                    <div class="cart-item-kanji">${item.kanji || ''}</div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatINR(item.price)} each</div>
                </div>
                <div class="cart-item-qty-controls">
                    <button onclick="updateCartQuantity(${item.id}, -1)" title="Decrease Quantity"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)" title="Increase Quantity"><i class="fas fa-plus"></i></button>
                </div>
                <div class="cart-item-total">${formatINR(item.price * item.quantity)}</div>
                <button class="btn-cart-remove" onclick="updateCartQuantity(${item.id}, -${item.quantity})" title="Remove item from order tray">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            cartItemsList.appendChild(el);
        });
    }
}

// Drawer Open/Close
function toggleCartDrawer(open) {
    if (cartDrawer && cartOverlay) {
        if (open) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
            if (window.zenAudio) window.zenAudio.playChime();
        } else {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    }
}

// 3D Dish Inspection & Story Modal (Supports DummyJSON single recipe fetch)
async function open3DDishModal(id) {
    let dish = state.allRecipes.find(d => d.id === id);
    if (!dish) {
        dish = await fetchSingleRecipeApi(id);
    }
    if (!dish) return;
    state.currentModalRecipe = dish;

    // Rotate 3D background to this dish if available
    if (dish.stage3DIndex !== undefined && window.stage3D) {
        window.stage3D.rotateToDish(dish.stage3DIndex);
    }

    const modalTitle = document.getElementById('modalDishTitle');
    const modalKanji = document.getElementById('modalDishKanji');
    const modalStory = document.getElementById('modalDishStory');
    const modalPrice = document.getElementById('modalDishPrice');
    const modalRating = document.getElementById('modalDishRating');
    const modalPairing = document.getElementById('modalDishPairing');
    const modalIngredients = document.getElementById('modalDishIngredients');
    const modalImage = document.getElementById('modalDishImage');
    const modalAddBtn = document.getElementById('modalAddOrderBtn');
    const modalFullRecipeLink = document.getElementById('modalFullRecipeLink');

    // Populate Radar Bars
    const radar = dish.flavorRadar || { umami: 80, sweetness: 40, heat: 20, richness: 70, acidity: 30 };
    document.getElementById('radarUmami').style.width = `${radar.umami}%`;
    document.getElementById('radarSweetness').style.width = `${radar.sweetness}%`;
    document.getElementById('radarHeat').style.width = `${radar.heat}%`;
    document.getElementById('radarRichness').style.width = `${radar.richness}%`;
    document.getElementById('radarAcidity').style.width = `${radar.acidity}%`;

    if (modalTitle) modalTitle.innerText = dish.name;
    if (modalKanji) modalKanji.innerText = dish.kanji;
    if (modalStory) modalStory.innerText = dish.story || dish.description;
    if (modalPrice) modalPrice.innerText = formatINR(dish.price);
    if (modalRating) modalRating.innerHTML = `<i class="fas fa-star"></i> ${dish.rating} (${dish.reviewsCount} reviews)`;
    if (modalPairing) modalPairing.innerText = dish.pairing || 'House Junmai Daiginjo';
    if (modalImage) {
        modalImage.src = dish.image || dish.fallbackImage;
        modalImage.onerror = () => { modalImage.src = dish.fallbackImage; };
    }

    if (modalIngredients) {
        modalIngredients.innerHTML = '';
        (dish.ingredients || []).forEach(ing => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${ing}</span>`;
            modalIngredients.appendChild(li);
        });
    }

    if (modalAddBtn) {
        modalAddBtn.onclick = () => {
            addToOrder(dish.id);
            close3DDishModal();
        };
    }

    if (modalFullRecipeLink) {
        modalFullRecipeLink.href = `recipe.html?id=${dish.id}`;
    }

    if (dishDetailModal) {
        dishDetailModal.classList.add('open');
        if (window.zenAudio) window.zenAudio.playChime();
    }
}

function close3DDishModal() {
    if (dishDetailModal) dishDetailModal.classList.remove('open');
}

// Table Reservation Modal
function openReservationModal() {
    if (reservationModal) {
        reservationModal.classList.add('open');
        if (window.zenAudio) window.zenAudio.playChime();
    }
}

function closeReservationModal() {
    if (reservationModal) reservationModal.classList.remove('open');
}

async function handleReservationSubmit(event) {
    event.preventDefault();
    const guestName = document.getElementById('resName')?.value || '';
    const guestEmail = document.getElementById('resEmail')?.value || '';
    const guestPhone = document.getElementById('resPhone')?.value || '';
    const partySize = document.getElementById('resGuests')?.value || 2;
    const date = document.getElementById('resDate')?.value || '';
    const time = document.getElementById('resTime')?.value || '';
    const seatingArea = document.getElementById('resSeating')?.value || 'Counter Omakase';
    const specialRequests = document.getElementById('resNotes')?.value || '';

    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guestName, guestEmail, guestPhone, partySize, date, time, seatingArea, specialRequests
            })
        });
        const data = await response.json();
        closeReservationModal();
        
        if (response.ok && data.success) {
            const code = data.reservation.id;
            showToast(`Reservation confirmed for ${guestName}! Code: ${code}`);
        } else {
            showToast(`Reservation confirmed for ${guestName} (${partySize} guests) on ${date}!`);
        }
    } catch (err) {
        console.warn('Backend server offline, local confirmation:', err);
        closeReservationModal();
        showToast(`Reservation confirmed for ${guestName} (${partySize} guests) on ${date}! Code: KTS-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    if (window.zenAudio) window.zenAudio.playOrderSuccess();
}

// Checkout simulation sending order to backend
async function handleCheckout() {
    if (state.cart.length === 0) {
        showToast('Your order tray is empty!');
        return;
    }
    const totalText = cartTotalPrice ? cartTotalPrice.innerText.replace('₹', '').replace(/,/g, '') : '0';
    const totalAmount = parseFloat(totalText) || 0;
    const currentUser = JSON.parse(localStorage.getItem('gourmet_current_user') || '{}');

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: currentUser.username || 'VIP Guest',
                items: state.cart,
                totalAmount
            })
        });
        const data = await response.json();
        clearCart();
        toggleCartDrawer(false);

        if (response.ok && data.success) {
            showToast(`Thank you! Order submitted successfully (${formatINR(totalAmount)}). ID: ${data.order.id}`);
        } else {
            showToast(`Thank you! Order submitted successfully (${formatINR(totalAmount)}).`);
        }
    } catch (err) {
        console.warn('Backend server offline, local order complete:', err);
        clearCart();
        toggleCartDrawer(false);
        showToast(`Thank you! Order submitted successfully (${formatINR(totalAmount)}). Code: KT-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    if (window.zenAudio) window.zenAudio.playOrderSuccess();
}

// Global Toast Notification
function showToast(message) {
    let toast = document.getElementById('zenToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'zenToast';
        toast.className = 'zen-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-sparkles"></i> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
