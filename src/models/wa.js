const mongoose = require("mongoose");

const waSchema = new mongoose.Schema(
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

const Wa = mongoose.model("Wa", waSchema);

module.exports = Wa;
