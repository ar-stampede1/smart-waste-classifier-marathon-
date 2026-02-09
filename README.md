# 🚀 Smart Waste Classifier - React + FastAPI

A beautiful, production-ready waste detection system with React frontend and FastAPI backend.

## ✨ Features

- 📸 **Image Detection** - Upload images with drag & drop
- 📹 **Live Webcam** - Real-time detection with WebSocket streaming
- 📊 **Interactive Charts** - Beautiful data visualizations
- 🎨 **Modern UI** - Sleek design with Tailwind CSS
- ⚡ **Fast Performance** - Optimized for speed
- 🔄 **Real-time Updates** - WebSocket for live data

## 🎨 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Axios (HTTP client)
- React Router (navigation)

### Backend
- FastAPI
- YOLOv8 (Ultralytics)
- OpenCV
- WebSocket
- Python 3.10+

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Webcam (for live detection)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Update model path in `main.py`:
```python
MODEL_PATH = r"YOUR_MODEL_PATH_HERE"
```

5. Run the backend:
```bash
python main.py
```

Backend will run at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

## 🚀 Usage

1. **Start Backend** (in backend folder):
```bash
python main.py
```

2. **Start Frontend** (in frontend folder):
```bash
npm run dev
```

3. **Open Browser**:
   - Go to `http://localhost:3000`
   - The interface will auto-open

## 📱 Pages

### 1. Image Detection
- Drag & drop images
- Upload from computer
- Instant detection results
- Category breakdown
- Interactive bar charts

### 2. Live Webcam
- Real-time streaming
- Start/Stop controls
- Live statistics
- Session tracking
- Detection history chart

### 3. About
- Feature overview
- How it works
- Technology stack
- Model information
- Use cases

## 🎯 API Endpoints

### REST Endpoints
- `GET /` - API info
- `POST /detect-image` - Detect objects in image
- `GET /stats/{client_id}` - Get session statistics
- `GET /health` - Health check

### WebSocket
- `WS /ws/webcam/{client_id}` - Real-time webcam detection

## 🎨 Color Palette

- **Primary Dark**: `#2C2830`
- **Primary Medium**: `#4F4F51`
- **Primary Light**: `#D8D6D6`
- **Accent Pink**: `#F2C4CE`
- **Accent Coral**: `#F58F7C`

## 📊 Model Configuration

- **Model**: YOLOv8
- **Confidence Threshold**: 40%
- **Webcam FPS**: ~10 FPS
- **Image Processing**: Instant

## 🔧 Development

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Environment Variables

Backend (`backend/.env`):
```env
MODEL_PATH=/path/to/your/model.pt
CORS_ORIGINS=http://localhost:3000
```

## 📝 File Structure

```
.
├── backend/
│   ├── main.py              # FastAPI server
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── ImageDetection.jsx
    │   │   ├── WebcamDetection.jsx
    │   │   └── About.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

**CORS errors:**
- Check `allow_origins` in `main.py`
- Add your frontend URL

### Frontend Issues

**Webcam not working:**
- Check browser permissions
- Use HTTPS in production
- Allow camera access

**WebSocket connection failed:**
- Ensure backend is running
- Check WebSocket URL in code

## 🚢 Deployment

### Backend (Railway, Render, Heroku)
1. Add `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel, Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Update API URLs to production backend

## 📄 License

MIT License

## 🤝 Contributing

Pull requests welcome!

## 💬 Support

For issues, please open a GitHub issue.

---

**Made with ❤️ using React, FastAPI & YOLOv8**
