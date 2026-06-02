// File: routes/materiRoutes.js
const express = require('express');
const router = express.Router();

// Panggil konfigurasi S3 dan Controller
const uploadS3 = require('../config/s3');
const materiController = require('../controllers/materiController');

// Rute Halaman Utama
router.get('/', materiController.getAllMateri);

// Rute untuk menangani Form Upload
// uploadS3.single('file_dokumen') otomatis akan melempar file ke Bucket S3!
router.post('/upload', uploadS3.single('file_dokumen'), materiController.uploadMateri);

module.exports = router;