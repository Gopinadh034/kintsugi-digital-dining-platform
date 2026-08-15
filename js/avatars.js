/**
 * avatars.js - Built-in Japanese Luxury Illustrated Avatars for KINTSUGI
 */

const KINTSUGI_PRESET_AVATARS = [
    {
        id: 'kitsune_gold',
        name: 'Golden Kitsune',
        tag: 'Divine Fox Mask',
        bg: 'linear-gradient(135deg, #1c1810 0%, #0d0b07 100%)',
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#14110b" stroke="#d4af37" stroke-width="3"/>
            <circle cx="50" cy="50" r="42" fill="url(#gradKitsune)"/>
            <defs>
                <radialGradient id="gradKitsune" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#2a2214"/>
                    <stop offset="100%" stop-color="#090805"/>
                </radialGradient>
            </defs>
            <!-- Kitsune Face -->
            <path d="M25 35 L40 18 L48 36 Z" fill="#d4af37" stroke="#997a15" stroke-width="1"/>
            <path d="M75 35 L60 18 L52 36 Z" fill="#d4af37" stroke="#997a15" stroke-width="1"/>
            <path d="M27 33 L38 22 L44 35 Z" fill="#e63946"/>
            <path d="M73 33 L62 22 L56 35 Z" fill="#e63946"/>
            <!-- White Mask Face -->
            <path d="M30 40 Q50 25 70 40 Q75 65 50 82 Q25 65 30 40 Z" fill="#fdfbf7"/>
            <!-- Crimson Markings -->
            <path d="M40 45 Q50 35 60 45" stroke="#e63946" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <ellipse cx="50" cy="40" rx="3" ry="5" fill="#e63946"/>
            <!-- Eyes -->
            <path d="M34 52 Q42 48 46 54" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M66 52 Q58 48 54 54" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M34 52 Q40 50 45 52" stroke="#e63946" stroke-width="1.5" fill="none"/>
            <path d="M66 52 Q60 50 55 52" stroke="#e63946" stroke-width="1.5" fill="none"/>
            <!-- Nose & Whiskers -->
            <polygon points="48,65 52,65 50,68" fill="#e63946"/>
            <path d="M32 60 L24 58 M32 64 L22 65" stroke="#e63946" stroke-width="1.5"/>
            <path d="M68 60 L76 58 M68 64 L78 65" stroke="#e63946" stroke-width="1.5"/>
            <!-- Gold Trim -->
            <path d="M50 72 L45 78 L55 78 Z" fill="#d4af37"/>
        </svg>`
    },
    {
        id: 'samurai_dark',
        name: 'Dark Kabuto',
        tag: 'Shogun Helmet',
        bg: 'linear-gradient(135deg, #181014 0%, #070507 100%)',
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#0f0b0d" stroke="#d4af37" stroke-width="3"/>
            <!-- Golden Horns (Maedate) -->
            <path d="M50 32 Q35 12 18 20 Q30 35 44 38 Z" fill="#f39c12" stroke="#d4af37" stroke-width="1"/>
            <path d="M50 32 Q65 12 82 20 Q70 35 56 38 Z" fill="#f39c12" stroke="#d4af37" stroke-width="1"/>
            <circle cx="50" cy="35" r="7" fill="#e63946" stroke="#d4af37" stroke-width="1.5"/>
            <!-- Helmet Dome -->
            <path d="M26 50 Q50 24 74 50 Q76 68 50 72 Q24 68 26 50 Z" fill="#1c1c24" stroke="#d4af37" stroke-width="1.5"/>
            <!-- Face Guard (Menpo) -->
            <path d="M30 54 Q50 48 70 54 L66 76 Q50 86 34 76 Z" fill="#111" stroke="#e63946" stroke-width="2"/>
            <!-- Mustache & Teeth -->
            <path d="M38 65 Q50 60 62 65" stroke="#d4af37" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M44 70 L56 70" stroke="#fff" stroke-width="2"/>
            <!-- Fierce Eyes -->
            <polygon points="36,54 46,56 42,50" fill="#e63946"/>
            <polygon points="64,54 54,56 58,50" fill="#e63946"/>
        </svg>`
    },
    {
        id: 'geisha_crimson',
        name: 'Crimson Sensu',
        tag: 'Golden Folding Fan',
        bg: 'linear-gradient(135deg, #221014 0%, #0d0507 100%)',
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#16090c" stroke="#d4af37" stroke-width="3"/>
            <!-- Sun Disc -->
            <circle cx="50" cy="46" r="30" fill="#e63946"/>
            <!-- Folding Fan -->
            <path d="M15 65 Q50 20 85 65 L50 82 Z" fill="#d4af37" stroke="#111" stroke-width="1.5"/>
            <!-- Fan Ribs -->
            <path d="M50 82 L22 55 M50 82 L35 42 M50 82 L50 35 M50 82 L65 42 M50 82 L78 55" stroke="#8c6d15" stroke-width="1.5"/>
            <!-- Cherry Blossoms -->
            <circle cx="36" cy="48" r="4" fill="#fff"/>
            <circle cx="64" cy="48" r="4" fill="#fff"/>
            <circle cx="50" cy="40" r="5" fill="#f8a5c2"/>
            <circle cx="50" cy="82" r="3" fill="#e63946"/>
        </svg>`
    },
    {
        id: 'origami_crane',
        name: 'Golden Tsuru',
        tag: 'Sacred Origami Crane',
        bg: 'linear-gradient(135deg, #181c16 0%, #070a06 100%)',
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#0b120a" stroke="#d4af37" stroke-width="3"/>
            <!-- Sun -->
            <circle cx="50" cy="50" r="28" fill="#2a3826"/>
            <circle cx="50" cy="50" r="20" fill="#e63946"/>
            <!-- Origami Crane Polygon Body -->
            <polygon points="50,22 35,50 50,78 65,50" fill="#f5e6ca" stroke="#d4af37" stroke-width="1.5"/>
            <polygon points="50,22 15,38 35,50" fill="#d4af37"/>
            <polygon points="50,22 85,38 65,50" fill="#f39c12"/>
            <polygon points="35,50 50,78 20,68" fill="#caa445"/>
            <polygon points="65,50 50,78 80,68" fill="#d4af37"/>
            <!-- Crown -->
            <circle cx="50" cy="22" r="3" fill="#e63946"/>
        </svg>`
    },
    {
        id: 'torii_gate',
        name: 'Red Torii',
        tag: 'Shrine Sanctuary',
        bg: 'linear-gradient(135deg, #1c1410 0%, #0a0705 100%)',
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#120c08" stroke="#d4af37" stroke-width="3"/>
            <!-- Golden Rising Sun -->
            <circle cx="50" cy="45" r="25" fill="#f39c12"/>
            <circle cx="50" cy="45" r="20" fill="#e63946"/>
            <!-- Torii Gate Pillars & Lintels -->
            <path d="M18 32 Q50 26 82 32 L85 38 Q50 32 15 38 Z" fill="#e63946" stroke="#900" stroke-width="1"/>
            <path d="M22 42 L78 42 L78 47 L22 47 Z" fill="#111"/>
            <rect x="30" y="47" width="8" height="35" fill="#e63946" rx="2"/>
            <rect x="62" y="47" width="8" height="35" fill="#e63946" rx="2"/>
            <rect x="28" y="78" width="12" height="6" fill="#111"/>
            <rect x="60" y="78" width="12" height="6" fill="#111"/>
            <rect x="47" y="38" width="6" height="9" fill="#d4af37"/>
        </svg>`
    },
    {
        id: 'daruma_red',
        name: 'Zen Daruma',
        tag: 'Goal & Fortune Doll',
        bg: 'linear-gradient(135deg, #241010 0%, #0a0404 100%)',
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#1a0909" stroke="#d4af37" stroke-width="3"/>
            <!-- Daruma Main Body -->
            <circle cx="50" cy="54" r="32" fill="#e63946" stroke="#900" stroke-width="2"/>
            <!-- Face Outline -->
            <ellipse cx="50" cy="46" rx="20" ry="18" fill="#fcf6ed" stroke="#d4af37" stroke-width="1.5"/>
            <!-- Eyebrows (Crane shape) -->
            <path d="M34 38 Q42 32 46 38" stroke="#111" stroke-width="3" fill="none"/>
            <path d="M66 38 Q58 32 54 38" stroke="#111" stroke-width="3" fill="none"/>
            <!-- Eyes (Zen Circles) -->
            <circle cx="40" cy="46" r="5" fill="#111"/>
            <circle cx="60" cy="46" r="5" fill="#111"/>
            <circle cx="41" cy="45" r="2" fill="#fff"/>
            <circle cx="61" cy="45" r="2" fill="#fff"/>
            <!-- Mustache & Gold Chest Inscription -->
            <path d="M36 54 Q50 60 64 54" stroke="#111" stroke-width="2.5" fill="none"/>
            <path d="M44 72 L50 64 L56 72 Z" fill="#d4af37"/>
        </svg>`
    }
];

