// File: controllers/materiController.js
const db = require('../config/db');

// Fungsi 1: Menampilkan halaman utama
const getAllMateri = (req, res) => {
    db.query('SELECT * FROM materi_tugas ORDER BY id DESC', (err, results) => {
        if (err) throw err;
        res.render('index', { data: results }); 
    });
};

// Fungsi 2: Menyimpan data teks ke MySQL & File S3
const uploadMateri = (req, res) => {
    const { judul, tipe } = req.body;
    
    // AWS S3 otomatis membuatkan URL publik untuk file yang baru diunggah!
    const fileUrlS3 = req.file.location; 
    const kelas_id = 1; // Hardcode Kelas ID = 1 untuk testing

    const sql = 'INSERT INTO materi_tugas (kelas_id, judul, file_dokumen, tipe) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [kelas_id, judul, fileUrlS3, tipe], (err, result) => {
        if (err) {
            console.error('Gagal menyimpan ke DB:', err);
            return res.send('Terjadi kesalahan sistem.');
        }
        console.log('✅ SUKSES! File terbang ke S3 & Data masuk ke MySQL!');
        res.redirect('/'); 
    });
};

module.exports = { getAllMateri, uploadMateri };