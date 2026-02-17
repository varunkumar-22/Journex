const path = require('path');
const mysql = require('mysql2/promise');

// Load .env from project root (works when run via npm from project root)
const envPath = path.resolve(process.cwd(), '.env');
const result = require('dotenv').config({ path: envPath });

if (result.error) {
  console.warn('Warning: Could not load .env file:', envPath);
  console.warn('Error:', result.error.message);
} else {
  console.log('Loaded .env from:', envPath);
}

const host = process.env.MYSQL_HOST || 'localhost';
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = process.env.MYSQL_DATABASE || 'my_journals';

// Debug: Show what we're using (hide password for security)
console.log('Connecting to MySQL:');
console.log('  Host:', host);
console.log('  User:', user);
console.log('  Password:', password ? '***set***' : '***empty***');
console.log('  Database:', database);

async function init() {
  let conn;
  try {
    conn = await mysql.createConnection({ host, user, password });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await conn.query(`USE \`${database}\``);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS journals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL DEFAULT 'Untitled',
        content LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Database and table ready.');
  } catch (err) {
    if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.message.includes('Access denied')) {
      console.error('MySQL access denied. Set your password in .env:');
      console.error('  MYSQL_PASSWORD=your_mysql_password');
      console.error('(Use the same password you use for the mysql command or MySQL Workbench.)');
    } else {
      console.error('Init failed:', err.message);
    }
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

init();