function getPresetAvatarSVG(avatarId) {
    const found = KINTSUGI_PRESET_AVATARS.find(a => a.id === avatarId);
    if (found) return found.svg;
    return KINTSUGI_PRESET_AVATARS[0].svg; // Default Kitsune Gold
}

function renderAvatarHTML(user, sizeClass = 'w-10 h-10') {
    if (!user) return `<div class="avatar-circle ${sizeClass} bg-amber-900/50 flex items-center justify-center border border-amber-500/40 text-amber-300 font-bold">V</div>`;

    // Priority 1: Uploaded image IF avatar_type === 'uploaded' AND profile image URL is present
    if (user.avatar_type === 'uploaded' && (user.profile_image || user.profileImage)) {
        const imgSrc = user.profile_image || user.profileImage;
        return `<img src="${imgSrc}" alt="${user.username || 'User'}" class="avatar-circle ${sizeClass} rounded-full object-cover border-2 border-amber-400 shadow-md">`;
    }

    // Priority 2: Selected built-in Japanese preset SVG sticker (Kitsune, Samurai, Geisha, Crane, Torii, Daruma)
    const avatarId = user.avatar_id || user.avatarId || 'kitsune_gold';
    const svgCode = getPresetAvatarSVG(avatarId);
    return `<div class="avatar-circle ${sizeClass} rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md flex items-center justify-center bg-black/60">${svgCode}</div>`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KINTSUGI_PRESET_AVATARS, getPresetAvatarSVG, renderAvatarHTML };
}
