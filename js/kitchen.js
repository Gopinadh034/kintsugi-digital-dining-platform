/**
 * kitchen.js - KINTSUGI Chef & Hotel Order Command Station (Kitchen Display System / KDS)
 * Allows Chefs, Kitchen Staff, and Hotel Management to view, track, and manage customer orders and table bookings in real-time.
 */

// Seed sample orders if none exist yet to provide an immediate live demonstration
const SEED_KITCHEN_ORDERS = [
    {
        id: 'ord-17865001',
        customerName: 'Satoshi Nakamoto (VIP)',
        items: [
            { name: 'Wagyu A5 Nigiri', quantity: 2, price: 68 },
            { name: 'Otoro Bluefin Toro Roll', quantity: 1, price: 45 },
            { name: 'House Junmai Daiginjo Sake', quantity: 1, price: 32 }
        ],
        totalAmount: 213.00,
        deliveryAddress: 'Table 4 — Zen Garden VIP Booth',
        status: 'Preparing',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
    },
    {
        id: 'ord-17865002',
        customerName: 'Elena Rostova',
        items: [
            { name: 'Hokkaido Scallop Sashimi', quantity: 2, price: 38 },
            { name: 'Matcha Opera Layer Cake', quantity: 2, price: 18 }
        ],
        totalAmount: 112.00,
        deliveryAddress: 'Suite 804 — Luxury Hotel Wing',
        status: 'Cooking',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
    },
    {
        id: 'ord-17865003',
        customerName: 'Marcus Vance',
        items: [
            { name: 'Black Cod Miso Saikyo Yaki', quantity: 1, price: 52 },
            { name: 'Truffle Edamame', quantity: 1, price: 16 }
        ],
        totalAmount: 68.00,
        deliveryAddress: 'Counter Omakase — Seat 3',
        status: 'Ready',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    }
];

let kdsCurrentTab = 'all'; // 'all', 'preparing', 'cooking', 'ready', 'completed', 'reservations'
let kdsAutoRefreshTimer = null;
let kdsSearchQuery = '';

// Fetch Orders from Backend or Fallback Local Storage / Seed
async function getKitchenOrders() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        if (response.ok && data.success && data.orders && data.orders.length > 0) {
            return data.orders;
        }
    } catch (err) {
        console.warn('Kitchen API fetch note:', err.message);
    }
    const local = JSON.parse(localStorage.getItem('kintsugi_orders') || '[]');
    if (local.length > 0) return local;
    return SEED_KITCHEN_ORDERS;
}

// Fetch Reservations from Backend or Fallback Local Storage
async function getKitchenReservations() {
    try {
        const response = await fetch('/api/reservations');
        const data = await response.json();
        if (response.ok && data.success && data.reservations) {
            return data.reservations;
        }
    } catch (err) {
        console.warn('Kitchen Reservations fetch note:', err.message);
    }
    return JSON.parse(localStorage.getItem('kintsugi_reservations') || '[]');
}

