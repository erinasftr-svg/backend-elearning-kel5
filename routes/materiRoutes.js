const express = require('express');
const router = express.Router();
// Memanggil pengaturan S3 yang sudah kita buat sebelumnya
const uploadS3 = require('../config/s3'); 
// Memanggil pengaturan koneksi database RDS kalian
const db = require('../config/db'); 

// 1. Route untuk menampilkan halaman depan (Portal Dosen)
router.get('/', (req, res) => {
    // Mengambil semua data dari tabel materi_tugas di RDS
    const query = 'SELECT * FROM materi_tugas ORDER BY id DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Gagal mengambil data dari RDS:", err);
            return res.status(500).send("Error Database RDS");
        }
        // Mengirimkan data ke file index.ejs agar bisa ditampilkan di tabel
        res.render('index', { materi: results });
    });
});

// 2. Route untuk memproses form Upload (S3 + RDS)
// 'file' di dalam uploadS3.single() adalah 'name' dari input type="file" di HTML
router.post('/upload', uploadS3.single('file'), (req, res) => {
    // Menangkap data teks dari form (judul dan tipe materi)
    const { judul, tipe } = req.body;
    
    // Menangkap URL otomatis dari file yang sukses terlempar ke AWS S3
    const file_url = req.file.location; 

    // Menyimpan rekam jejak (URL S3, judul, tipe) ke dalam database AWS RDS
    // Catatan: Sesuaikan nama kolom (judul, tipe, file_url) jika di database kalian berbeda
    const query = 'INSERT INTO materi_tugas (judul, tipe, file_url) VALUES (?, ?, ?)';
    
    db.query(query, [judul, tipe, file_url], (err, results) => {
        if (err) {
            console.error("Gagal menyimpan ke RDS:", err);
            return res.status(500).send("Gagal menyimpan ke database");
        }
        
        // BUM! INI DIA KUNCINYA!
        // Kita alihkan kembali ke halaman utama dengan membawa sinyal '?status=success'
        // Sinyal ini akan dibaca oleh SweetAlert2 di index.ejs untuk memunculkan animasi!
        res.redirect('/?status=success');
    });
});

module.exports = router;