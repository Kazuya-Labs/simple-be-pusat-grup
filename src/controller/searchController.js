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

    // Validasi platform
    const platformLower = platform?.toLowerCase();
    const isValidPlatform = ["whatsapp", "telegram"].includes(platformLower);
    if (!platform || !isValidPlatform) {
      return res.status(400).json({
        success: false,
        message: "Parameter 'platform' wajib diisi dengan 'whatsapp' atau 'telegram'."
      });
    }

    // Validasi country
    if (country && typeof country !== "string") {
      return res.status(400).json({
        success: false,
        message: "Parameter 'country' harus berupa string."
      });
    }

    // Siapkan model dan filter query
    const GroupModel = platformLower === "whatsapp" ? Wa : Telegram;
    const escapedSearchTerm = searchTerm?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

    // Ambil data dan urutkan berdasarkan createdAt terbaru
    const results = await GroupModel.find(queryFilter).sort({ createdAt: -1 });

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

    // Format respons
    const response = uniqueResults.map(({ category, country, judul, imageUrl, url, platform, createdAt }) => ({
      category,
      country,
      judul,
      imageUrl,
      url,
      platform,
      createdAt
    }));

    return res.status(200).json({
      success: true,
      message: `Data grup ${platform} berhasil diambil.`,
      data: response
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memproses permintaan."
    });
  }
};