// Inject Kitchen Display System Modal into DOM
function injectKitchenModalHTML() {
    if (document.getElementById('kitchenKDSModal')) return;

    const modalHTML = `
    <div id="kitchenKDSModal" class="kitchen-modal-backdrop hidden">
        <div class="kitchen-modal-card">
            
            <!-- KDS Header Bar -->
            <div class="kds-header">
                <div class="kds-brand flex items-center gap-3">
                    <div class="kds-gold-accent"></div>
                    <div>
                        <div class="kds-title-row">
                            <h2 class="kds-main-title">Chef & Hotel Order Command Station</h2>
                            <span class="kds-live-badge">
                                <span class="kds-pulse-dot"></span> LIVE KDS KITCHEN
                            </span>
                        </div>
                        <p class="kds-subtitle">Real-Time Kitchen Display System & Guest Order Monitoring</p>
                    </div>
                </div>
                
                <div class="kds-header-actions">
                    <button id="refreshKdsBtn" class="kds-sync-btn" title="Refresh Live Orders">
                        <i class="fas fa-sync-alt" id="refreshKdsIcon"></i> Sync Feed
                    </button>
                    <button id="closeKitchenModalBtn" class="kds-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- KDS Key Metrics HUD Bar -->
            <div class="kds-hud-bar">
                <div class="kds-stat-card">
                    <div class="kds-stat-icon gold">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="kds-stat-info">
                        <span class="kds-stat-label">Total Orders Booked</span>
                        <strong id="kdsTotalOrdersNum" class="kds-stat-value gold">0</strong>
                    </div>
                </div>
                
                <div class="kds-stat-card">
                    <div class="kds-stat-icon yellow">
                        <i class="fas fa-fire"></i>
                    </div>
                    <div class="kds-stat-info">
                        <span class="kds-stat-label">Active Kitchen Prep</span>
                        <strong id="kdsActiveOrdersNum" class="kds-stat-value yellow">0</strong>
                    </div>
                </div>

                <div class="kds-stat-card">
                    <div class="kds-stat-icon emerald">
                        <i class="fas fa-concierge-bell"></i>
                    </div>
                    <div class="kds-stat-info">
                        <span class="kds-stat-label">Ready / Served</span>
                        <strong id="kdsCompletedOrdersNum" class="kds-stat-value emerald">0</strong>
                    </div>
                </div>

                <div class="kds-stat-card">
                    <div class="kds-stat-icon amber">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="kds-stat-info">
                        <span class="kds-stat-label">Total Order Sales</span>
                        <strong id="kdsTotalRevenueNum" class="kds-stat-value amber">$0.00</strong>
                    </div>
                </div>
            </div>

            <!-- KDS Controls & Filter Tabs -->
            <div class="kds-filter-toolbar">
                <!-- Filter Tabs -->
                <div class="kds-tab-group">
                    <button class="kds-tab-btn active" data-tab="all">
                        <i class="fas fa-list-ul"></i> All Orders
                    </button>
                    <button class="kds-tab-btn" data-tab="preparing">
                        <i class="fas fa-utensils text-yellow"></i> Preparing
                    </button>
                    <button class="kds-tab-btn" data-tab="cooking">
                        <i class="fas fa-fire text-orange"></i> Cooking
                    </button>
                    <button class="kds-tab-btn" data-tab="ready">
                        <i class="fas fa-check-circle text-emerald"></i> Ready
                    </button>
                    <button class="kds-tab-btn" data-tab="reservations">
                        <i class="fas fa-calendar-check text-sky"></i> Table Reservations
                    </button>
                </div>

                <!-- Search Input Box -->
                <div class="kds-search-box">
                    <i class="fas fa-search kds-search-icon"></i>
                    <input type="text" id="kdsSearchInput" placeholder="Search order ID, guest name...">
                </div>
            </div>

            <!-- KDS Orders Grid Container -->
            <div class="kds-content-body custom-scrollbar">
                <div id="kdsOrdersContainer" class="kds-orders-grid">
                    <!-- Dynamic KDS Order Cards Injected Here -->
                </div>
            </div>

            <!-- KDS Footer -->
            <div class="kds-footer">
                <div class="kds-footer-left">
                    <i class="fas fa-shield-alt"></i>
                    <span>KINTSUGI Culinary Operational System • Automated MySQL & JSON Database Synchronization</span>
                </div>
                <div id="kdsLastSyncTime" class="kds-footer-right">
                    Last Feed Sync: <strong id="kdsSyncClock">---</strong>
                </div>
            </div>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    bindKitchenEvents();
}

// Bind Event Listeners inside Kitchen Modal
function bindKitchenEvents() {
    const closeBtn = document.getElementById('closeKitchenModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeKitchenModal);

    const refreshBtn = document.getElementById('refreshKdsBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => renderKitchenDashboard());

    const searchInput = document.getElementById('kdsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            kdsSearchQuery = e.target.value.toLowerCase();
            renderKitchenDashboard();
        });
    }

    // Tab buttons
    document.querySelectorAll('.kds-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.kds-tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            kdsCurrentTab = btn.getAttribute('data-tab');
            renderKitchenDashboard();
        });
    });
}

// Render Main KDS Dashboard
async function renderKitchenDashboard() {
    const container = document.getElementById('kdsOrdersContainer');
    if (!container) return;

    // Spin refresh icon briefly
    const icon = document.getElementById('refreshKdsIcon');
    if (icon) icon.classList.add('fa-spin');
    setTimeout(() => { if (icon) icon.classList.remove('fa-spin'); }, 800);

    const clockEl = document.getElementById('kdsSyncClock');
    if (clockEl) clockEl.innerText = new Date().toLocaleTimeString();

    if (kdsCurrentTab === 'reservations') {
        await renderReservationsFeed(container);
        return;
    }

    const orders = await getKitchenOrders();
    
    // Update HUD Stats
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Cooking').length;
    const completedOrders = orders.filter(o => o.status === 'Ready' || o.status === 'Completed').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

    document.getElementById('kdsTotalOrdersNum').innerText = totalOrders;
    document.getElementById('kdsActiveOrdersNum').innerText = activeOrders;
    document.getElementById('kdsCompletedOrdersNum').innerText = completedOrders;
    document.getElementById('kdsTotalRevenueNum').innerText = `$${totalRevenue.toFixed(2)}`;

    // Filter by tab
    let filtered = orders;
    if (kdsCurrentTab === 'preparing') filtered = orders.filter(o => o.status === 'Preparing');
    else if (kdsCurrentTab === 'cooking') filtered = orders.filter(o => o.status === 'Cooking');
    else if (kdsCurrentTab === 'ready') filtered = orders.filter(o => o.status === 'Ready' || o.status === 'Completed');

    // Filter by search query
    if (kdsSearchQuery) {
        filtered = filtered.filter(o => 
            o.id.toLowerCase().includes(kdsSearchQuery) ||
            (o.customerName && o.customerName.toLowerCase().includes(kdsSearchQuery)) ||
            (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(kdsSearchQuery)) ||
            (o.items && o.items.some(i => i.name && i.name.toLowerCase().includes(kdsSearchQuery)))
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="kds-empty-state">
                <i class="fas fa-utensils kds-empty-icon"></i>
                <h4 class="kds-empty-title">No Orders Found in Kitchen Feed</h4>
                <p class="kds-empty-sub">Customer orders placed from the Grand Menu will appear live here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(order => {
        const itemsList = (order.items || []).map(i => `
            <li class="kds-item-row">
                <span class="kds-item-name">
                    <span class="kds-item-qty">${i.quantity || 1}x</span>
                    ${i.name}
                </span>
                <span class="kds-item-price">$${((i.price || 0) * (i.quantity || 1)).toFixed(2)}</span>
            </li>
        `).join('');

        let statusBadge = '';
        if (order.status === 'Preparing') {
            statusBadge = `<span class="kds-badge badge-preparing"><i class="fas fa-spinner fa-spin"></i> Preparing</span>`;
        } else if (order.status === 'Cooking') {
            statusBadge = `<span class="kds-badge badge-cooking"><i class="fas fa-fire"></i> Cooking</span>`;
        } else if (order.status === 'Ready') {
            statusBadge = `<span class="kds-badge badge-ready"><i class="fas fa-check"></i> Ready</span>`;
        } else if (order.status === 'Completed') {
            statusBadge = `<span class="kds-badge badge-served"><i class="fas fa-flag-checkered"></i> Served</span>`;
        } else {
            statusBadge = `<span class="kds-badge badge-default">${order.status}</span>`;
        }

        const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

        return `
            <div class="kds-order-card">
                
                <!-- Card Header -->
                <div class="kds-card-top">
                    <div class="kds-card-meta">
                        <div class="kds-id-timestamp">
                            <span class="kds-order-id">${order.id}</span>
                            <span class="kds-timestamp"><i class="far fa-clock"></i> ${dateStr}</span>
                        </div>
                        ${statusBadge}
                    </div>

                    <!-- Customer Info -->
                    <div class="kds-customer-block">
                        <div class="kds-customer-name">
                            <i class="fas fa-user-circle"></i> ${order.customerName || 'VIP Guest'}
                        </div>
                        <div class="kds-customer-addr">
                            <i class="fas fa-map-marker-alt"></i> ${order.deliveryAddress || 'Counter Pickup'}
                        </div>
                    </div>

                    <!-- Ordered Items List -->
                    <ul class="kds-items-list">
                        ${itemsList}
                    </ul>
                </div>

                <!-- Card Footer & Action Buttons -->
                <div class="kds-card-bottom">
                    <div class="kds-total-row">
                        <span class="kds-total-label">Order Total:</span>
                        <span class="kds-total-amount">$${(parseFloat(order.totalAmount) || 0).toFixed(2)}</span>
                    </div>

                    <!-- Chef Workflow Buttons -->
                    <div class="kds-action-buttons">
                        <button onclick="updateOrderStatusAction('${order.id}', 'Cooking')" class="kds-btn btn-cook">
                            <i class="fas fa-fire"></i> Cooking
                        </button>
                        <button onclick="updateOrderStatusAction('${order.id}', 'Ready')" class="kds-btn btn-ready">
                            <i class="fas fa-concierge-bell"></i> Ready
                        </button>
                        <button onclick="updateOrderStatusAction('${order.id}', 'Completed')" class="kds-btn btn-serve">
                            <i class="fas fa-check"></i> Served
                        </button>
                    </div>
                </div>

            </div>
        `;
    }).join('');
}

// Render Table Reservations Feed inside KDS
async function renderReservationsFeed(container) {
    const reservations = await getKitchenReservations();
    
    if (!reservations || reservations.length === 0) {
        container.innerHTML = `
            <div class="kds-empty-state">
                <i class="fas fa-calendar-alt kds-empty-icon"></i>
                <h4 class="kds-empty-title">No Table Reservations Booked Yet</h4>
                <p class="kds-empty-sub">Guest table bookings will appear live here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reservations.map(res => `
        <div class="kds-reservation-card">
            <div class="kds-card-meta">
                <span class="kds-order-id">${res.id}</span>
                <span class="kds-badge badge-served">${res.status || 'Confirmed'}</span>
            </div>

            <div class="kds-customer-block">
                <h4 class="kds-customer-name">
                    <i class="fas fa-user"></i> ${res.guestName || res.guest_name}
                </h4>
                <p class="kds-res-details">
                    <span><i class="fas fa-users"></i> ${res.partySize || res.party_size} Guests</span>
                    <span>•</span>
                    <span><i class="far fa-calendar-alt"></i> ${res.date} @ ${res.time}</span>
                </p>
                <p class="kds-seating-text"><i class="fas fa-chair"></i> Seating: <strong>${res.seatingArea || res.seating_area || 'Standard'}</strong></p>
            </div>

            ${res.specialRequests || res.special_requests ? `
                <div class="kds-quote-box">
                    "<i class="fas fa-comment-alt"></i> ${res.specialRequests || res.special_requests}"
                </div>
            ` : ''}

            <div class="kds-res-actions">
                <button onclick="updateReservationStatusAction('${res.id}', 'Seated')" class="kds-btn btn-seated">
                    Mark Seated
                </button>
                <button onclick="updateReservationStatusAction('${res.id}', 'Completed')" class="kds-btn btn-serve">
                    Complete
                </button>
            </div>
        </div>
    `).join('');
}

