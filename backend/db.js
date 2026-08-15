/**
 * db.js - MySQL Workbench & JSON File Hybrid Database Layer for KINTSUGI
 * Includes User Profile Management & Audit Change Tracking
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// MySQL Pool Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '20017',
    database: process.env.DB_NAME || 'kintsugi_db'
};

let pool = null;
let isMySQLConnected = false;

/**
 * Initialize MySQL Workbench Database and Create Tables
 */
async function initMySQL() {
    try {
        // 1. Connect without database to ensure database exists
        const rootConn = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await rootConn.end();

        // 2. Create Connection Pool to kintsugi_db
        pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // 3. Create Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                email VARCHAR(150) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'vip_member',
                profile_image VARCHAR(255) DEFAULT NULL,
                avatar_type VARCHAR(50) DEFAULT 'default',
                avatar_id VARCHAR(100) DEFAULT 'kitsune_gold',
                phone VARCHAR(50) DEFAULT '',
                date_of_birth VARCHAR(50) DEFAULT '',
                gender VARCHAR(20) DEFAULT '',
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        // Safely add any missing columns if table already existed from earlier schema
        const alterColumns = [
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255) DEFAULT NULL;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_type VARCHAR(50) DEFAULT 'default';`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_id VARCHAR(100) DEFAULT 'kitsune_gold';`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(50) DEFAULT '';`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT '';`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`
        ];
        for (const sql of alterColumns) {
            try { await pool.query(sql); } catch(e) {}
        }

        // 4. Create Profile Audit Logs Table (To maintain user record changes)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profile_audit_logs (
                id VARCHAR(100) PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                change_type VARCHAR(50) NOT NULL,
                changes_json JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 5. Create Reservations Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id VARCHAR(100) PRIMARY KEY,
                guest_name VARCHAR(100) NOT NULL,
                guest_email VARCHAR(150) NOT NULL,
                guest_phone VARCHAR(50),
                party_size INT DEFAULT 2,
                date VARCHAR(50),
                time VARCHAR(50),
                seating_area VARCHAR(100),
                special_requests TEXT,
                status VARCHAR(50) DEFAULT 'Confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 6. Create Orders Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(100) PRIMARY KEY,
                customer_name VARCHAR(100),
                items JSON,
                total_amount DECIMAL(10,2),
                delivery_address VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Preparing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        isMySQLConnected = true;
        console.log(`====================================================`);
        console.log(`🐬 Connected to MySQL Workbench DB: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
        console.log(`====================================================`);

        await seedFromJSON();

    } catch (err) {
        isMySQLConnected = false;
        console.warn(`⚠️ MySQL Workbench Connection Note (${err.message}). Falling back to JSON database file.`);
    }
}

/**
 * Seed MySQL tables from data.json if empty
 */
async function seedFromJSON() {
    if (!isMySQLConnected || !pool) return;
    try {
        const jsonData = readJSONDB();
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        if (users[0].count === 0 && jsonData.users && jsonData.users.length) {
            for (const u of jsonData.users) {
                await pool.query(
                    'INSERT IGNORE INTO users (id, username, email, password_hash, role, profile_image, avatar_type, avatar_id, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        u.id || ('user-' + Date.now()),
                        u.username,
                        u.email,
                        u.passwordHash || '$2a$10$demo',
                        u.role || 'vip_member',
                        u.profile_image || u.profileImage || null,
                        u.avatar_type || u.avatarType || 'default',
                        u.avatar_id || u.avatarId || 'kitsune_gold',
                        u.phone || '',
                        u.date_of_birth || u.dateOfBirth || '',
                        u.gender || '',
                        u.address || ''
                    ]
                );
            }
            console.log(`🌱 Seeded ${jsonData.users.length} users into MySQL database.`);
        }
    } catch (err) {
        console.error('MySQL seeding error:', err.message);
    }
}

