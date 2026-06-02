// File: migrate.js
const db = require('./config/db');

const buatTabel = `
CREATE TABLE IF NOT EXISTS materi_tugas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kelas_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    file_dokumen VARCHAR(255) NOT NULL,
    tipe VARCHAR(50) NOT NULL
);
`;

db.query(buatTabel, (err, result) => {
    if (err) {
        console.error('❌ Gagal membuat tabel di AWS RDS:', err);
    } else {
        console.log('✅ BUM! Tabel materi_tugas sukses dibangun di AWS RDS!');
    }
    process.exit(); // Matikan script setelah selesai
});