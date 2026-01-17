// Impor library yang dibutuhkan
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url'; 

// Inisialisasi Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Dapatkan path ke direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tentukan path ke folder build React
// (../ artinya "naik satu folder" dari 'backend' ke 'proyek-crud', lalu masuk ke 'frontend/build')
const reactBuildPath = path.join(__dirname, '../frontend/dist');


// --- KONEKSI DATABASE & SETUP TABLE ---
const dbFile = 'mobil_crud.db'; // Nama file DB baru
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Terhubung ke database SQLite (mobil_crud).');
    
    // Buat tabel 'mobil' jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS mobil (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      merek TEXT NOT NULL,
      model TEXT NOT NULL,
      tahun INTEGER,
      warna TEXT
    )`, (err) => {
      if (err) {
        console.error("Error membuat tabel:", err.message);
      } else {
        console.log("Tabel 'mobil' siap.");
      }
    });
  }
});

// --- API ENDPOINTS (CRUDS) ---

// Endpoint dasar untuk testing
/* <-- Tambah ini
app.get('/', (req, res) => {
  res.send('Selamat datang di API CRUDS Mobil!');
});
*/

// (R) READ & (S) SEARCH - Mendapatkan semua mobil ATAU mencari mobil
app.get('/api/mobil', (req, res) => {
  // Ambil query parameter 'q' untuk search
  const { q } = req.query; 
  
  let sql = "SELECT * FROM mobil";
  const params = [];

  // Jika ada query search 'q'
  if (q) {
    // Cari berdasarkan merek atau model
    sql += " WHERE merek LIKE ? OR model LIKE ?";
    params.push(`%${q}%`, `%${q}%`); // %...% artinya "mengandung"
  }

  sql += " ORDER BY id DESC"; // Urutkan

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: q ? `Menampilkan hasil pencarian untuk "${q}"` : "Berhasil mengambil data mobil",
      data: rows
    });
  });
});

// (C) CREATE - Menambahkan mobil baru
app.post('/api/mobil', (req, res) => {
  // Ambil data dari request body
  const { merek, model, tahun, warna } = req.body; 

  if (!merek || !model) {
    res.status(400).json({ error: "Merek dan Model tidak boleh kosong" });
    return;
  }

  const sql = `INSERT INTO mobil (merek, model, tahun, warna) VALUES (?, ?, ?, ?)`;
  const params = [merek, model, tahun, warna];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: "Mobil baru berhasil ditambahkan",
      data: {
        id: this.lastID,
        merek,
        model,
        tahun,
        warna
      }
    });
  });
});

// (U) UPDATE - Mengubah data mobil berdasarkan ID
app.put('/api/mobil/:id', (req, res) => {
  const { id } = req.params; // Ambil 'id' dari parameter URL
  const { merek, model, tahun, warna } = req.body; // Ambil data baru

  if (!merek || !model) {
    res.status(400).json({ error: "Merek dan Model tidak boleh kosong" });
    return;
  }

  const sql = `UPDATE mobil SET merek = ?, model = ?, tahun = ?, warna = ? WHERE id = ?`;
  const params = [merek, model, tahun, warna, id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Mobil tidak ditemukan" });
      return;
    }
    res.json({
      message: `Data mobil dengan ID ${id} berhasil diupdate`,
      changes: this.changes
    });
  });
});

// (D) DELETE - Menghapus mobil berdasarkan ID
app.delete('/api/mobil/:id', (req, res) => {
  const { id } = req.params; // Ambil 'id' dari parameter URL
  const sql = `DELETE FROM mobil WHERE id = ?`;

  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Mobil tidak ditemukan" });
      return;
    }
    res.json({
      message: `Mobil dengan ID ${id} berhasil dihapus`,
      changes: this.changes
    });
  });
});

// --- MENYAJIKAN FILE STATIS REACT ---
// Sajikan file statis (HTML, CSS, JS) dari folder build React
app.use(express.static(reactBuildPath));

// --- CATCH-ALL ROUTE (Versi Middleware) ---
// Ini akan menangani semua request yang tidak cocok
// dengan API atau file statis di atasnya.
app.use((req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// --- MENJALANKAN SERVER ---
app.listen(port, () => {
  console.log(`Server terpadu (Backend + React) berjalan di http://localhost:${port}`);
});