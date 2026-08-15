/**
 * profile.js - KINTSUGI Luxury Member Profile Dashboard System
 * Handles profile display, edit personal details, built-in Japanese avatars,
 * safe custom image uploads, change password, and header integration.
 */

// Helper to fetch authenticated user profile from backend
async function fetchUserProfile() {
    const token = localStorage.getItem('kintsugi_token');
    if (!token) return getCurrentUser();

    try {
        const response = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.success && data.user) {
            localStorage.setItem('gourmet_current_user', JSON.stringify(data.user));
            return data.user;
        }
    } catch (err) {
        console.error('Error fetching live user profile:', err);
    }
    return getCurrentUser();
}

// Render Profile Header Badge (Small profile picture with Logout stacked underneath)
async function renderHeaderProfile() {
    const userNavContainer = document.getElementById('userNavContainer');
    if (!userNavContainer) return;

    const user = await fetchUserProfile();
    if (!user) {
        userNavContainer.innerHTML = `
            <a href="login.html" class="btn-nav-login" title="Member Access Portal">
                <i class="fas fa-sign-in-alt"></i> <span>VIP Member Login</span>
            </a>
        `;
        return;
    }

    const avatarHtml = renderAvatarHTML(user, 'w-8 h-8');

    userNavContainer.innerHTML = `
        <div class="user-nav-compact">
            <button id="openProfileBtn" class="user-profile-badge-small" title="Member Profile Sanctuary (${user.username || user.name || 'VIP Member'})">
                ${avatarHtml}
            </button>
            <button class="btn-logout-under" id="logoutBtn" title="Sign Out">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    `;

    const openProfileBtn = document.getElementById('openProfileBtn');
    if (openProfileBtn) {
        openProfileBtn.addEventListener('click', openProfileModal);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
}

// Inject Profile Modal HTML into Page
function injectProfileModalHTML() {
    if (document.getElementById('profileDashboardModal')) return;

    const modalHTML = `
    <div id="profileDashboardModal" class="profile-modal-backdrop hidden fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
        <div class="profile-modal-card relative w-full max-w-2xl bg-[#0c0a09] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <!-- Modal Header -->
            <div class="modal-top-bar flex items-center justify-between p-5 bg-gradient-to-r from-stone-900 via-neutral-900 to-black border-b border-amber-500/20">
                <div class="flex items-center gap-3">
                    <div class="w-2.5 h-7 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                    <div>
                        <h2 class="text-xl font-bold text-amber-100 tracking-wide font-serif">Member Profile Sanctuary</h2>
                        <p class="text-xs text-amber-400/70">KINTSUGI Haute Gastronomy Membership Portal</p>
                    </div>
                </div>
                <button id="closeProfileModalBtn" class="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-amber-900/40 text-amber-300 hover:text-amber-100 flex items-center justify-center transition-colors border border-amber-500/20">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Modal Content Body -->
            <div class="modal-body overflow-y-auto p-6 space-y-6 custom-scrollbar text-amber-50">

                <!-- User Hero Banner -->
                <div class="hero-profile-box p-6 rounded-xl bg-gradient-to-br from-stone-900/90 via-neutral-900/90 to-black border border-amber-500/30 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <!-- Avatar Preview & Quick Change Button -->
                    <div class="relative group cursor-pointer" id="heroAvatarTrigger" title="Change Avatar">
                        <div id="modalAvatarDisplay" class="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400/90 shadow-xl relative">
                            <!-- Injected Dynamically -->
                        </div>
                        <div class="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-amber-300 text-xs font-semibold">
                            <i class="fas fa-camera text-base mb-1"></i>
                            <span>Change</span>
                        </div>
                    </div>

                    <!-- Main Meta -->
                    <div class="flex-1 text-center sm:text-left">
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                            <h3 id="modalUserName" class="text-2xl font-bold text-amber-100 font-serif">---</h3>
                            <span id="modalUserRole" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">VIP Member</span>
                        </div>
                        <p id="modalUserEmail" class="text-sm text-zinc-400 mb-3"><i class="far me-1 fa-envelope text-amber-400/70"></i> ---</p>
                        <div class="flex flex-wrap gap-2 justify-center sm:justify-start text-xs text-amber-300/80">
                            <span class="bg-black/40 px-3 py-1 rounded-md border border-amber-500/20"><i class="far fa-calendar-alt mr-1 text-amber-400"></i> Member Since: <strong id="modalJoinedDate">---</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="flex border-b border-amber-500/20 gap-2">
                    <button id="tabOverviewBtn" class="tab-btn active px-4 py-2.5 text-sm font-medium text-amber-400 border-b-2 border-amber-400 transition-all flex items-center gap-2">
                        <i class="fas fa-id-card"></i> Overview & Details
                    </button>
                    <button id="tabAvatarBtn" class="tab-btn px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-amber-300 border-b-2 border-transparent transition-all flex items-center gap-2">
                        <i class="fas fa-user-circle"></i> Change Avatar
                    </button>
                    <button id="tabPasswordBtn" class="tab-btn px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-amber-300 border-b-2 border-transparent transition-all flex items-center gap-2">
                        <i class="fas fa-lock"></i> Security
                    </button>
                </div>

                <!-- SECTION 1: OVERVIEW & DETAILS -->
                <div id="sectionOverview" class="tab-section space-y-5">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="detail-card p-4 rounded-lg bg-stone-900/50 border border-amber-500/20">
                            <span class="text-xs text-amber-400/70 block mb-1">Full Name</span>
                            <span id="detailFullName" class="font-semibold text-amber-100 text-sm">---</span>
                        </div>
                        <div class="detail-card p-4 rounded-lg bg-stone-900/50 border border-amber-500/20">
                            <span class="text-xs text-amber-400/70 block mb-1">Email Address (Verified Identity)</span>
                            <span id="detailEmail" class="font-semibold text-amber-100 text-sm">---</span>
                        </div>
                        <div class="detail-card p-4 rounded-lg bg-stone-900/50 border border-amber-500/20">
                            <span class="text-xs text-amber-400/70 block mb-1">Phone Number</span>
                            <span id="detailPhone" class="font-semibold text-amber-100 text-sm">Not Provided</span>
                        </div>
                        <div class="detail-card p-4 rounded-lg bg-stone-900/50 border border-amber-500/20">
                            <span class="text-xs text-amber-400/70 block mb-1">Date of Birth</span>
                            <span id="detailDOB" class="font-semibold text-amber-100 text-sm">Not Provided</span>
                        </div>
                        <div class="detail-card p-4 rounded-lg bg-stone-900/50 border border-amber-500/20 sm:col-span-2">
                            <span class="text-xs text-amber-400/70 block mb-1">Gender</span>
                            <span id="detailGender" class="font-semibold text-amber-100 text-sm">Not Specified</span>
                        </div>
                        <div class="detail-card p-4 rounded-lg bg-stone-900/50 border border-amber-500/20 sm:col-span-2">
                            <span class="text-xs text-amber-400/70 block mb-1">Dining Delivery Address</span>
                            <span id="detailAddress" class="font-semibold text-amber-100 text-sm">Not Provided</span>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 pt-2">
                        <button id="showEditFormBtn" class="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-sm shadow-lg transition-all flex items-center gap-2">
                            <i class="fas fa-edit"></i> Edit Personal Details
                        </button>
                    </div>
                </div>

                <!-- SECTION 1B: EDIT FORM (HIDDEN BY DEFAULT) -->
                <form id="sectionEditForm" class="tab-section hidden space-y-4 p-4 rounded-xl bg-stone-900/60 border border-amber-500/30">
                    <h4 class="text-base font-bold text-amber-200 border-b border-amber-500/20 pb-2">Update Personal Information</h4>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label class="block text-amber-300 mb-1">Full Name / Display Name</label>
                            <input type="text" id="editName" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none" required>
                        </div>
                        <div>
                            <label class="block text-amber-300 mb-1">Phone Number</label>
                            <input type="tel" id="editPhone" placeholder="+1 (555) 000-0000" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-amber-300 mb-1">Date of Birth</label>
                            <input type="date" id="editDOB" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-amber-300 mb-1">Gender</label>
                            <select id="editGender" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none">
                                <option value="">Prefer Not to Say</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-amber-300 mb-1">Address</label>
                            <textarea id="editAddress" rows="2" placeholder="Suite, Street Address, City, Country" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none"></textarea>
                        </div>
                    </div>

                    <div id="editFormFeedback" class="hidden text-xs p-2.5 rounded-lg"></div>

                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" id="cancelEditBtn" class="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-zinc-300 text-xs font-semibold transition-all">Cancel</button>
                        <button type="submit" id="saveEditBtn" class="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center gap-1">
                            <i class="fas fa-check"></i> Save Changes
                        </button>
                    </div>
                </form>

                <!-- SECTION 2: CHANGE AVATAR -->
                <div id="sectionAvatar" class="tab-section hidden space-y-6">
                    
                    <!-- OPTION 1: BUILT-IN JAPANESE STICKER AVATARS -->
                    <div class="bg-stone-900/60 p-5 rounded-xl border border-amber-500/30 space-y-3">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-bold text-amber-200 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                                Option 1 — Select Built-in Japanese Sticker Avatar
                            </h4>
                            <span class="text-[10px] text-amber-400/60">6 Luxury Designs</span>
                        </div>
                        
                        <div id="presetAvatarGrid" class="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                            <!-- Injected Dynamically via JS -->
                        </div>
                    </div>

                    <!-- OPTION 2: UPLOAD OWN PROFILE IMAGE -->
                    <div class="bg-stone-900/60 p-5 rounded-xl border border-amber-500/30 space-y-4">
                        <h4 class="text-sm font-bold text-amber-200 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                            Option 2 — Upload Your Own Profile Picture
                        </h4>
                        
                        <div class="flex flex-col sm:flex-row items-center gap-4">
                            <div id="imagePreviewBox" class="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center bg-black/60 overflow-hidden shrink-0">
                                <i class="fas fa-cloud-upload-alt text-amber-400/50 text-2xl"></i>
                            </div>

                            <div class="flex-1 text-center sm:text-left space-y-2 w-full">
                                <input type="file" id="avatarFileInput" accept="image/jpeg,image/jpg,image/png,image/webp" class="hidden">
                                <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <button type="button" id="browseImageBtn" class="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all">
                                        <i class="fas fa-folder-open mr-1"></i> Choose Image File
                                    </button>
                                    <button type="button" id="uploadImageBtn" class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all disabled:opacity-50" disabled>
                                        <i class="fas fa-upload mr-1"></i> Upload Image
                                    </button>
                                    <button type="button" id="removeImageBtn" class="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all">
                                        <i class="fas fa-trash-alt mr-1"></i> Remove Custom Image
                                    </button>
                                </div>
                                <p class="text-[11px] text-zinc-400">Formats: <strong>JPG, JPEG, PNG, WEBP</strong> (Max file size: 5MB)</p>
                            </div>
                        </div>

                        <div id="avatarUploadFeedback" class="hidden text-xs p-2.5 rounded-lg"></div>
                    </div>

                </div>

                <!-- SECTION 3: CHANGE PASSWORD -->
                <form id="sectionPassword" class="tab-section hidden space-y-4 p-5 rounded-xl bg-stone-900/60 border border-amber-500/30">
                    <h4 class="text-sm font-bold text-amber-200 border-b border-amber-500/20 pb-2 flex items-center gap-2">
                        <i class="fas fa-shield-alt text-amber-400"></i> Update Passcode Security
                    </h4>

                    <div class="space-y-3 text-xs max-w-md">
                        <div>
                            <label class="block text-amber-300 mb-1">Current Passcode</label>
                            <input type="password" id="passCurrent" placeholder="Enter current passcode" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none" required>
                        </div>
                        <div>
                            <label class="block text-amber-300 mb-1">New Passcode</label>
                            <input type="password" id="passNew" placeholder="At least 4 characters" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none" required>
                        </div>
                        <div>
                            <label class="block text-amber-300 mb-1">Confirm New Passcode</label>
                            <input type="password" id="passConfirm" placeholder="Re-enter new passcode" class="w-full px-3 py-2 bg-black/70 border border-amber-500/30 rounded-lg text-amber-100 focus:border-amber-400 focus:outline-none" required>
                        </div>
                    </div>

                    <div id="passFeedback" class="hidden text-xs p-2.5 rounded-lg"></div>

                    <div class="pt-2">
                        <button type="submit" id="changePassBtn" class="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center gap-1">
                            <i class="fas fa-key"></i> Update Passcode
                        </button>
                    </div>
                </form>

            </div>

            <!-- Modal Footer -->
            <div class="modal-footer p-4 bg-black/90 border-t border-amber-500/20 flex items-center justify-between">
                <span class="text-[11px] text-amber-400/60 font-serif">KINTSUGI Haute Gastronomy Member ID: <strong id="modalFooterUserId">---</strong></span>
                <button id="modalLogoutBtn" class="px-4 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5">
                    <i class="fas fa-sign-out-alt"></i> Logout Session
                </button>
            </div>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    bindProfileEvents();
}

// Open Profile Modal and Sync User Info
async function openProfileModal() {
    injectProfileModalHTML();
    const modal = document.getElementById('profileDashboardModal');
    if (!modal) return;

    const user = await fetchUserProfile();
    if (!user) {
        redirectToLogin();
        return;
    }

    // Populate Hero & Overview
    const avatarHtml = renderAvatarHTML(user, 'w-24 h-24');
    document.getElementById('modalAvatarDisplay').innerHTML = avatarHtml;
    document.getElementById('modalUserName').innerText = user.username || user.name || 'VIP Member';
    document.getElementById('modalUserRole').innerText = (user.role || 'vip_member').replace('_', ' ');
    document.getElementById('modalUserEmail').innerHTML = `<i class="far fa-envelope text-amber-400/70 mr-1"></i> ${user.email}`;
    document.getElementById('modalJoinedDate').innerText = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active';
    document.getElementById('modalFooterUserId').innerText = user.id || '---';

    document.getElementById('detailFullName').innerText = user.username || user.name || '---';
    document.getElementById('detailEmail').innerText = user.email || '---';
    document.getElementById('detailPhone').innerText = user.phone || 'Not Provided';
    document.getElementById('detailDOB').innerText = user.date_of_birth || 'Not Provided';
    document.getElementById('detailGender').innerText = user.gender || 'Not Specified';
    document.getElementById('detailAddress').innerText = user.address || 'Not Provided';

    // Populate Edit Form Inputs
    document.getElementById('editName').value = user.username || user.name || '';
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editDOB').value = user.date_of_birth || '';
    document.getElementById('editGender').value = user.gender || '';
    document.getElementById('editAddress').value = user.address || '';

    // Render Built-in Avatar Grid
    renderPresetAvatarGrid(user.avatar_id || user.avatarId || 'kitsune_gold');

    // Show Overview Section by default
    switchTab('overview');

    // Display Modal
    modal.classList.remove('hidden');
}

// Close Modal
function closeProfileModal() {
    const modal = document.getElementById('profileDashboardModal');
    if (modal) modal.classList.add('hidden');
}

// Tab Switcher Helper
function switchTab(tabName) {
    const secOverview = document.getElementById('sectionOverview');
    const secEditForm = document.getElementById('sectionEditForm');
    const secAvatar = document.getElementById('sectionAvatar');
    const secPassword = document.getElementById('sectionPassword');

    const tabOverviewBtn = document.getElementById('tabOverviewBtn');
    const tabAvatarBtn = document.getElementById('tabAvatarBtn');
    const tabPasswordBtn = document.getElementById('tabPasswordBtn');

    [secOverview, secEditForm, secAvatar, secPassword].forEach(s => s && s.classList.add('hidden'));
    [tabOverviewBtn, tabAvatarBtn, tabPasswordBtn].forEach(t => {
        if (t) {
            t.classList.remove('text-amber-400', 'border-amber-400');
            t.classList.add('text-zinc-400', 'border-transparent');
        }
    });

    if (tabName === 'overview') {
        secOverview.classList.remove('hidden');
        tabOverviewBtn.classList.add('text-amber-400', 'border-amber-400');
    } else if (tabName === 'edit') {
        secEditForm.classList.remove('hidden');
        tabOverviewBtn.classList.add('text-amber-400', 'border-amber-400');
    } else if (tabName === 'avatar') {
        secAvatar.classList.remove('hidden');
        tabAvatarBtn.classList.add('text-amber-400', 'border-amber-400');
    } else if (tabName === 'password') {
        secPassword.classList.remove('hidden');
        tabPasswordBtn.classList.add('text-amber-400', 'border-amber-400');
    }
}

// Render Built-in Avatar Options Grid
function renderPresetAvatarGrid(currentAvatarId) {
    const grid = document.getElementById('presetAvatarGrid');
    if (!grid) return;

    grid.innerHTML = KINTSUGI_PRESET_AVATARS.map(avatar => {
        const isSelected = avatar.id === currentAvatarId;
        return `
            <div class="preset-avatar-card group cursor-pointer p-2 rounded-xl bg-black/60 border ${isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-amber-500/20 hover:border-amber-400/60'} transition-all flex flex-col items-center text-center" data-id="${avatar.id}">
                <div class="w-12 h-12 rounded-full overflow-hidden mb-1.5 shadow-md">
                    ${avatar.svg}
                </div>
                <span class="text-[10px] font-bold text-amber-200 truncate w-full">${avatar.name}</span>
                <span class="text-[8px] text-zinc-400 truncate w-full">${avatar.tag}</span>
            </div>
        `;
    }).join('');

    // Bind click events on built-in avatar stickers
    grid.querySelectorAll('.preset-avatar-card').forEach(card => {
        card.addEventListener('click', async () => {
            const avatarId = card.getAttribute('data-id');
            await selectPresetAvatar(avatarId);
        });
    });
}

// Select Built-in Preset Avatar API Call & Local Sync
async function selectPresetAvatar(avatarId) {
    let currentUser = getCurrentUser() || {};
    currentUser.avatar_type = 'preset';
    currentUser.avatar_id = avatarId;
    currentUser.avatarId = avatarId;
    currentUser.profile_image = null;
    currentUser.profileImage = null;

    localStorage.setItem('gourmet_current_user', JSON.stringify(currentUser));

    // Update Header and Modal UI immediately
    renderHeaderProfile();
    const modalAvatarDisplay = document.getElementById('modalAvatarDisplay');
    if (modalAvatarDisplay) {
        modalAvatarDisplay.innerHTML = renderAvatarHTML(currentUser, 'w-24 h-24');
    }
    renderPresetAvatarGrid(avatarId);

    const token = localStorage.getItem('kintsugi_token');
    if (token) {
        try {
            const response = await fetch('/api/profile/select-avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar_id: avatarId })
            });
            const data = await response.json();
            if (response.ok && data.success && data.user) {
                localStorage.setItem('gourmet_current_user', JSON.stringify(data.user));
                renderHeaderProfile();
                if (modalAvatarDisplay) {
                    modalAvatarDisplay.innerHTML = renderAvatarHTML(data.user, 'w-24 h-24');
                }
                renderPresetAvatarGrid(avatarId);
            }
        } catch (err) {
            console.warn('Backend select-avatar note:', err);
        }
    }
}

// Bind Events inside Modal
function bindProfileEvents() {
    const closeBtn = document.getElementById('closeProfileModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeProfileModal);

    const modalLogoutBtn = document.getElementById('modalLogoutBtn');
    if (modalLogoutBtn) modalLogoutBtn.addEventListener('click', logoutUser);

    // Hero avatar trigger click
    const heroAvatarTrigger = document.getElementById('heroAvatarTrigger');
    if (heroAvatarTrigger) {
        heroAvatarTrigger.addEventListener('click', () => switchTab('avatar'));
    }

    // Tabs
    const tabOverviewBtn = document.getElementById('tabOverviewBtn');
    const tabAvatarBtn = document.getElementById('tabAvatarBtn');
    const tabPasswordBtn = document.getElementById('tabPasswordBtn');

    if (tabOverviewBtn) tabOverviewBtn.addEventListener('click', () => switchTab('overview'));
    if (tabAvatarBtn) tabAvatarBtn.addEventListener('click', () => switchTab('avatar'));
    if (tabPasswordBtn) tabPasswordBtn.addEventListener('click', () => switchTab('password'));

    // Show Edit Form button
    const showEditFormBtn = document.getElementById('showEditFormBtn');
    if (showEditFormBtn) showEditFormBtn.addEventListener('click', () => switchTab('edit'));

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => switchTab('overview'));

    // Save Edit Details Form
    const editForm = document.getElementById('sectionEditForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const feedback = document.getElementById('editFormFeedback');
            const token = localStorage.getItem('kintsugi_token');

            const payload = {
                name: document.getElementById('editName').value,
                phone: document.getElementById('editPhone').value,
                date_of_birth: document.getElementById('editDOB').value,
                gender: document.getElementById('editGender').value,
                address: document.getElementById('editAddress').value
            };

            // Local sync
            let currentUser = getCurrentUser() || {};
            currentUser.username = payload.name;
            currentUser.name = payload.name;
            currentUser.phone = payload.phone;
            currentUser.date_of_birth = payload.date_of_birth;
            currentUser.gender = payload.gender;
            currentUser.address = payload.address;
            localStorage.setItem('gourmet_current_user', JSON.stringify(currentUser));

            renderHeaderProfile();

            if (token) {
                try {
                    const response = await fetch('/api/profile/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    if (response.ok && data.success && data.user) {
                        localStorage.setItem('gourmet_current_user', JSON.stringify(data.user));
                        renderHeaderProfile();
                    }
                } catch (err) {
                    console.warn('Update profile submit note:', err);
                }
            }

            if (feedback) {
                feedback.className = 'text-xs p-2.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40';
                feedback.innerText = 'Profile details updated successfully!';
                feedback.classList.remove('hidden');
                setTimeout(() => {
                    feedback.classList.add('hidden');
                    openProfileModal();
                }, 1000);
            }
        });
    }

    // Image Upload Handlers
    const browseImageBtn = document.getElementById('browseImageBtn');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const removeImageBtn = document.getElementById('removeImageBtn');

    if (browseImageBtn && avatarFileInput) {
        browseImageBtn.addEventListener('click', () => avatarFileInput.click());
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const imgBox = document.getElementById('imagePreviewBox');
                    if (imgBox) imgBox.innerHTML = `<img src="${evt.target.result}" class="w-full h-full object-cover rounded-full">`;
                };
                reader.readAsDataURL(file);
                if (uploadImageBtn) uploadImageBtn.disabled = false;
            }
        });
    }

    if (uploadImageBtn) {
        uploadImageBtn.addEventListener('click', async () => {
            const file = avatarFileInput.files[0];
            if (!file) return;

            const feedback = document.getElementById('avatarUploadFeedback');
            const token = localStorage.getItem('kintsugi_token');

            const reader = new FileReader();
            reader.onload = async function(evt) {
                const dataUrl = evt.target.result;

                let currentUser = getCurrentUser() || {};
                currentUser.avatar_type = 'uploaded';
                currentUser.profile_image = dataUrl;
                currentUser.profileImage = dataUrl;
                localStorage.setItem('gourmet_current_user', JSON.stringify(currentUser));

                renderHeaderProfile();
                const modalAvatarDisplay = document.getElementById('modalAvatarDisplay');
                if (modalAvatarDisplay) {
                    modalAvatarDisplay.innerHTML = renderAvatarHTML(currentUser, 'w-24 h-24');
                }

                if (token) {
                    try {
                        const formData = new FormData();
                        formData.append('avatar', file);
                        const response = await fetch('/api/profile/upload-image', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                        });
                        const data = await response.json();
                        if (response.ok && data.success && data.user) {
                            localStorage.setItem('gourmet_current_user', JSON.stringify(data.user));
                            renderHeaderProfile();
                            if (modalAvatarDisplay) {
                                modalAvatarDisplay.innerHTML = renderAvatarHTML(data.user, 'w-24 h-24');
                            }
                        }
                    } catch (err) {
                        console.warn('Backend image upload fallback to base64 preview:', err);
                    }
                }

                if (feedback) {
                    feedback.className = 'text-xs p-2.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40';
                    feedback.innerText = 'Profile picture uploaded successfully!';
                    feedback.classList.remove('hidden');
                    setTimeout(() => {
                        feedback.classList.add('hidden');
                    }, 1500);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', async () => {
            let currentUser = getCurrentUser() || {};
            currentUser.avatar_type = 'default';
            currentUser.avatar_id = 'kitsune_gold';
            currentUser.avatarId = 'kitsune_gold';
            currentUser.profile_image = null;
            currentUser.profileImage = null;
            localStorage.setItem('gourmet_current_user', JSON.stringify(currentUser));

            renderHeaderProfile();
            const modalAvatarDisplay = document.getElementById('modalAvatarDisplay');
            if (modalAvatarDisplay) {
                modalAvatarDisplay.innerHTML = renderAvatarHTML(currentUser, 'w-24 h-24');
            }
            renderPresetAvatarGrid('kitsune_gold');

            const token = localStorage.getItem('kintsugi_token');
            if (token) {
                try {
                    const response = await fetch('/api/profile/remove-image', {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (response.ok && data.success && data.user) {
                        localStorage.setItem('gourmet_current_user', JSON.stringify(data.user));
                        renderHeaderProfile();
                        if (modalAvatarDisplay) {
                            modalAvatarDisplay.innerHTML = renderAvatarHTML(data.user, 'w-24 h-24');
                        }
                    }
                } catch (err) {
                    console.warn('Error removing profile image:', err);
                }
            }
        });
    }

    // Change Password Form
    const passwordForm = document.getElementById('sectionPassword');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('passCurrent').value;
            const newPassword = document.getElementById('passNew').value;
            const confirmPassword = document.getElementById('passConfirm').value;
            const feedback = document.getElementById('passFeedback');
            const token = localStorage.getItem('kintsugi_token');

            if (newPassword !== confirmPassword) {
                feedback.className = 'text-xs p-2.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/40';
                feedback.innerText = 'New Password and Confirm Password do not match.';
                feedback.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch('/api/profile/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    feedback.className = 'text-xs p-2.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40';
                    feedback.innerText = 'Passcode updated successfully!';
                    feedback.classList.remove('hidden');
                    passwordForm.reset();
                    setTimeout(() => feedback.classList.add('hidden'), 2000);
                } else {
                    feedback.className = 'text-xs p-2.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/40';
                    feedback.innerText = data.message || 'Failed to change passcode.';
                    feedback.classList.remove('hidden');
                }
            } catch (err) {
                console.error('Change password error:', err);
            }
        });
    }
}

// Auto Initialize Header Profile on Page Load
document.addEventListener('DOMContentLoaded', () => {
    injectProfileModalHTML();
    renderHeaderProfile();
});
