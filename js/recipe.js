/**
 * recipe.js - Logic for Recipe & Heritage Kaiseki details view.
 * Supports both local Japanese catalog recipes (IDs 101-106) and DummyJSON API recipes.
 */

// Japanese Local Recipes Data (Shared with app.js)
const JAPANESE_RECIPES_DATA = {
    101: {
        name: 'Imperial Dragon King Nigiri Platter',
        kanji: '極上 龍王 握り盛り合わせ',
        cuisine: 'Japanese / Edomae Sushi',
        price: 68,
        rating: 4.95,
        reviewCount: 142,
        caloriesPerServing: 420,
        prepTimeMinutes: 18,
        cookTimeMinutes: 0,
        servings: 2,
        difficulty: 'Master Craft',
        image: 'images/japanese_sushi_platter_1786549536224.png',
        story: 'Prepared in the strict 200-year-old Edomae tradition using vintage red akazu vinegar and fish aged for 5 to 14 days under cedar kelp wrap to reach peak glutamic umami.',
        ingredients: [
            '200g Aged Bluefin Otoro & Akami Tuna',
            '150g Wild Tasmanian King Salmon',
            '80g Hokkaido Murasaki Sea Urchin (Uni)',
            '2 cups Koshihikari Shari Rice (seasoned with aged akazu)',
            '1 Fresh Shizuoka Wasabi rhizome (grated on sharkskin oroshigane)',
            '3 sheets 24k Edible Gold Leaf',
            '50ml Barrel-Aged Smoked Shoyu'
        ],
        instructions: [
            'Cook the Koshihikari rice and immediately fold in aged red akazu vinegar and sea salt while fanning to achieve a glossy sheen at body temperature (36°C).',
            'Slice the aged Otoro and King Salmon across the grain at a 45-degree angle using a single fluid stroke of the Yanagiba knife.',
            'Shape 18g of warm shari rice with gentle finger pressure, applying a dab of fresh wasabi before draping the sashimi slice over top.',
            'Carefully crown with Hokkaido sea urchin (Uni), a touch of Caspian caviar, and delicate flecks of 24k edible gold leaf.',
            'Lightly brush with smoked barrel-aged shoyu using a traditional horsehair brush immediately before serving.'
        ],
        pairing: 'Dassai 23 Junmai Daiginjo (Yamaguchi)'
    },
    102: {
        name: 'Smoked Tonkotsu Black Garlic Ramen',
        kanji: '特製 黒大蒜 豚骨拉麺',
        cuisine: 'Japanese / Hakata Ramen',
        price: 32,
        rating: 4.92,
        reviewCount: 218,
        caloriesPerServing: 680,
        prepTimeMinutes: 25,
        cookTimeMinutes: 120,
        servings: 2,
        difficulty: 'Artisanal',
        image: 'images/japanese_ramen_bowl_1786549497339.png',
        story: 'Broth simmered over binchotan embers for a full solar cycle to extract deep marrow collagen, producing a velvety soup with rich charred garlic aroma.',
        ingredients: [
            '800ml 24-hour Simmered Berkshire Tonkotsu Broth',
            '300g Fresh Hand-Pulled Alkaline Wavy Ramen Noodles',
            '4 thick slices Sous-Vide & Torched Chashu Pork Belly',
            '2 Ajitsuke Marinated Soft-Boiled Eggs (halved)',
            '2 tbsp Charred Black Garlic Mayu Oil',
            '4 sheets Crispy Roasted Ariake Nori',
            '50g Fermented Menma Bamboo Shoots',
            'Handful Finely Sliced Scallions'
        ],
        instructions: [
            'Bring the rich tonkotsu collagen broth to a rolling simmer and ladle in tare seasoning reduction.',
            'Boil the fresh wavy noodles in rolling water for exactly 75 seconds for the perfect "katame" (firm) texture; shake dry vigorously.',
            'Transfer hot broth into pre-warmed ceramic bowls and fold in the cooked noodles with chopsticks.',
            'Torch the chashu pork slices with a culinary blowtorch until caramelization bubbles appear.',
            'Arrange the charred pork, egg halves, nori sheets, and bamboo shoots on top; drizzle with fragrant black garlic mayu oil.'
        ],
        pairing: 'Echigo Koshihikari Rice Beer or Yoichi Single Malt Highball'
    },
    103: {
        name: 'Miyazaki A5 Wagyu Robatayaki Skewers',
        kanji: '宮崎牛 A5 炉端焼き 炭火串',
        cuisine: 'Japanese / Robatayaki',
        price: 85,
        rating: 4.98,
        reviewCount: 96,
        caloriesPerServing: 540,
        prepTimeMinutes: 15,
        cookTimeMinutes: 12,
        servings: 2,
        difficulty: 'Master Craft',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        story: 'Sourced directly from certified heritage farms in Miyazaki prefecture, boasting BMS 11 with a melting point lower than human body temperature.',
        ingredients: [
            '400g Certified Miyazaki A5 Wagyu Tenderloin',
            '60ml 10-Year Aged Tamari Tare Glaze',
            'Kishu Binchotan White Oak Coals',
            'Freshly Grated Shizuoka Shark-Skin Wasabi',
            'Maldon Smoked Flake Sea Salt',
            'Organic King Oyster & Enoki Mushrooms'
        ],
        instructions: [
            'Cut the A5 Wagyu beef into uniform 2.5cm cubes and thread onto pre-soaked bamboo skewers with king oyster mushrooms.',
            'Ignite Kishu Binchotan coals until glowing white with smokeless intense infrared heat.',
            'Grill skewers over high heat for 90 seconds per side, allowing the luxurious intramuscular fat to render and crisp.',
            'Brush generously with aged tamari tare glaze during the final 30 seconds of grilling.',
            'Serve immediately garnished with freshly grated wasabi and crunchy smoked sea salt flakes.'
        ],
        pairing: 'Kenbishi Mizuho Junmai Sake or 2018 Kenzo Estate Cabernet'
    },
    104: {
        name: 'Ceremonial Matcha Mousse & Gold Dome',
        kanji: '宇治 抹茶 ムース 金箔仕立て',
        cuisine: 'Japanese / Wagashi Dessert',
        price: 24,
        rating: 4.88,
        reviewCount: 88,
        caloriesPerServing: 310,
        prepTimeMinutes: 30,
        cookTimeMinutes: 0,
        servings: 2,
        difficulty: 'Pastry Art',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
        story: 'Crafted using spring harvest tencha tea leaves stone-ground for over 3 hours at Kyoto Marukyu Koyamaen to preserve vibrant chlorophyll and delicate sweet fragrance.',
        ingredients: [
            '15g Kyoto Uji Ceremonial Grade Matcha Powder',
            '200ml Organic Hokkaido Whipped Cream',
            '50ml Yuzu Citrus Curd & Gelee',
            'Black Sesame Kurogoma Sponge Base',
            'Azuki Sweet Red Bean Mochi Pearls',
            '24k Edible Gold Leaf Flakes'
        ],
        instructions: [
            'Whisk ceremonial matcha into warm cream until completely smooth and velvety.',
            'Gently fold in whipped cream and pipe into silicone dome molds over a core of frozen yuzu citrus gelee.',
            'Freeze for 2 hours until set, then unmold onto black sesame dacquoise sponge discs.',
            'Dust with micro-sifted matcha powder and adorn with sweet red bean pearls and shimmering gold flakes.'
        ],
        pairing: 'Whisked Ippodo Gyokuro Green Tea or Japanese Plum Umeshu'
    },
    105: {
        name: 'Crispy Black Truffle Wagyu Gyoza',
        kanji: '黒トリュフ 和牛 焼き餃子',
        cuisine: 'Japanese / Izakaya Starters',
        price: 28,
        rating: 4.90,
        reviewCount: 165,
        caloriesPerServing: 380,
        prepTimeMinutes: 20,
        cookTimeMinutes: 10,
        servings: 3,
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80',
        story: 'Pan-seared on cast iron with a delicate potato starch lace lattice, giving an unforgettable shatter-crisp crunch yielding to luscious juicy filling.',
        ingredients: [
            '24 Hand-Rolled Ultra-Thin Gyoza Wrappers',
            '250g Minced Japanese Wagyu & Kurobuta Pork',
            '2 tbsp Perigord Black Winter Truffle Pate',
            '1 bunch Organic Garlic Chives & Scallions',
            '1 tbsp Cold-Pressed Toasted Sesame Oil',
            'Potato starch slurry for lace skirt',
            'Aged Yuzu Citrus Soy Dipping Sauce'
        ],
        instructions: [
            'Mix minced meats, truffle pate, chives, sesame oil, and seasonings until sticky and homogenous.',
            'Place 1 tbsp filling into center of each wrapper, moisten edges with water, and create 5 elegant pleats to seal.',
            'Heat sesame oil in a cast iron skillet, arrange gyoza in circular pattern, and sear base until golden brown.',
            'Pour in potato starch slurry, immediately cover with lid, and steam for 4 minutes until liquid evaporates into a crispy lace lattice.',
            'Invert onto serving plate and serve hot with yuzu soy dip.'
        ],
        pairing: 'Asahi Super Dry Draft or Suntory Yamazaki Highball'
    },
    106: {
        name: 'Hakutsuru Junmai Daiginjo & Sake Flight',
        kanji: '純米大吟醸 利き酒 セット',
        cuisine: 'Japanese / Artisanal Sake',
        price: 45,
        rating: 4.96,
        reviewCount: 74,
        caloriesPerServing: 160,
        prepTimeMinutes: 5,
        cookTimeMinutes: 0,
        servings: 2,
        difficulty: 'Sommelier',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
        story: 'Brewed during the depths of winter using alpine snowmelt water from Hyogo, providing notes of white peach, melon blossom, and velvet mineral finish.',
        ingredients: [
            '35% Polished Yamada Nishiki Rice Brews',
            'Alpine Snowmelt Mineral Water',
            'Hand-Blown Edo Kiriko Crystal Glassware',
            'Hinoki Cedar Wood Presentation Box'
        ],
        instructions: [
            'Chill crystal ochoko cups to 8°C.',
            'Pour 60ml of each curated Junmai Daiginjo flight into designated tasting glasses.',
            'Savor aroma first, then take small sips to observe evolution of melon, pear, and cedar notes on the palate.'
        ],
        pairing: 'Fresh Sashimi, Sea Urchin, and Wagyu Tartare'
    }
};

