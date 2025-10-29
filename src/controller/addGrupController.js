// server/controllers/groupController.js
const Wa = require("../models/wa");
const Telegram = require("../models/telegram");
const grupScrape = require("../scrape/groupWa");
const scrapeTele = require("../scrape/telegram");
// (Pastikan Anda sudah mengekspor searchController di file ini)

/**
 * Controller untuk menambahkan Grup baru ke database.
 * Endpoint: POST /api/v1/groups
 * Data (Body): url, platform, category
 */
module.exports = async (req, res) => {
  try {
    // 1. Ekstraksi Data dari Body
    const {
      url,
      platform,
      category,
      // Asumsi field lain yang wajib ada di schema
      country = "Indonesia"
    } = req.body;

    // 2. Validasi Dasar Data Wajib
    if (!url || !platform || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Semua field wajib (URL, Platform, Kategori, Judul) harus diisi."
      });
    }

    const normalizedPlatform = platform.toLowerCase();

    // 3. Tentukan Model yang Akan Digunakan
    let GroupModel;
    let detailGrup = null;
    if (normalizedPlatform === "whatsapp") {
      GroupModel = Wa;
      detailGrup = await grupScrape(url);
    } else if (normalizedPlatform === "telegram") {
      GroupModel = Telegram;
      detailGrup = await scrapeTele(url);
    } else {
      return res.status(400).json({
        success: false,
        message: "Platform harus 'whatsapp' atau 'telegram'."
      });
    }

    console.log(`detailGrup:`, detailGrup);
    if (!detailGrup)
      return res.status(400).json({
        success: false,
        message: "Url tidak valid"
      });
    // 4. Konstruksi Objek Data Baru
    const newGroupData = {
      url: url,
      platform: normalizedPlatform,
      category: category,
      judul: detailGrup.title,
      imageUrl: detailGrup.imageUrl,
      country: country
      // Anda bisa menambahkan logic di sini untuk members: 1 (pembuat), dll.
      // ... field lain sesuai skema Anda
    };

    // 5. Simpan ke Database
    const newGroup = await GroupModel.create(newGroupData);

    // 6. Kirim Respon Sukses
    res.status(201).json({
      // 201 Created
      success: true,
      message: `Grup ${platform} berhasil ditambahkan! Menunggu verifikasi.`,
      data: newGroup
    });
  } catch (e) {
    // 7. Penanganan Error
    console.error("Error adding group:", e);
    // Mongoose validation error handling (optional, tapi disarankan)
    let message = "Terjadi kesalahan server saat menyimpan grup.";
    if (e.name === "ValidationError") {
      message = `Data tidak valid: ${e.message}`;
    }

    res.status(500).json({
      success: false,
      message: message,
      error: e.message
    });
  }
};

// ... (Pastikan Anda tetap mengekspor fungsi searchController dan fungsi lain yang Anda buat)
