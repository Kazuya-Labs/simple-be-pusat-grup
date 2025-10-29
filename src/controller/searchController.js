// server/controllers/searchController.js
const Wa = require("../models/wa");
const Telegram = require("../models/telegram");

const searchController = async (req, res) => {
  try {
    // 1. Ekstraksi Parameter
    const {
      country = "Indonesia",
      platform,
      category,
      q: searchTerm // Ambil 'q' dari query dan beri alias 'searchTerm'
    } = req.query;

    // --- Validasi Platform Wajib ---
    if (
      !platform ||
      (platform.toLowerCase() !== "whatsapp" &&
        platform.toLowerCase() !== "telegram")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Parameter 'platform' wajib diisi dengan 'whatsapp' atau 'telegram'."
      });
    }

    // 2. Tentukan Model yang Akan Digunakan
    const GroupModel = platform.toLowerCase() === "whatsapp" ? Wa : Telegram;

    // 3. Konstruksi Objek Query Dinamis
    const queryFilter = {};

    // Filter Kategori
    // Abaikan filter jika nilainya 'Semua' (default dari frontend) atau kosong
    if (category && category.toLowerCase() !== "semua") {
      queryFilter.category = category;
    }

    // Filter Negara
    // Abaikan filter jika nilainya 'global' (kecuali memang ingin membatasi global)
    if (country && country.toLowerCase() !== "global") {
      queryFilter.country = country;
    }

    // Filter Pencarian Teks (Judul)
    if (searchTerm) {
      // Menggunakan $regex untuk pencarian case-insensitive pada field 'judul'
      queryFilter.judul = {
        $regex: new RegExp(searchTerm, "i")
      };
    }

    // 4. Eksekusi Query Database (Menggunakan Model yang Telah Dipilih)

    const results = await GroupModel.find(queryFilter);

    const response = results.map(v => ({
      category: v.category,
      country: v.country, // Perbaikan: v.cat menjadi v.country
      judul: v.judul,
      imageUrl: v.imageUrl,
      url: v.url,
      platform: v.platform,
      createdAt: v.createdAt // Perbaikan: Tambahkan titik dua (:)
    }));

    // 5. Mengirim Respon Sukses
    res.status(200).json({
      success: true,
      message: `Data grup ${platform} berhasil diambil.`,
      data: response
    });
  } catch (e) {
    // 6. Penanganan Error
    console.error("Database Error:", e);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memproses permintaan.",
      error: e.message
    });
  }
};

module.exports = searchController;
