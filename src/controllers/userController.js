import prisma from '../prismaClient.js';

// Fungsi untuk mendapatkan profil user yang sedang login
export const getMyProfile = async (req, res) => {
  try {
    // ID user diambil dari token yang sudah diverifikasi oleh middleware
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Penting: Pilih field yang ingin dikembalikan.
      // JANGAN PERNAH kembalikan field 'password'.
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Gagal mendapatkan profil.' });
  }
};

// Fungsi untuk memperbarui profil user yang sedang login
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body; // Untuk saat ini, kita hanya izinkan update nama

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
};
