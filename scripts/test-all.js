#!/usr/bin/env node
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let pass = 0, fail = 0, warn = 0;

function ok(msg) { console.log('  [PASS] ' + msg); pass++; }
function fail_(msg) { console.log('  [FAIL] ' + msg); fail++; }
function warn_(msg) { console.log('  [WARN] ' + msg); warn++; }

async function testDatabase() {
  console.log('\n=== PHASE 1: DATABASE ===');

  // Connection
  try {
    await pool.query('SELECT 1');
    ok('Database connection');
  } catch(e) { fail_('Database connection: ' + e.message); return; }

  // Tables
  const tables = ['user','session','account','verification','announcements','courses','lessons','materials','teacher_permissions','menu_items','settings','file_uploads','quizzes','quiz_questions','quiz_attempts','pages'];
  for (const t of tables) {
    try {
      const res = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)", [t]);
      if (res.rows[0].exists) ok('Table: ' + t);
      else warn_('Table MISSING: ' + t);
    } catch(e) { fail_('Table: ' + t + ': ' + e.message); }
  }

  // Record counts
  console.log('\n--- Record counts ---');
  for (const t of ['user','announcements','menu_items','settings','file_uploads','pages','courses','quizzes']) {
    try {
      const res = await pool.query('SELECT COUNT(*) FROM ' + t);
      console.log('  ' + t + ': ' + res.rows[0].count + ' records');
    } catch(e) { console.log('  ' + t + ': ERROR'); }
  }

  // Admin user
  try {
    const res = await pool.query("SELECT id, email, role FROM \"user\" WHERE role = 'admin' LIMIT 1");
    if (res.rows.length > 0) ok('Admin user exists: ' + res.rows[0].email);
    else warn_('No admin user found');
  } catch(e) { fail_('Admin user check: ' + e.message); }

  // File uploads detail
  try {
    const res = await pool.query('SELECT title, category, is_published, file_url IS NOT NULL as has_url FROM file_uploads');
    for (const r of res.rows) {
      if (r.is_published && r.has_url) ok('File "' + r.title + '" (cat=' + r.category + ', published, has URL)');
      else warn_('File "' + r.title + '" pub=' + r.is_published + ' hasUrl=' + r.has_url);
    }
    if (res.rows.length === 0) warn_('No files uploaded yet');
  } catch(e) { fail_('File uploads check: ' + e.message); }

  // Settings
  try {
    const res = await pool.query('SELECT key, value FROM settings');
    for (const r of res.rows) {
      if (r.value) ok('Setting "' + r.key + '" = ' + r.value.substring(0, 50));
      else warn_('Setting "' + r.key + '" is empty');
    }
    if (res.rows.length === 0) warn_('No settings configured - go to admin > Cai dat');
  } catch(e) { fail_('Settings check: ' + e.message); }
}

async function testSupabase() {
  console.log('\n=== PHASE 2: SUPABASE STORAGE ===');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const res = await fetch(url + '/storage/v1/bucket', {
      headers: { 'Authorization': 'Bearer ' + key, 'apikey': key }
    });
    const buckets = await res.json();
    const materials = buckets.find(b => b.name === 'materials');
    if (materials) {
      ok('Bucket "materials" exists (public=' + materials.public + ', sizeLimit=' + materials.file_size_limit + ')');
    } else {
      warn_('Bucket "materials" not found - run: node scripts/create-bucket.js');
    }
  } catch(e) { fail_('Supabase connection: ' + e.message); }

  // Test file accessibility
  try {
    const res = await pool.query('SELECT file_url FROM file_uploads WHERE file_url IS NOT NULL LIMIT 1');
    if (res.rows.length > 0) {
      const fileUrl = res.rows[0].file_url;
      const headRes = await fetch(fileUrl, { method: 'HEAD' });
      if (headRes.ok) ok('File URL accessible (HTTP ' + headRes.status + ')');
      else warn_('File URL returned HTTP ' + headRes.status + ' - check Supabase bucket permissions');
    }
  } catch(e) { fail_('File URL check: ' + e.message); }
}

async function testWebEndpoints() {
  console.log('\n=== PHASE 3: WEB FRONTEND (localhost:3000) ===');

  const endpoints = [
    { path: '/', name: 'Homepage' },
    { path: '/tai-nguyen', name: 'Tai nguyen (files)' },
    { path: '/courses', name: 'Courses' },
    { path: '/contact', name: 'Contact' },
    { path: '/about', name: 'About' },
    { path: '/quizzes', name: 'Quizzes' },
    { path: '/search?q=test', name: 'Search' },
    { path: '/de-thi', name: 'De thi (slug page)' },
    { path: '/tu-lieu', name: 'Tu lieu (slug page)' },
    { path: '/giao-an', name: 'Giao an (slug page)' },
    { path: '/sang-kien', name: 'Sang kien (slug page)' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:3000' + ep.path);
      if (res.ok) ok(ep.name + ' (' + ep.path + ') -> HTTP ' + res.status);
      else warn_(ep.name + ' (' + ep.path + ') -> HTTP ' + res.status);
    } catch(e) { fail_(ep.name + ' (' + ep.path + '): ' + e.message); }
  }
}