// -------------------------------------------------------------
// JSON FILE FALLBACK HELPERS
// -------------------------------------------------------------
function readJSONDB() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const initial = { users: [], reservations: [], orders: [], profile_audit_logs: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(content);
        if (!parsed.profile_audit_logs) parsed.profile_audit_logs = [];
        return parsed;
    } catch (err) {
        console.error('Error reading JSON DB:', err);
        return { users: [], reservations: [], orders: [], profile_audit_logs: [] };
    }
}

function writeJSONDB(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error writing JSON DB:', err);
        return false;
    }
}

function readDB() { return readJSONDB(); }
function writeDB(data) { return writeJSONDB(data); }

// -------------------------------------------------------------
// USER OPERATORS
// -------------------------------------------------------------

async function getUsers() {
    if (isMySQLConnected && pool) {
        try {
            const [rows] = await pool.query(`
                SELECT id, username, email, password_hash as passwordHash, role,
                       profile_image as profile_image, avatar_type as avatar_type,
                       avatar_id as avatar_id, phone, date_of_birth as date_of_birth,
                       gender, address, created_at as createdAt, updated_at as updatedAt
                FROM users
            `);
            return rows;
        } catch (e) {
            console.error('MySQL getUsers error, fallback to JSON:', e.message);
        }
    }
    return readJSONDB().users;
}

async function findUserById(id) {
    if (isMySQLConnected && pool) {
        try {
            const [rows] = await pool.query(`
                SELECT id, username, email, password_hash as passwordHash, role,
                       profile_image as profile_image, avatar_type as avatar_type,
                       avatar_id as avatar_id, phone, date_of_birth as date_of_birth,
                       gender, address, created_at as createdAt, updated_at as updatedAt
                FROM users WHERE id = ?
            `, [id]);
            if (rows.length) return rows[0];
        } catch (e) {
            console.error('MySQL findUserById error:', e.message);
        }
    }
    const json = readJSONDB();
    return json.users.find(u => u.id === id);
}

async function findUserByUsernameOrEmail(identifier) {
    const term = (identifier || '').toLowerCase();
    if (isMySQLConnected && pool) {
        try {
            const [rows] = await pool.query(`
                SELECT id, username, email, password_hash as passwordHash, role,
                       profile_image as profile_image, avatar_type as avatar_type,
                       avatar_id as avatar_id, phone, date_of_birth as date_of_birth,
                       gender, address, created_at as createdAt, updated_at as updatedAt
                FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?
            `, [term, term]);
            if (rows.length) return rows[0];
        } catch (e) {
            console.error('MySQL findUser error, fallback to JSON:', e.message);
        }
    }
    const json = readJSONDB();
    return json.users.find(u => u.username.toLowerCase() === term || u.email.toLowerCase() === term);
}

