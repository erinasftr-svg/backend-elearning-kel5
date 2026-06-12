const express = require('express');
const router = express.Router();

const uploadS3 = require('../config/s3');
const db = require('../config/db');

// ==========================================
// [READ] 1. Menampilkan Portal Dosen
// ==========================================
router.get('/', (req, res) => {
    db.query('SELECT * FROM materi_tugas ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send("Error Database RDS");
        res.render('index', { materi: results });
    });
});

// ==========================================
// [READ] 2. Menampilkan Portal Mahasiswa
// ==========================================
router.get('/mahasiswa', (req, res) => {
    db.query('SELECT * FROM materi_tugas ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send("Error Database RDS");
        res.render('mahasiswa', { materi: results });
    });
});

// ==========================================
// [CREATE] 3. Upload Materi/Tugas (Khusus Dosen)
// ==========================================
router.post('/upload', uploadS3.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send("Gagal: Belum memilih file!");
    
    const { judul } = req.body;
    const tipe = req.body.tipe || req.body.kategori || 'Materi Dosen';
    const file_url = req.file.location;

    db.query('INSERT INTO materi_tugas (judul, tipe, file_dokumen) VALUES (?, ?, ?)', [judul, tipe, file_url], (err) => {
        if (err) return res.status(500).send("Gagal menyimpan ke RDS");
        res.redirect('/?status=success');
    });
});

// ==========================================
// [CREATE] 4. Kumpul Tugas (Khusus Mahasiswa)
// ==========================================
router.post('/upload-mahasiswa', uploadS3.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send("Gagal: Belum memilih file!");
    
    const { judul } = req.body;
    const tipe = 'kumpul_tugas';
    const file_url = req.file.location;

    db.query('INSERT INTO materi_tugas (judul, tipe, file_dokumen) VALUES (?, ?, ?)', [judul, tipe, file_url], (err) => {
        if (err) return res.status(500).send("Gagal menyimpan ke RDS");
        res.redirect('/mahasiswa?status=success');
    });
});

// ==========================================
// [UPDATE] 5. Mengedit Materi (Khusus Dosen)
// ==========================================
router.post('/edit/:id', (req, res) => {
    const { judul } = req.body;
    const tipe = req.body.tipe || req.body.kategori || 'Materi Dosen';
    
    db.query('UPDATE materi_tugas SET judul = ?, tipe = ? WHERE id = ?', [judul, tipe, req.params.id], (err) => {
        if (err) return res.status(500).send("Gagal mengedit data");
        res.redirect('/?status=updated');
    });
});

// ==========================================
// [DELETE] 6. Menghapus Materi 
// ==========================================
// Menggunakan .all agar tombol POST atau GET dari HTML tetap jalan
router.all('/delete/:id', (req, res) => {
    db.query('DELETE FROM materi_tugas WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send("Gagal menghapus data");
        res.redirect('/?status=deleted');
    });
});

// ==========================================
// [DOWNLOAD] 7. Mengunduh Materi 
// ==========================================
// Menggunakan .all agar tombol HTML bentuk apapun tetap diterima Node.js
router.all('/download/:id', (req, res) => {
    db.query('SELECT file_dokumen FROM materi_tugas WHERE id = ?', [req.params.id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send("File tidak ditemukan di database!");
        }
        // Perintah ini yang akan memaksa browser mengunduh dari AWS S3
        res.redirect(results[0].file_dokumen);
    });
});

module.exports = router;
