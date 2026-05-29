# ⚡ Sorting Algorithm Visualizer

A full-stack **MERN** (MongoDB, Express, React, Node.js) application that visualizes and measures sorting algorithms in real-time with animated bar charts.

![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-green) ![Express](https://img.shields.io/badge/Express-4.x-lightgrey) ![React](https://img.shields.io/badge/React-Vite-blue) ![Node](https://img.shields.io/badge/Node.js-18+-brightgreen)

---

## 🎯 Features

- 📊 **Animated bar chart** — watch elements being compared and swapped in real-time
- ⚡ **6 Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick, Heap
- 📐 **Live Metrics** — comparisons, swaps, and time measured per run
- 🗄️ **MongoDB Atlas** — every sort run is saved to the cloud database
- 📜 **History Table** — see all past runs with algorithm, size, time, and stats
- 🎛️ **Controls** — choose algorithm, array size (10–200), and animation speed

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React.js (Vite)         |
| Backend   | Node.js + Express.js    |
| Database  | MongoDB Atlas (Mongoose)|
| Styling   | Vanilla CSS (Dark Theme)|

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- Node.js v18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/sorting-visualizer.git
cd sorting-visualizer
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
MONGO_URI=mongodb+srv://<your-atlas-connection-string>
PORT=5000
```

Start the server:
```bash
npm run dev
# ✅ Server running on http://localhost:5000
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

### 4. Open the app
Go to **http://localhost:5173** in your browser.

> ⚠️ Both the server (port 5000) and client (port 5173) must be running at the same time.

---

## 📁 Project Structure

```
sorting-visualizer/
├── client/                  ← React Frontend (Vite)
│   └── src/
│       ├── components/      ← Controls, Visualizer, Metrics, History
│       ├── algorithms/      ← All 6 sorting algorithm generators
│       ├── api/             ← fetch() calls to the backend
│       └── App.jsx          ← Root component + animation logic
│
└── server/                  ← Node.js + Express Backend
    ├── config/db.js         ← MongoDB connection
    ├── models/              ← Mongoose schemas
    ├── routes/              ← API endpoints
    └── controllers/         ← Business logic
```

---

## 🔌 API Endpoints

| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| GET    | `/`                 | Health check                   |
| POST   | `/api/sort/run`     | Save a sort result to MongoDB  |
| GET    | `/api/sort/history` | Get all past sort runs         |
| GET    | `/api/sort/stats`   | Aggregated stats per algorithm |

---

## 🧠 Sorting Algorithms

| Algorithm      | Avg Time   | Space  |
|---------------|------------|--------|
| Bubble Sort    | O(n²)      | O(1)   |
| Selection Sort | O(n²)      | O(1)   |
| Insertion Sort | O(n²)      | O(1)   |
| Merge Sort     | O(n log n) | O(n)   |
| Quick Sort     | O(n log n) | O(log n)|
| Heap Sort      | O(n log n) | O(1)   |

---

## 📄 License
MIT
