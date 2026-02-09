# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Update MODEL_PATH in main.py to your model location

# Run server
python main.py
```

✅ Backend running at http://localhost:8000

### Step 2: Frontend Setup (New Terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Run dev server
npm run dev
```

✅ Frontend running at http://localhost:3000

### Step 3: Open Browser
Browser should auto-open to http://localhost:3000

If not, manually open: http://localhost:3000

---

## 🎯 What You'll See

### Image Detection Tab
1. Drag & drop an image OR click to upload
2. Click "Detect Objects"
3. See results with bounding boxes & charts!

### Webcam Tab
1. Click "Start Detection"
2. Allow camera permissions
3. Watch real-time detection!
4. Click "Stop Detection" when done

---

## 🎨 Features to Try

✨ **Drag & Drop** - Drag images directly onto upload area
📊 **Live Charts** - See detection distribution in real-time
📹 **Webcam Streaming** - 10 FPS smooth detection
🎯 **Category Tracking** - See what's detected most
⏱️ **Session Stats** - Track total detections & time

---

## 🐛 Common Issues

**Backend won't start:**
- Check Python version (3.10+)
- Make sure model path is correct
- Port 8000 might be in use

**Frontend won't start:**
- Run `npm install` first
- Check Node version (18+)
- Port 3000 might be in use

**Webcam not working:**
- Allow camera permissions in browser
- Check if other apps are using camera
- Try refreshing the page

**No detections:**
- Check model confidence (currently 40%)
- Ensure good lighting
- Objects should be clearly visible

---

## 📝 Next Steps

1. Try uploading different waste images
2. Test live webcam detection
3. Check the About page for more info
4. Customize colors in `tailwind.config.js`
5. Deploy to production!

---

**Need Help?** Check the full README.md for detailed info!
