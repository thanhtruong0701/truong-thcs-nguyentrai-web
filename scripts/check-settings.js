const { Pool } = require('pg')

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const res = await pool.query("SELECT key, value FROM settings WHERE key IN ('primaryColor', 'headerGradient', 'schoolName')")
  console.log('Settings:', res.rows)
  await pool.end()
}
check().catch(console.error)
