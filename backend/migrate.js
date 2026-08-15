require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '20017',
            database: process.env.DB_NAME || 'kintsugi_db'
        });

        console.log('Migrating kintsugi_db database schema...');

        const columns = [
            `ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL;`,
            `ALTER TABLE users ADD COLUMN avatar_type VARCHAR(50) DEFAULT 'default';`,
            `ALTER TABLE users ADD COLUMN avatar_id VARCHAR(100) DEFAULT 'kitsune_gold';`,
            `ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT '';`,
            `ALTER TABLE users ADD COLUMN date_of_birth VARCHAR(50) DEFAULT '';`,
            `ALTER TABLE users ADD COLUMN gender VARCHAR(20) DEFAULT '';`,
            `ALTER TABLE users ADD COLUMN address TEXT;`
        ];

        for (const sql of columns) {
            try {
                await conn.query(sql);
                console.log('Executed:', sql);
            } catch (e) {
                // Column already exists, ignore
            }
        }

        await conn.query(`
            CREATE TABLE IF NOT EXISTS profile_audit_logs (
                id VARCHAR(100) PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                change_type VARCHAR(50) NOT NULL,
                changes_json JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created profile_audit_logs table.');

        await conn.end();
        console.log('✅ Migration complete!');
    } catch(err) {
        console.error('Migration error:', err.message);
    }
}

migrate();
