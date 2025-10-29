// server/controllers/groupController.js

const WaModel = require("../models/wa");
const TelegramModel = require("../models/telegram");
const scrapeWhatsapp = require("../scrape/whatsapp");
const scrapeTelegram = require("../scrape/telegram");

/**
 * @desc    Tambah grup baru ke database
 * @route   POST /api/v1/groups
 * @access  Public (atau sesuaikan dengan middleware auth)
 */
module.exports = async (req, res) => {
  try {
    const { url, platform, category, country = "Indonesia" } = req.body;

    // Validasi input
    if (!url || !platform || !category) {
      return res.status(400).json({
        success: false,
        message: "Field wajib: url, platform, category."
      });
    }

    const normalizedPlatform = platform.toLowerCase();
    let GroupModel;
    let groupDetails;

    switch (normalizedPlatform) {
      case "whatsapp":
        GroupModel = WaModel;
        groupDetails = await scrapeWhatsapp(url);
        break;
      case "telegram":
        GroupModel = TelegramModel;
        groupDetails = await scrapeTelegram(url);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Platform harus 'whatsapp' atau 'telegram'."
        });
    }

    if (!groupDetails) {
      return res.status(400).json({
        success: false,
        message: "URL tidak valid atau gagal di-*scrape*."
      });
    }

    const newGroupData = {
      url,
      platform: normalizedPlatform,
      category,
      judul: groupDetails.title,
      imageUrl: groupDetails.imageUrl,
      country
    };

    const newGroup = await GroupModel.create(newGroupData);

    return res.status(201).json({
      success: true,
      message: `Grup ${platform} berhasil ditambahkan! Menunggu verifikasi.`,
      data: newGroup
    });
  } catch (error) {
    console.error("Error adding group:", error);

    let message = "Terjadi kesalahan server saat menyimpan grup.";
    if (error.name === "ValidationError") {
      message = `Data tidak valid: ${error.message}`;
    }

    return res.status(500).json({
      success: false,
      message,
      error: error.message
    });
  }
};
