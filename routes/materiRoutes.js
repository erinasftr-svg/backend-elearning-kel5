const express = require('express');
const router = express.Router();
// Memanggil pengaturan S3 dan Database
const uploadS3 = require('../config/s3'); 
const db = require('../config/db'); 

// ==========================================
// [READ] 1. Menampilkan Portal Dosen (Halaman Utama)
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
// [READ] 2. Menampilkan Portal Mahasiswa
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
// [CREATE] 3. Upload Materi/Tugas (Khusus Dosen)
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
// [CREATE] 4. Kumpul Tugas (Khusus Mahasiswa)
// ==========================================
router.post('/upload-mahasiswa', uploadS3.single('file'), (req, res) => {
    const { judul } = req.body;
    const tipe = 'kumpul_tugas'; // Tipe di-set otomatis
    const file_url = req.file.location; 

    const query = 'INSERT INTO materi_tugas (judul, tipe, file_dokumen) VALUES (?, ?, ?)';
    db.query(query, [judul, tipe, file_url], (err, results) => {
        if (err) {
            console.error("Gagal menyimpan ke RDS:", err);
            return res.status(500).send("Gagal menyimpan ke database");
        }
        res.redirect('/mahasiswa?status=success'); // Kembali ke halaman mahasiswa
    });
});

// ==========================================
// [UPDATE] 5. Mengedit Materi (Khusus Dosen)
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
// [DELETE] 6. Menghapus Materi (Khusus Dosen)
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