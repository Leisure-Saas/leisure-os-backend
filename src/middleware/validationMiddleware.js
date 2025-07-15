// src/middleware/validationMiddleware.js
import { body, validationResult } from 'express-validator';

// Aturan validasi untuk membuat properti baru
export const propertyValidationRules = () => {
  return [
    // nama tidak boleh kosong
    body('name').notEmpty().withMessage('Nama properti tidak boleh kosong'),
    // tipe tidak boleh kosong
    body('type').notEmpty().withMessage('Tipe properti tidak boleh kosong'),
    // lokasi tidak boleh kosong
    body('location').notEmpty().withMessage('Lokasi tidak boleh kosong'),
    // bedrooms harus angka
    body('bedrooms').isNumeric().withMessage('Jumlah kamar tidur harus berupa angka'),
    // bathrooms harus angka
    body('bathrooms').isNumeric().withMessage('Jumlah kamar mandi harus berupa angka'),
    // maxGuests harus angka
    body('maxGuests').isNumeric().withMessage('Jumlah tamu maksimal harus berupa angka'),
    // basePricePerNight harus angka
    body('basePricePerNight').isNumeric().withMessage('Harga per malam harus berupa angka'),
  ];
};

// Middleware untuk memeriksa hasil validasi
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Jika tidak ada error, lanjutkan
  }

  // Jika ada error, kumpulkan pesan errornya
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  // Kirim respons 422 Unprocessable Entity dengan detail error
  return res.status(422).json({
    errors: extractedErrors,
  });
};
