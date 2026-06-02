// File: server.js
const express = require('express');
const app = express();
const port = 80; // Pakai port 80 agar langsung bisa diakses lewat Load Balancer AWS

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Memanggil jalur URL dari folder routes (akan kita buat selanjutnya)
const materiRoutes = require('./routes/materiRoutes');
app.use('/', materiRoutes);

app.listen(port, () => {
    console.log(`🚀 App Server berjalan di port ${port}`);
});