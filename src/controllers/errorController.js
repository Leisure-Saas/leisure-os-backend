// src/controllers/errorController.js
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Hanya kirim error operasional yang kita percaya ke klien
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Error programming atau error tidak dikenal: jangan bocorkan detail
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server.',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Kita bisa membedakan respons error untuk development dan production
  // Untuk saat ini, kita akan gunakan mode development agar lebih informatif
  sendErrorDev(err, res);
};
