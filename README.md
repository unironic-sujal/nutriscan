# 🥗 NutriScan — Barcode Nutrition Scanner

Scan product barcodes or search by name to instantly view nutritional information. Built for the Indian market.

![Made for India](https://img.shields.io/badge/Made%20for-India-orange?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Installable-blue?style=for-the-badge)

## Features

- 📷 **Barcode Scanner** — Scan EAN-13/EAN-8 barcodes using your phone camera
- 🔍 **Search** — Find products by name, brand, or category
- 📊 **Nutrition Data** — View calories, protein, carbs, fat, and more
- 📱 **PWA** — Install on your phone's home screen like a native app
- 🗄️ **Smart Database** — Products are cached locally after first lookup
- 🌐 **Open Food Facts** — Powered by the world's largest open food database

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Scanner | html5-qrcode |
| API Source | Open Food Facts |
| DevOps | Docker, GitHub Actions |
| Hosting | Vercel (frontend) + Railway (backend) |

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Local Development

```bash
# Clone the repo
git clone https://github.com/your-username/nutriscan.git
cd nutriscan

# Backend
cd server
cp .env.example .env  # Edit with your MongoDB URI
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

### Docker

```bash
docker-compose up
```

App will be available at `http://localhost:3000`

## Environment Variables

### Server (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/product/:barcode` | Look up product by barcode |
| GET | `/api/search?q=query` | Search products by name |
| GET | `/api/products/recent` | Get recently scanned products |
| GET | `/health` | Health check |

## License

ISC
