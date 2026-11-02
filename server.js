/**
 * JIYYAD TOOLS - AM BULK V5 (Secure Proxy)
 * API key / endpoint hanya ada di server, tidak pernah ke browser.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== KONFIGURASI (JANGAN BAGIKAN) ==========
const API_URL = 'https://api.zyvor.my.id/api/am/bulkv5';
// ==================================================

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/bulk', async (req, res) => {
  try {
    const { count } = req.body || {};

    if (!count || isNaN(count) || Number(count) < 1) {
      return res.status(400).json({
        status: false,
        message: 'Count harus angka minimal 1'
      });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: String(count) })
    });

    const data = await response.json();

    // Hapus attribution biar tidak muncul di frontend
    if (data.attribution) delete data.attribution;

    return res.status(response.status).json(data);
  } catch (err) {
    console.error('[AM Bulk Proxy Error]', err.message);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan pada server proxy',
      error: err.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ⚡ JIYYAD TOOLS — AM BULK V5`);
  console.log(`  ➜  Local:   http://localhost:${PORT}\n`);
});
