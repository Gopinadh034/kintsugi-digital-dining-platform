# 🥢 KINTSUGI (金継ぎ) — Luxury Haute Gastronomy & Kitchen Display System

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-brightgreen.svg)](https://nodejs.org/)
[![Express.js Framework](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Three.js WebGL](https://img.shields.io/badge/Three.js-r128-black.svg)](https://threejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20JSON%20Hybrid-orange.svg)](https://www.mysql.com/)
[![Aesthetic](https://img.shields.io/badge/Design-Dark%20Zen%20Luxury-gold.svg)](#design-system)

**KINTSUGI (金継ぎ)** is an interactive full-stack digital dining application and real-time **Kitchen Display System (KDS)** designed for high-end Japanese Kaiseki establishments and luxury hotel dining suites. Inspired by the Japanese art of restoring pottery with lacquer dusted with powdered gold, KINTSUGI combines 3D WebGL visuals with real-time culinary order tracking and guest management.

---

## ✨ Key Platform Features

### 1. 🍱 3D WebGL Interactive Grand Menu
- **Interactive 3D Stage**: Powered by `Three.js` with floating golden ember particle systems and dynamic camera focus.
- **Omakase Showcase**: Detailed Kaiseki flights, item descriptions, kanji stamps, prices, and allergen tags.
- **Filtering & Search**: Real-time recipe search and meal type filters (*Kaiseki Flights*, *Chef's Counter*, *Sake Vault*).

### 2. 👨‍🍳 Chef & Hotel Kitchen Display System (KDS)
- **Real-Time Command Station**: Full-screen, dark glassmorphic interface for chefs and hotel culinary staff.
- **Live Order Feed**: Filter by *Preparing*, *Cooking*, *Ready*, and *Served* with 1-click status updating.
- **Key Metrics HUD**: Real-time stats on total active orders, prep load, revenue, and live customer counts.
- **Reservation Feed**: Synchronized tab displaying incoming table bookings and special dietary requests.

### 3. 🔒 Role-Based Access Control (RBAC)
- **Role Security**: Kitchen Display System access is strictly restricted to authorized staff (`head_chef`, `chef`, `owner`, `admin`).
- **Dynamic UI Hiding**: KDS portal buttons automatically hide for VIP Members and public guests.

### 4. 🎴 VIP Member Sanctuary & Profile Dashboard
- **Japanese-Inspired Avatars**: Selectable avatar badges (*Kitsune Gold*, *Samurai Dark*, *Geisha Crimson*, *Ronin Charcoal*, *Dragon Emerald*).
- **Profile Management**: Personal details editor with automated profile audit logging (`profile_audit_logs`).
- **Order History & Favorites**: Member order tracking and saved omakase favorites.

### 5. 📧 Dual-Flow Gmail SMTP 6-Digit OTP Engine
- **Account Registration OTP**: Verified email registration flow with 5-minute expiration and cooldown timers.
- **Passcode Reset OTP**: Password recovery via secure 6-digit email OTP dispatch.

### 6. 🐬 MySQL Workbench & JSON Dual-Database Layer
- **Hybrid Storage**: Primary storage powered by MySQL Workbench with seamless fallback to `data.json`.
- **Auto Schema Initialization**: Automatic table creation (`users`, `reservations`, `orders`, `profile_audit_logs`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS3 (Custom Dark Zen Design System), Vanilla JS (ES6+) |
| **3D Motion Graphics** | Three.js (WebGL Canvas) |
| **Backend Server** | Node.js, Express.js |
| **Database** | MySQL Workbench (`mysql2`) & JSON File Fallback |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Nodemailer (Gmail SMTP) |

---

## 🔑 Demo Access Credentials

| Role | Username / ID | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 👨‍🍳 **Master Chef** | `chef` | `chef@kintsugi.com` | `password` | KDS Full Operational Access |
| 👑 **VIP Guest** | `vip_guest` | `guest@kintsugi.com` | `omakase2026` | Member Portal & Booking Access |

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Optional: [MySQL Workbench](https://www.mysql.com/products/workbench/) (v8.0+)

### 1. Clone the Repository
```bash
git clone https://github.com/Gopinadh034/kintsugi-digital-dining-platform.git
cd kintsugi-digital-dining-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (`.env`)
Create a `.env` file in the project root:
```env
PORT=5000
JWT_SECRET=kintsugi_master_secret_key_2026
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kintsugi_db
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 4. Start the Application
```bash
npm start
```
Open `http://localhost:5000` in your web browser.

---

## 📡 API Endpoint Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/auth/register` | `POST` | Initiate user registration and send email OTP |
| `/api/auth/verify-registration-otp` | `POST` | Verify registration OTP & create user account |
| `/api/auth/login` | `POST` | Authenticate user and issue JWT token |
| `/api/orders` | `GET` / `POST` | Fetch all orders or place a new culinary order |
| `/api/orders/:id/status` | `PUT` | Update order status (*Preparing*, *Cooking*, *Ready*, *Served*) |
| `/api/reservations` | `GET` / `POST` | Retrieve reservations or create private table booking |
| `/api/profile` | `GET` / `PUT` | Retrieve or update VIP member profile |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with 🎋 for <strong>KINTSUGI Haute Gastronomy Platform</strong></p>