// State
let currentRecipeId = null;
let favorites = JSON.parse(localStorage.getItem('kintsugi_favorites') || '[]');

// DOM Elements
const recipeDetailHero = document.getElementById('recipeDetailHero');
const recipeDetailCuisine = document.getElementById('recipeDetailCuisine');
const recipeDetailTitle = document.getElementById('recipeDetailTitle');
const recipeDetailRating = document.getElementById('recipeDetailRating');
const recipeDetailTotalTime = document.getElementById('recipeDetailTotalTime');
const recipeDetailDifficulty = document.getElementById('recipeDetailDifficulty');
const recipeDetailCalories = document.getElementById('recipeDetailCalories');
const recipeDetailStory = document.getElementById('recipeDetailStory');
const recipeDetailIngredients = document.getElementById('recipeDetailIngredients');
const recipeDetailInstructions = document.getElementById('recipeDetailInstructions');
const recipeDetailPairing = document.getElementById('recipeDetailPairing');
const recipeNutrCalories = document.getElementById('recipeNutrCalories');
const recipeNutrPrep = document.getElementById('recipeNutrPrep');
const recipeNutrCook = document.getElementById('recipeNutrCook');
const recipeNutrServings = document.getElementById('recipeNutrServings');
const btnToggleFavoriteDetail = document.getElementById('btnToggleFavoriteDetail');
const commentInput = document.getElementById('commentInput');
const recipeCommentsList = document.getElementById('recipeCommentsList');

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    currentRecipeId = parseInt(params.get('id')) || 101;

    loadRecipeData();
    setupFavoritesButton();
    renderComments();
});

