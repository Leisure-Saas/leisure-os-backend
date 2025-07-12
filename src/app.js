import express from 'express';

// Inisialisasi aplikasi Express
const app = express();

// 1. WAJIB: Gunakan variabel PORT dari environment, dengan fallback ke 3000
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON (jika Anda butuh API)
app.use(express.json());

// Endpoint dasar untuk memastikan server merespons
app.get('/', (req, res) => {
  res.send('Server is alive and running!');
});

// 2. WAJIB: Endpoint khusus untuk Health Check Railway
// Railway akan mengakses path ini untuk memastikan aplikasi sehat.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 3. WAJIB: Dengarkan di PORT yang benar dan bind ke '0.0.0.0'
// '0.0.0.0' memastikan server dapat diakses dari luar kontainernya.
app.listen(PORT, '0.0.0.0', () => {
  // Log ini akan menampilkan port dinamis yang diberikan oleh Railway
  console.log(`Server successfully started and is listening on port ${PORT}`);
});
