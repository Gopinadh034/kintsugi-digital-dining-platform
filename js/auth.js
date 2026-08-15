/**
 * auth.js - Session management, signup, login, and Gmail SMTP Email OTP authentication.
 */

// Helper to get current logged in user
function getCurrentUser() {
    const userStr = localStorage.getItem('gourmet_current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Redirect helpers
function redirectToLogin() {
    window.location.href = 'login.html';
}

function redirectToHome() {
    window.location.href = 'index.html';
}

// Pre-seed default demo accounts if not present
function seedDemoAccounts() {
    let users = JSON.parse(localStorage.getItem('gourmet_users') || '[]');
    const defaults = [
        { username: 'chef', email: 'chef@kintsugi.com', password: 'password' },
        { username: 'vip_guest', email: 'guest@kintsugi.com', password: 'omakase2026' },
        { username: 'admin', email: 'admin@kintsugi.com', password: 'admin123' }
    ];
    let updated = false;
    defaults.forEach(d => {
        if (!users.some(u => u.username.toLowerCase() === d.username.toLowerCase())) {
            users.push(d);
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('gourmet_users', JSON.stringify(users));
    }
}
seedDemoAccounts();

// Check session on page load
function checkSession() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and not on login page, redirect to login
    if (!currentUser && currentPage !== 'login.html') {
        redirectToLogin();
    }
    // If logged in and on login page, redirect to home
    if (currentUser && currentPage === 'login.html') {
        redirectToHome();
    }
}

// Perform check immediately
checkSession();

// -------------------------------------------------------------
// REGISTRATION & OTP API CLIENT METHODS
// -------------------------------------------------------------

// Initiate User Registration & Send Email OTP
async function initiateRegistration(name, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        return { success: false, message: 'Password and Confirm Password do not match.' };
    }
    if (password.length < 4) {
        return { success: false, message: 'Password must be at least 4 characters long.' };
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username: name, email, password, confirmPassword })
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Registration initiate error:', err);
        return { success: false, message: 'Unable to connect to registration server.' };
    }
}

// Verify Registration OTP & Activate Account
async function verifyRegistrationOTP(email, otp) {
    try {
        const response = await fetch('/api/auth/verify-registration-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
            if (data.token) {
                localStorage.setItem('kintsugi_token', data.token);
            }
            localStorage.setItem('gourmet_current_user', JSON.stringify(data.user || { email }));
        }
        return data;
    } catch (err) {
        console.error('Registration OTP verification error:', err);
        return { success: false, message: 'Unable to verify registration OTP.' };
    }
}

// Resend Registration OTP
async function resendRegistrationOTP(email) {
    try {
        const response = await fetch('/api/auth/resend-registration-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Resend registration OTP error:', err);
        return { success: false, message: 'Unable to resend verification OTP.' };
    }
}

// Legacy alias for signupUser
async function signupUser(username, email, password) {
    return initiateRegistration(username, email, password, password);
}

// -------------------------------------------------------------
// LOGIN API CLIENT METHOD
// -------------------------------------------------------------
async function loginUser(usernameOrEmail, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            if (data.token) {
                localStorage.setItem('kintsugi_token', data.token);
            }
            localStorage.setItem('gourmet_current_user', JSON.stringify(data.user || { username: usernameOrEmail }));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Invalid username/email or password.' };
        }
    } catch (err) {
        console.warn('Backend server offline or unreachable, falling back to client-side auth:', err);
        const users = JSON.parse(localStorage.getItem('gourmet_users') || '[]');
        const user = users.find(u => 
            (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
             u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
            u.password === password
        );
        
        if (user) {
            localStorage.setItem('gourmet_current_user', JSON.stringify({ 
                username: user.username, 
                email: user.email 
            }));
            return { success: true };
        } else {
            return { success: false, message: 'Invalid username/email or password.' };
        }
    }
}

// -------------------------------------------------------------
// FORGOT & RESET PASSWORD CLIENT METHODS
// -------------------------------------------------------------

// Initiate Forgot Password & Send Email OTP
async function initiateForgotPassword(email) {
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Forgot password error:', err);
        return { success: false, message: 'Unable to connect to security server.' };
    }
}

// Alias requestPasswordOTP
async function requestPasswordOTP(email) {
    return initiateForgotPassword(email);
}

// Verify Forgot Password OTP
async function verifyForgotPasswordOTP(email, otp) {
    try {
        const response = await fetch('/api/auth/verify-forgot-password-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Verify forgot password OTP error:', err);
        return { success: false, message: 'Unable to verify reset OTP.' };
    }
}

// Reset Password with OTP Verification
async function resetPasswordWithOTP(email, otp, newPassword, confirmPassword) {
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword, confirmPassword })
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Reset password error:', err);
        return { success: false, message: 'Unable to update password.' };
    }
}

// User Logout
function logoutUser() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Out...';
        logoutBtn.disabled = true;
    }
    localStorage.removeItem('gourmet_current_user');
    setTimeout(() => {
        redirectToLogin();
    }, 400);
}

// Setup User Profile Navbar HUD
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    const userNavContainer = document.getElementById('userNavContainer');
    
    if (userNavContainer) {
        if (currentUser) {
            const initial = (currentUser.username || currentUser.email || 'V').charAt(0).toUpperCase();
            userNavContainer.innerHTML = `
                <div class="user-nav-compact">
                    <button id="openProfileBtn" class="user-profile-badge-small" title="Member Sanctuary Profile (${currentUser.username || currentUser.email})">
                        <div class="avatar-circle flex items-center justify-center font-bold" style="width:32px; height:32px; border-radius:50%; background:var(--gold-gradient); color:#07070b; border:1.5px solid var(--gold-primary); font-size:0.8rem; box-shadow:0 0 10px rgba(212,175,55,0.35);">${initial}</div>
                    </button>
                    <button class="btn-logout-under" id="logoutBtn" title="Sign Out">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logoutUser);
            }
            const openProfileBtn = document.getElementById('openProfileBtn');
            if (openProfileBtn && typeof openProfileModal === 'function') {
                openProfileBtn.addEventListener('click', openProfileModal);
            }
        } else {
            userNavContainer.innerHTML = `
                <a href="login.html" class="btn-nav-login" title="Member Access Portal">
                    <i class="fas fa-sign-in-alt"></i> <span>VIP Member Login</span>
                </a>
            `;
        }
    }
});
