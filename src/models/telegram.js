const mongoose = require("mongoose");

const telegramSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    country: { type: String, required: true },
    judul: { type: String, required: true },
    platform: { type: String, default: "whatsapp" }
  },
  { timestamps: true }
);

const Telegram = mongoose.model("Telegram", telegramSchema);

module.exports = Telegram;