async function createUser(user) {
    const defaultAvatarId = user.avatar_id || 'kitsune_gold';
    const newUserObj = {
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role || 'vip_member',
        profile_image: user.profile_image || null,
        avatar_type: user.avatar_type || 'default',
        avatar_id: defaultAvatarId,
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        address: user.address || '',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // 1. Sync to JSON
    const json = readJSONDB();
    if (!json.users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        json.users.push(newUserObj);
        writeJSONDB(json);
    }

    // 2. Insert into MySQL
    if (isMySQLConnected && pool) {
        try {
            await pool.query(
                `INSERT INTO users (id, username, email, password_hash, role, profile_image, avatar_type, avatar_id, phone, date_of_birth, gender, address)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newUserObj.id,
                    newUserObj.username,
                    newUserObj.email,
                    newUserObj.passwordHash,
                    newUserObj.role,
                    newUserObj.profile_image,
                    newUserObj.avatar_type,
                    newUserObj.avatar_id,
                    newUserObj.phone,
                    newUserObj.date_of_birth,
                    newUserObj.gender,
                    newUserObj.address
                ]
            );
            console.log(`🐬 Inserted user [${user.username}] into MySQL Workbench.`);
        } catch (e) {
            console.error('MySQL createUser error:', e.message);
        }
    }
    return newUserObj;
}

async function updateUserProfile(userId, updateData) {
    const { username, phone, date_of_birth, gender, address } = updateData;

    // 1. Sync JSON
    const json = readJSONDB();
    const user = json.users.find(u => u.id === userId);
    if (user) {
        if (username) user.username = username;
        if (phone !== undefined) user.phone = phone;
        if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
        if (gender !== undefined) user.gender = gender;
        if (address !== undefined) user.address = address;
        user.updatedAt = new Date().toISOString();
        writeJSONDB(json);
    }

    // 2. Sync MySQL
    if (isMySQLConnected && pool) {
        try {
            await pool.query(
                `UPDATE users SET username = ?, phone = ?, date_of_birth = ?, gender = ?, address = ?, updated_at = NOW() WHERE id = ?`,
                [username || (user && user.username), phone || '', date_of_birth || '', gender || '', address || '', userId]
            );
        } catch (e) {
            console.error('MySQL updateUserProfile error:', e.message);
        }
    }

    await logProfileAudit(userId, 'profile_update', { username, phone, date_of_birth, gender, address });
    return await findUserById(userId);
}

async function updateUserAvatar(userId, { avatar_type, avatar_id, profile_image }) {
    // 1. Sync JSON
    const json = readJSONDB();
    const user = json.users.find(u => u.id === userId);
    if (user) {
        user.avatar_type = avatar_type;
        user.avatar_id = avatar_id;
        user.profile_image = profile_image;
        user.updatedAt = new Date().toISOString();
        writeJSONDB(json);
    }

    // 2. Sync MySQL
    if (isMySQLConnected && pool) {
        try {
            await pool.query(
                `UPDATE users SET avatar_type = ?, avatar_id = ?, profile_image = ?, updated_at = NOW() WHERE id = ?`,
                [avatar_type, avatar_id, profile_image, userId]
            );
        } catch (e) {
            console.error('MySQL updateUserAvatar error:', e.message);
        }
    }

    await logProfileAudit(userId, 'avatar_update', { avatar_type, avatar_id, profile_image });
    return await findUserById(userId);
}

async function updateUserPassword(email, newPasswordHash) {
    const term = (email || '').toLowerCase();
    
    const json = readJSONDB();
    const u = json.users.find(x => x.email.toLowerCase() === term);
    if (u) {
        u.passwordHash = newPasswordHash;
        u.updatedAt = new Date().toISOString();
        writeJSONDB(json);
        await logProfileAudit(u.id, 'password_change', { note: 'Password updated via reset/profile' });
    }

    if (isMySQLConnected && pool) {
        try {
            await pool.query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE LOWER(email) = ?', [newPasswordHash, term]);
            console.log(`🐬 Updated password in MySQL Workbench for: ${email}`);
        } catch (e) {
            console.error('MySQL updateUserPassword error:', e.message);
        }
    }
    return true;
}

// -------------------------------------------------------------
// PROFILE AUDIT LOG OPERATORS (MAINTAINS USER AUDIT RECORD IN DB)
// -------------------------------------------------------------
async function logProfileAudit(userId, changeType, changesObj) {
    const logId = 'log-' + Date.now() + '-' + Math.floor(Math.random()*1000);
    const logEntry = {
        id: logId,
        user_id: userId,
        change_type: changeType,
        changes_json: JSON.stringify(changesObj),
        created_at: new Date().toISOString()
    };

    // Sync JSON
    const json = readJSONDB();
    if (!json.profile_audit_logs) json.profile_audit_logs = [];
    json.profile_audit_logs.push(logEntry);
    writeJSONDB(json);

    // Sync MySQL
    if (isMySQLConnected && pool) {
        try {
            await pool.query(
                `INSERT INTO profile_audit_logs (id, user_id, change_type, changes_json) VALUES (?, ?, ?, ?)`,
                [logId, userId, changeType, JSON.stringify(changesObj)]
            );
        } catch (e) {
            console.error('MySQL logProfileAudit error:', e.message);
        }
    }
}

// -------------------------------------------------------------
// RESERVATION & ORDER OPERATORS
// -------------------------------------------------------------
async function createReservation(resData) {
    const json = readJSONDB();
    json.reservations.push(resData);
    writeJSONDB(json);

    if (isMySQLConnected && pool) {
        try {
            await pool.query(
                'INSERT INTO reservations (id, guest_name, guest_email, guest_phone, party_size, date, time, seating_area, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [resData.id, resData.guestName, resData.guestEmail, resData.guestPhone, resData.partySize, resData.date, resData.time, resData.seatingArea, resData.specialRequests, resData.status]
            );
        } catch (e) {
            console.error('MySQL createReservation error:', e.message);
        }
    }
    return resData;
}

async function getReservations() {
    if (isMySQLConnected && pool) {
        try {
            const [rows] = await pool.query('SELECT id, guest_name as guestName, guest_email as guestEmail, guest_phone as guestPhone, party_size as partySize, date, time, seating_area as seatingArea, special_requests as specialRequests, status, created_at as createdAt FROM reservations');
            return rows;
        } catch (e) {
            console.error('MySQL getReservations error:', e.message);
        }
    }
    return readJSONDB().reservations;
}

async function createOrder(orderData) {
    const json = readJSONDB();
    json.orders.push(orderData);
    writeJSONDB(json);

    if (isMySQLConnected && pool) {
        try {
            await pool.query(
                'INSERT INTO orders (id, customer_name, items, total_amount, delivery_address, status) VALUES (?, ?, ?, ?, ?, ?)',
                [orderData.id, orderData.customerName, JSON.stringify(orderData.items), orderData.totalAmount, orderData.deliveryAddress, orderData.status]
            );
        } catch (e) {
            console.error('MySQL createOrder error:', e.message);
        }
    }
    return orderData;
}

async function getOrders() {
    if (isMySQLConnected && pool) {
        try {
            const [rows] = await pool.query('SELECT id, customer_name as customerName, items, total_amount as totalAmount, delivery_address as deliveryAddress, status, created_at as createdAt FROM orders');
            return rows;
        } catch (e) {
            console.error('MySQL getOrders error:', e.message);
        }
    }
    return readJSONDB().orders;
}

async function updateOrderStatus(orderId, newStatus) {
    // 1. Sync JSON
    const json = readJSONDB();
    const order = json.orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        writeJSONDB(json);
    }

    // 2. Sync MySQL
    if (isMySQLConnected && pool) {
        try {
            await pool.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
        } catch (e) {
            console.error('MySQL updateOrderStatus error:', e.message);
        }
    }
    return order || { id: orderId, status: newStatus };
}

async function updateReservationStatus(resId, newStatus) {
    // 1. Sync JSON
    const json = readJSONDB();
    const res = json.reservations.find(r => r.id === resId);
    if (res) {
        res.status = newStatus;
        res.updatedAt = new Date().toISOString();
        writeJSONDB(json);
    }

    // 2. Sync MySQL
    if (isMySQLConnected && pool) {
        try {
            await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [newStatus, resId]);
        } catch (e) {
            console.error('MySQL updateReservationStatus error:', e.message);
        }
    }
    return res || { id: resId, status: newStatus };
}

// Trigger MySQL Initialization
initMySQL();

module.exports = {
    readDB,
    writeDB,
    getUsers,
    findUserById,
    findUserByUsernameOrEmail,
    createUser,
    updateUserProfile,
    updateUserAvatar,
    updateUserPassword,
    logProfileAudit,
    createReservation,
    getReservations,
    updateReservationStatus,
    createOrder,
    getOrders,
    updateOrderStatus
};