// Action Handler to Update Order Status
async function updateOrderStatusAction(orderId, newStatus) {
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            if (window.showToast) window.showToast(`Order ${orderId} updated to "${newStatus}"!`);
        }
    } catch (err) {
        console.warn('Backend offline, updating local order status:', err.message);
    }

    // Local fallback update
    const orders = JSON.parse(localStorage.getItem('kintsugi_orders') || '[]');
    const target = orders.find(o => o.id === orderId);
    if (target) {
        target.status = newStatus;
        localStorage.setItem('kintsugi_orders', JSON.stringify(orders));
    }
    
    // Also update seed sample list in memory
    const seedTarget = SEED_KITCHEN_ORDERS.find(o => o.id === orderId);
    if (seedTarget) seedTarget.status = newStatus;

    if (window.zenAudio) window.zenAudio.playChime();
    renderKitchenDashboard();
}

// Action Handler to Update Reservation Status
async function updateReservationStatusAction(resId, newStatus) {
    try {
        const response = await fetch(`/api/reservations/${resId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            if (window.showToast) window.showToast(`Reservation ${resId} marked as "${newStatus}"!`);
        }
    } catch (err) {
        console.warn('Backend offline, updating local reservation status:', err.message);
    }

    if (window.zenAudio) window.zenAudio.playChime();
    renderKitchenDashboard();
}

// Check if current logged-in user is Chef, Owner, or Management Staff
function isStaffOrOwner() {
    let currentUser = null;
    try {
        const userStr = localStorage.getItem('gourmet_current_user');
        if (userStr) currentUser = JSON.parse(userStr);
    } catch (e) {}

    if (!currentUser) return false;

    const role = (currentUser.role || '').toLowerCase();
    const username = (currentUser.username || '').toLowerCase();
    const email = (currentUser.email || '').toLowerCase();

    // Only allow Chef, Owner, Head Chef, Admin, or specific staff credentials
    const isStaffRole = ['head_chef', 'chef', 'owner', 'admin', 'kitchen_staff', 'manager'].includes(role);
    const isStaffUser = username === 'chef' || email === 'chef@kintsugi.com' || username.includes('chef') || username.includes('owner') || username.includes('admin');

    return isStaffRole || isStaffUser;
}

// Show/Hide Kitchen Portal Buttons based on logged in user role
function updateKitchenButtonVisibility() {
    const hasAccess = isStaffOrOwner();
    const kitchenButtons = document.querySelectorAll('.btn-kitchen-portal, #footerKitchenBtn, #openKitchenPortalBtn');

    kitchenButtons.forEach(btn => {
        if (btn) {
            if (hasAccess) {
                btn.style.display = '';
                if (btn.parentElement && btn.parentElement.tagName === 'LI') {
                    btn.parentElement.style.display = '';
                }
            } else {
                btn.style.display = 'none';
                if (btn.parentElement && btn.parentElement.tagName === 'LI') {
                    btn.parentElement.style.display = 'none';
                }
            }
        }
    });
}

// Open Kitchen Display Modal
function openKitchenModal() {
    if (!isStaffOrOwner()) {
        const msg = 'Access Restricted: Kitchen Display System is reserved for Chef & Hotel Staff only.';
        if (window.showToast) {
            window.showToast(msg);
        } else {
            alert(msg);
        }
        return;
    }

    injectKitchenModalHTML();
    const modal = document.getElementById('kitchenKDSModal');
    if (!modal) return;

    renderKitchenDashboard();
    modal.classList.remove('hidden');

    // Start 5-second auto-polling loop
    if (kdsAutoRefreshTimer) clearInterval(kdsAutoRefreshTimer);
    kdsAutoRefreshTimer = setInterval(() => {
        if (!modal.classList.contains('hidden')) {
            renderKitchenDashboard();
        }
    }, 5000);
}

// Close Kitchen Modal
function closeKitchenModal() {
    const modal = document.getElementById('kitchenKDSModal');
    if (modal) modal.classList.add('hidden');
    if (kdsAutoRefreshTimer) clearInterval(kdsAutoRefreshTimer);
}

// Auto-bind button triggers on page load and control visibility
document.addEventListener('DOMContentLoaded', () => {
    updateKitchenButtonVisibility();

    const btn = document.getElementById('openKitchenPortalBtn');
    if (btn) btn.addEventListener('click', openKitchenModal);

    const footerBtn = document.getElementById('footerKitchenBtn');
    if (footerBtn) footerBtn.addEventListener('click', openKitchenModal);
});

// Re-check visibility when storage updates or profile updates
window.addEventListener('storage', updateKitchenButtonVisibility);

// Expose globally
window.openKitchenModal = openKitchenModal;
window.closeKitchenModal = closeKitchenModal;
window.updateOrderStatusAction = updateOrderStatusAction;
window.updateReservationStatusAction = updateReservationStatusAction;
window.updateKitchenButtonVisibility = updateKitchenButtonVisibility;
window.isStaffOrOwner = isStaffOrOwner;

