import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Fungsi untuk Registrasi User Baru
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Cek apakah input valid
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password diperlukan." });
    }

    // 2. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Buat user baru di database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      // Pilih field yang ingin dikembalikan (jangan kembalikan password)
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    // Tangani error jika email sudah terdaftar (kode P2002 dari Prisma)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Email sudah terdaftar." });
    }
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Gagal melakukan registrasi." });
  }
};

// Fungsi untuk Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Email tidak ditemukan." });
    }

    // 2. Bandingkan password yang dikirim dengan yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password salah." });
    }

    // 3. Buat JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload token
      process.env.JWT_SECRET, // Kunci rahasia dari file .env
      { expiresIn: '24h' } // Token berlaku selama 24 jam
    );
    
    // 4. Kirim token ke client
    res.status(200).json({
      message: "Login berhasil!",
      token: token,
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Gagal melakukan login." });
  }
};
