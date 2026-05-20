/**
 * SERVER CHÍNH
 * Chạy: npm start
 * Cài:  npm install
 *
 * Để thêm cổng mới: chỉ cần tạo file mới trong portals/ theo _TEMPLATE.js
 */

const express = require('express');
const cors    = require('cors');
const registry = require('./registry');

const app = express();
app.use(cors());
app.use(express.json());

// ─── GET /api/portals ────────────────────────────
// Trả về danh sách cổng cho app hiển thị dropdown chọn trường
app.get('/api/portals', (req, res) => {
  res.json({ portals: registry.list() });
});

// ─── POST /api/login ─────────────────────────────
// Body: { portalId, maSV, matKhau }
app.post('/api/login', async (req, res) => {
  const { portalId, maSV, matKhau } = req.body;

  if (!portalId || !maSV || !matKhau) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin: portalId, maSV, matKhau',
    });
  }

  try {
    const result = await registry.authenticate(portalId, maSV.trim(), matKhau);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

// ─── GET /api/health ─────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', portals: registry.list().map(p => p.id) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`📋 Portals: ${registry.list().map(p => p.shortName).join(', ')}`);
  console.log(`\nAPI:`);
  console.log(`  GET  /api/portals       → danh sách cổng`);
  console.log(`  POST /api/login         → đăng nhập`);
  console.log(`  GET  /api/health        → kiểm tra\n`);
});