// Load Recipe
async function loadRecipeData() {
    // Check if local Japanese recipe
    if (JAPANESE_RECIPES_DATA[currentRecipeId]) {
        renderRecipeUI(JAPANESE_RECIPES_DATA[currentRecipeId]);
        return;
    }

    // Otherwise fetch from DummyJSON
    try {
        const dummyId = currentRecipeId > 500 ? currentRecipeId - 500 : currentRecipeId;
        const response = await fetch(`https://dummyjson.com/recipes/${dummyId}`);
        if (!response.ok) throw new Error('Recipe not found');
        const r = await response.json();

        const formatted = {
            name: r.name,
            kanji: '厳選 おすすめ料理',
            cuisine: r.cuisine || 'Gourmet Kaiseki',
            price: Math.floor((r.caloriesPerServing / 20) + 15),
            rating: r.rating || 4.8,
            reviewCount: r.reviewCount || 40,
            caloriesPerServing: r.caloriesPerServing || 450,
            prepTimeMinutes: r.prepTimeMinutes || 20,
            cookTimeMinutes: r.cookTimeMinutes || 25,
            servings: r.servings || 4,
            difficulty: r.difficulty || 'Artisanal',
            image: r.image,
            story: `Exquisite ${r.cuisine} specialty prepared with culinary craftsmanship, honoring both heritage recipes and modern aesthetics.`,
            ingredients: r.ingredients || [],
            instructions: r.instructions || [],
            pairing: 'Crisp Junmai Ginjo Sake or House Green Tea'
        };

        renderRecipeUI(formatted);
    } catch (e) {
        console.warn('Fallback to default recipe', e);
        renderRecipeUI(JAPANESE_RECIPES_DATA[101]);
    }
}

