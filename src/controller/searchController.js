// server/controllers/searchController.js
const Wa = require("../models/wa");
const Telegram = require("../models/telegram");

module.exports = async (req, res) => {
  try {
    const {
      country = "Indonesia",
      platform,
      category,
      q: searchTerm
    } = req.query;

    // Validasi Platform
    const platformLower = platform?.toLowerCase();
    if (!platform || (platformLower !== "whatsapp" && platformLower !== "telegram")) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'platform' wajib diisi dengan 'whatsapp' atau 'telegram'."
      });
    }

    if (country && typeof country !== "string") {
      return res.status(400).json({
        success: false,
        message: "Parameter 'country' harus berupa string."
      });
    }

    const escapedSearchTerm = searchTerm?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const GroupModel = platformLower === "whatsapp" ? Wa : Telegram;

    const queryFilter = {};
    if (category && category.toLowerCase() !== "semua") {
      queryFilter.category = category;
    }
    if (country && country.toLowerCase() !== "global") {
      queryFilter.country = country;
    }
    if (searchTerm) {
      queryFilter.judul = { $regex: new RegExp(escapedSearchTerm, "i") };
    }

    const results = await GroupModel.find(queryFilter);
    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: `Data grup ${platform} tidak ditemukan.`
      });
    }

    // Filter duplikat berdasarkan URL
    const seenUrls = new Set();
    const uniqueResults = results.filter(item => {
      if (seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    });

    const response = uniqueResults.map(v => ({
      category: v.category,
      country: v.country,
      judul: v.judul,
      imageUrl: v.imageUrl,
      url: v.url,
      platform: v.platform,
      createdAt: v.createdAt
    }));

    res.status(200).json({
      success: true,
      message: `Data grup ${platform} berhasil diambil.`,
      data: response
    });
  } catch (e) {
    console.error("Database Error:", e);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memproses permintaan."
    });
  }
};