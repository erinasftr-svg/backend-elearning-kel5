const express = require('express');
const router = express.Router();
// Memanggil pengaturan S3 dan Database
const uploadS3 = require('../config/s3'); 
const db = require('../config/db'); 

// ==========================================
// 1. READ: Menampilkan Portal Dosen (Halaman Utama)
// ==========================================
router.get('/', (req, res) => {
    const query = 'SELECT * FROM materi_tugas ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Gagal mengambil data dari RDS:", err);
            return res.status(500).send("Error Database RDS");
        }
        res.render('index', { materi: results });
    });
});

// ==========================================
// 2. READ: Menampilkan Portal Mahasiswa
// ==========================================
router.get('/mahasiswa', (req, res) => {
    const query = 'SELECT * FROM materi_tugas ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Gagal mengambil data dari RDS:", err);
            return res.status(500).send("Error Database RDS");
        }
        res.render('mahasiswa', { materi: results });
    });
});

// ==========================================
// 3. CREATE: Upload File ke S3 & Simpan ke DB
// ==========================================
router.post('/upload', uploadS3.single('file'), (req, res) => {
    const { judul, tipe } = req.body;
    const file_url = req.file.location; 

    const query = 'INSERT INTO materi_tugas (judul, tipe, file_dokumen) VALUES (?, ?, ?)';
    db.query(query, [judul, tipe, file_url], (err, results) => {
        if (err) {
            console.error("Gagal menyimpan ke RDS:", err);
            return res.status(500).send("Gagal menyimpan ke database");
        }
        res.redirect('/?status=success');
    });
});

// ==========================================
// 4. UPDATE: Mengedit Judul & Tipe Materi
// ==========================================
router.post('/edit/:id', (req, res) => {
    const idMateri = req.params.id;
    const { judul, tipe } = req.body;
    
    const query = 'UPDATE materi_tugas SET judul = ?, tipe = ? WHERE id = ?';
    db.query(query, [judul, tipe, idMateri], (err, results) => {
        if (err) {
            console.error("Gagal mengedit data:", err);
            return res.status(500).send("Gagal mengedit data");
        }
        res.redirect('/?status=updated');
    });
});

// ==========================================
// 5. DELETE: Menghapus Materi dari Database
// ==========================================
router.get('/delete/:id', (req, res) => {
    const idMateri = req.params.id;
    
    const query = 'DELETE FROM materi_tugas WHERE id = ?';
    db.query(query, [idMateri], (err, results) => {
        if (err) {
            console.error("Gagal menghapus data:", err);
            return res.status(500).send("Gagal menghapus data");
        }
        res.redirect('/?status=deleted');
    });
});

module.exports = router;