function renderRecipeUI(recipe) {
    document.title = `${recipe.name} - KINTSUGI (金継ぎ)`;

    if (recipeDetailHero) recipeDetailHero.style.backgroundImage = `url('${recipe.image}')`;
    if (recipeDetailCuisine) recipeDetailCuisine.innerText = recipe.cuisine;
    if (recipeDetailTitle) recipeDetailTitle.innerText = recipe.name;
    if (recipeDetailRating) recipeDetailRating.innerHTML = `<i class="fas fa-star"></i> ${recipe.rating} (${recipe.reviewCount} reviews)`;
    
    const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
    if (recipeDetailTotalTime) recipeDetailTotalTime.innerText = `${totalTime} mins`;
    if (recipeDetailDifficulty) recipeDetailDifficulty.innerText = recipe.difficulty;
    if (recipeDetailCalories) recipeDetailCalories.innerText = `${recipe.caloriesPerServing} kcal`;
    if (recipeDetailStory) recipeDetailStory.innerText = recipe.story;
    if (recipeDetailPairing) recipeDetailPairing.innerText = recipe.pairing;

    if (recipeNutrCalories) recipeNutrCalories.innerText = recipe.caloriesPerServing;
    if (recipeNutrPrep) recipeNutrPrep.innerText = `${recipe.prepTimeMinutes}m`;
    if (recipeNutrCook) recipeNutrCook.innerText = `${recipe.cookTimeMinutes}m`;
    if (recipeNutrServings) recipeNutrServings.innerText = recipe.servings;

    // Render Ingredients Checklist
    if (recipeDetailIngredients) {
        recipeDetailIngredients.innerHTML = '';
        (recipe.ingredients || []).forEach(ing => {
            const label = document.createElement('label');
            label.className = 'ingredient-item';
            label.innerHTML = `
                <input type="checkbox" onchange="this.parentElement.classList.toggle('completed', this.checked)">
                <span>${ing}</span>
            `;
            recipeDetailIngredients.appendChild(label);
        });
    }

    // Render Instructions
    if (recipeDetailInstructions) {
        recipeDetailInstructions.innerHTML = '';
        (recipe.instructions || []).forEach((step, idx) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'instruction-step';
            stepEl.onclick = () => stepEl.classList.toggle('completed');
            stepEl.innerHTML = `
                <div class="step-number">${idx + 1}</div>
                <div class="step-text">${step}</div>
            `;
            recipeDetailInstructions.appendChild(stepEl);
        });
    }
}

// Favorites handling
function setupFavoritesButton() {
    updateFavoritesBtnUI();
    if (btnToggleFavoriteDetail) {
        btnToggleFavoriteDetail.addEventListener('click', () => {
            const idx = favorites.indexOf(currentRecipeId);
            if (idx === -1) {
                favorites.push(currentRecipeId);
            } else {
                favorites.splice(idx, 1);
            }
            localStorage.setItem('kintsugi_favorites', JSON.stringify(favorites));
            updateFavoritesBtnUI();
        });
    }
}

function updateFavoritesBtnUI() {
    if (!btnToggleFavoriteDetail) return;
    const isFav = favorites.includes(currentRecipeId);
    if (isFav) {
        btnToggleFavoriteDetail.className = 'btn btn-primary';
        btnToggleFavoriteDetail.innerHTML = '<i class="fas fa-heart"></i> In Favorites 「保存済み」';
    } else {
        btnToggleFavoriteDetail.className = 'btn btn-secondary';
        btnToggleFavoriteDetail.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
    }
}

// Comments / Notes
function getComments() {
    const all = JSON.parse(localStorage.getItem('kintsugi_comments') || '{}');
    return all[currentRecipeId] || [];
}

function saveComment(text) {
    const user = JSON.parse(localStorage.getItem('gourmet_current_user') || '{"username": "Guest Gourmet"}');
    const all = JSON.parse(localStorage.getItem('kintsugi_comments') || '{}');
    if (!all[currentRecipeId]) all[currentRecipeId] = [];

    all[currentRecipeId].unshift({
        author: user.username,
        text: text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    localStorage.setItem('kintsugi_comments', JSON.stringify(all));
    renderComments();
}

function renderComments() {
    if (!recipeCommentsList) return;
    const comments = getComments();
    recipeCommentsList.innerHTML = '';

    if (comments.length === 0) {
        recipeCommentsList.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.85rem;">
                No tasting notes posted yet. Be the first to share your notes!
            </div>
        `;
        return;
    }

    comments.forEach((c, idx) => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
            <div class="comment-header">
                <span class="comment-author"><i class="fas fa-user-circle"></i> ${c.author}</span>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span class="comment-date">${c.date}</span>
                    <button class="btn-delete-comment" onclick="deleteComment(${idx})" title="Delete tasting note">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="comment-text">${c.text}</div>
        `;
        recipeCommentsList.appendChild(item);
    });
}

function deleteComment(idx) {
    const all = JSON.parse(localStorage.getItem('kintsugi_comments') || '{}');
    if (all[currentRecipeId] && all[currentRecipeId][idx] !== undefined) {
        all[currentRecipeId].splice(idx, 1);
        localStorage.setItem('kintsugi_comments', JSON.stringify(all));
        renderComments();
    }
}

function handleAddComment(e) {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;
    saveComment(text);
    commentInput.value = '';
}
