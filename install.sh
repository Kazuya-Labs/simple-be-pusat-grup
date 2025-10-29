#!/bin/bash

echo "🚀 Memulai instalasi proyek Express..."

# 1. Cek Node.js & npm
if ! command -v node &> /dev/null; then
  echo "❌ Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm tidak ditemukan. Silakan install npm terlebih dahulu."
  exit 1
fi

# 2. Install dependencies
echo "📦 Menginstal dependencies..."
npm install

# 3. Setup .env jika belum ada
if [ ! -f .env ]; then
  echo "⚙️ Membuat file .env default..."
  cat <<EOF > .env
PORT=3001
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/namadatabase
EOF
  echo "✅ File .env berhasil dibuat. Silakan sesuaikan nilai-nilainya."
else
  echo "📁 File .env sudah ada, dilewati."
fi

# 4. Jalankan server
echo "🚀 Menjalankan server..."
npm start

echo "✅ Instalasi selesai. Server berjalan di http://localhost:3001"