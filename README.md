# E-Learning Platform - Kelompok 5
### Proyek Akhir Cloud Computing | Teknik Informatika | Universitas Palangka Raya

Platform E-Learning berbasis Cloud Computing yang dirancang dengan arsitektur *High Availability*, *Scalable*, dan *Secure* menggunakan Amazon Web Services (AWS) dan dikonfigurasi melalui *Infrastructure as Code* (IaC) menggunakan Terraform. Aplikasi ini mengimplementasikan portal dua sisi untuk Dosen (Manajemen Materi & Tugas) dan Mahasiswa (Unduh Materi & Pengumpulan Tugas) dengan integrasi otomatis ke penyimpanan objek cloud dan basis data terkelola.

## 🏗️ Arsitektur Sistem

Sistem ini dirancang menggunakan arsitektur *Multi-Layer* dan *Multi-Subnet* di AWS demi menjaga ketersediaan tinggi dan keamanan tingkat tinggi:
1. **Routing & Distribusi:** Trafik publik diterima oleh **Application Load Balancer (ALB)** yang mendistribusikan beban kerja secara merata ke klaster server aplikasi. Akses aset statis diakselerasi melalui **Amazon CloudFront (CDN)**.
2. **Compute Layer:** Aplikasi backend dibangun menggunakan **Node.js** yang dideploy di dalam **Amazon EC2 Instance** di dalam *Subnet* publik, serta dikelola menggunakan *Process Manager* **PM2** agar sistem tetap berjalan di latar belakang secara kontinu.
3. **Storage & Data Layer:** Berkas dokumen materi dan tugas disimpan secara aman di **Amazon S3 Bucket** dengan kebijakan privasi ketat (*Origin Access Control* via CloudFront). Data relasional platform disimpan di **Amazon RDS MySQL** yang ditempatkan di *Private Subnet* untuk mencegah akses langsung dari internet.
4. **Security & Monitoring:** Otentikasi pengguna menggunakan **Amazon Cognito**. Keamanan diinspeksi secara *real-time* oleh **AWS GuardDuty**, sementara performa infrastruktur dipantau secara terpusat lewat **Amazon CloudWatch Dashboard** dan sistem *alerting* otomatis via **Amazon SNS**.

*Diagram Arsitektur Sistem dapat dilihat pada file `docs/architecture.png`.*

## 🛠️ Stack Teknologi

- **Cloud Provider:** Amazon Web Services (AWS)
- **Infrastructure as Code (IaC):** Terraform v1.x
- **Backend Environment:** Node.js (Express.js), EJS (Embedded JavaScript Templates)
- **Process Manager:** PM2
- **Database:** Amazon RDS (MySQL 8.0)
- **Object Storage:** Amazon S3
- **Content Delivery Network (CDN):** Amazon CloudFront
- **Load Balancer:** Application Load Balancer (ALB)
- **Authentication:** Amazon Cognito
- **Observability:** Amazon CloudWatch & Amazon SNS
- **Security Audit:** AWS GuardDuty

## 📋 Prasyarat (Prerequisites)

Sebelum melakukan deployment, pastikan perangkat lokal atau lingkungan server Anda telah terpasang komponen berikut:
- Akun AWS dengan hak akses administratif (AWS CLI terkonfigurasi)
- Terraform (v1.x atau versi terbaru)
- Node.js (v18.x atau versi terbaru) & NPM
- Git Client

## 🚀 Panduan Setup & Deployment

### 1. Kloning Repository
```bash
git clone [https://github.com/username/backend-elearning-kel5.git](https://github.com/username/backend-elearning-kel5.git)
cd backend-elearning-kel5