async function testAdminEndpoints() {
  console.log('\n=== PHASE 4: ADMIN PANEL (localhost:3001) ===');

  const endpoints = [
    { path: '/sign-in', name: 'Login page' },
    { path: '/admin', name: 'Admin dashboard' },
    { path: '/admin/settings', name: 'Settings page' },
    { path: '/admin/files', name: 'Files page' },
    { path: '/admin/announcements', name: 'Announcements page' },
    { path: '/admin/menus', name: 'Menus page' },
    { path: '/admin/pages', name: 'Pages page' },
    { path: '/admin/courses', name: 'Courses page' },
    { path: '/admin/quizzes', name: 'Quizzes page' },
    { path: '/admin/users', name: 'Users page' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:3001' + ep.path, { redirect: 'manual' });
      const status = res.status;
      if (status === 200 || status === 302 || status === 307) ok(ep.name + ' (' + ep.path + ') -> HTTP ' + status);
      else warn_(ep.name + ' (' + ep.path + ') -> HTTP ' + status);
    } catch(e) { fail_(ep.name + ' (' + ep.path + '): ' + e.message); }
  }
}

async function testServerActions() {
  console.log('\n=== PHASE 5: SERVER ACTIONS (API) ===');

  // Test user-role API
  try {
    const res = await fetch('http://localhost:3001/api/user-role');
    const data = await res.json();
    ok('User role API returns: ' + JSON.stringify(data));
  } catch(e) { fail_('User role API: ' + e.message); }

  // Test session API
  try {
    const res = await fetch('http://localhost:3001/api/session');
    ok('Session API -> HTTP ' + res.status);
  } catch(e) { fail_('Session API: ' + e.message); }
}

async function testFileUploadFlow() {
  console.log('\n=== PHASE 6: FILE UPLOAD FLOW ===');

  // Check if files have proper URLs
  try {
    const res = await pool.query('SELECT title, file_url, file_name, file_type, file_size FROM file_uploads');
    for (const f of res.rows) {
      const hasUrl = f.file_url && f.file_url.startsWith('http');
      const hasName = f.file_name && f.file_name.length > 0;
      const hasType = f.file_type && f.file_type.length > 0;
      const hasSize = f.file_size && f.file_size > 0;
      
      if (hasUrl && hasName && hasType && hasSize) {
        ok('File "' + f.title + '": url=' + (hasUrl ? 'yes' : 'NO') + ', name=' + f.file_name + ', type=' + f.file_type + ', size=' + f.file_size);
      } else {
        warn_('File "' + f.title + '": url=' + (hasUrl ? 'yes' : 'NO') + ', name=' + (hasName ? 'yes' : 'NO') + ', type=' + (hasType ? 'yes' : 'NO') + ', size=' + (hasSize ? 'yes' : 'NO'));
      }
    }
  } catch(e) { fail_('File data check: ' + e.message); }

  // Check category mapping
  try {
    const res = await pool.query('SELECT DISTINCT category FROM file_uploads');
    console.log('  Categories in use: ' + res.rows.map(r => r.category || 'null').join(', '));
  } catch(e) {}
}

async function main() {
  console.log('========================================');
  console.log('   TEST TOAN BO WEB - TRUONG THCS NT');
  console.log('========================================');
  console.log('Database: ' + (process.env.DATABASE_URL || '').split('@')[1]?.split(':')[0] || 'N/A');
  console.log('Supabase: ' + (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace('https://', ''));

  await testDatabase();
  await testSupabase();
  await testWebEndpoints();
  await testAdminEndpoints();
  await testServerActions();
  await testFileUploadFlow();

  console.log('\n========================================');
  console.log('   KET QUA: ' + pass + ' PASS, ' + fail + ' FAIL, ' + warn + ' WARN');
  console.log('========================================');
  
  if (fail > 0) {
    console.log('\nCAC LOI CAN FIX:');
    console.log('1. FAIL database -> chay: pnpm db:push');
    console.log('2. FAIL bucket -> chay: node scripts/create-bucket.js');
    console.log('3. FAIL admin user -> chay: node scripts/seed-admin.js');
    console.log('4. FAIL web/admin endpoints -> restart server: pnpm dev');
    console.log('5. WARN settings empty -> login admin, vao Cai dat, luu thong tin');
  }

  await pool.end();
}

main().catch(console.error);
