from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
from collections import Counter
import asyncio
import base64
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

app = FastAPI(title="Smart Waste Classifier API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
MODEL_PATH = r"C:\Users\akhat\Documents\ML practice\yolo practice\YOLO project-1\runs\detect\train\weights\best.pt"
model = YOLO(MODEL_PATH)
class_names = model.names

# Thread Pool for non-blocking inference
executor = ThreadPoolExecutor(max_workers=4)

# Session tracking (Used only for start time/FPS calculation now)
sessions = {}

# --- HELPER FUNCTIONS ---

def process_frame(frame_bytes):
    """
    Decodes image, runs inference, and returns detection data (JSON).
    Used for Live Camera (WebSocket).
    """
    # 1. Decode
    nparr = np.frombuffer(frame_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None: return None

    # 2. Inference
    results = model(img, conf=0.4, verbose=False)[0]
    
    # 3. Process Detections
    detections = []
    current_counts = Counter()

    if results.boxes:
        for box in results.boxes:
            # Get normalized coordinates (0-1)
            x1, y1, x2, y2 = box.xyxyn[0].tolist() 
            
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            conf = float(box.conf[0])
            
            current_counts[label] += 1
            
            detections.append({
                "label": label,
                "confidence": round(conf, 2),
                "box": [x1, y1, x2, y2], 
                "category": "organic" if "organic" in label.lower() else "recyclable"
            })
            
    return detections, current_counts

# --- HTTP ENDPOINTS (For Image Upload) ---

@app.post("/detect-image")
async def detect_image(file: UploadFile = File(...)):
    """
    Endpoint for uploading a single image file.
    Returns the annotated image (base64) and statistics.
    """
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return JSONResponse(status_code=400, content={"error": "Invalid image file"})
        
        # Run inference
        results = model(img, conf=0.4, verbose=False)[0]
        
        # Generate Annotated Image (Draw boxes on server side for static uploads)
        annotated_img = results.plot()
        
        # Encode to Base64 to send back to React
        _, buffer = cv2.imencode('.jpg', annotated_img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Count items
        counts = Counter()
        for box in results.boxes:
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            counts[label] += 1
            
        # Format categories
        categories = [
            {"name": k, "count": v, "category": "organic" if "organic" in k.lower() else "recyclable"}
            for k, v in counts.items()
        ]
        
        return {
            "success": True,
            "total_detections": sum(counts.values()),
            "categories": categories,
            "annotated_image": f"data:image/jpeg;base64,{img_base64}"
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# --- WEBSOCKET ENDPOINTS (For Live Camera) ---

@app.websocket("/ws/webcam/{client_id}")
async def webcam_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    
    sessions[client_id] = {
        "start_time": datetime.now(),
        "frame_count": 0
    }
    
    try:
        while True:
            # Receive raw bytes
            data = await websocket.receive_bytes()
            
            # Offload heavy ML task to thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                executor, process_frame, data
            )
            
            if result is None: continue
            
            detections, current_counts = result
            
            # Update Session (Just for FPS/Timer)
            session = sessions[client_id]
            session["frame_count"] += 1
            
            # Calculate Time & FPS
            elapsed = (datetime.now() - session["start_time"]).total_seconds()
            fps = session["frame_count"] / elapsed if elapsed > 0 else 0
            
            # Calculate counts based ONLY on 'current_counts' (Live Frame)
            organic_live = sum(
                count for name, count in current_counts.items() 
                if "organic" in name.lower()
            )
            
            recyclable_live = sum(
                count for name, count in current_counts.items() 
                if "recyclable" in name.lower()
            )

            # Prepare Response Data
            response = {
                "type": "result",
                "detections": detections, 
                "stats": {                
                    "current_on_screen": sum(current_counts.values()), 
                    "fps": round(fps, 1),
                    "elapsed_seconds": int(elapsed),
                    "organic_count": organic_live,      
                    "recyclable_count": recyclable_live, 
                    "current_items": [
                        {"name": k, "count": v, "category": "organic" if "organic" in k.lower() else "recyclable"}
                        for k, v in current_counts.items()
                    ]
                }
            }
            
            await websocket.send_json(response)
            
    except WebSocketDisconnect:
        if client_id in sessions:
            del sessions[client_id]
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error: {e}")
        if client_id in sessions:
            del sessions[client_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)