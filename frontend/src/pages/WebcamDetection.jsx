import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, VideoOff, Clock, Leaf, Recycle, AlertCircle } from 'lucide-react'

const WS_URL = 'ws://localhost:8000/ws/webcam'

export default function WebcamDetection() {
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState(null)
  
  // UI Stats State
  const [stats, setStats] = useState({
    currentOnScreen: 0,
    organicCount: 0,
    recyclableCount: 0,
    elapsedSeconds: 0,
    detectedItems: []
  })

  // Refs for logic
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const streamRef = useRef(null)
  const requestRef = useRef(null)
  const detectionsRef = useRef([])
  const sendIntervalRef = useRef(null)
  const [clientId] = useState(() => `client_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    return () => stopDetection()
  }, [])

  const startDetection = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setIsActive(true)
          connectWebSocket()
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError(`Camera Error: ${err.message}`)
      setIsActive(false)
    }
  }

  const connectWebSocket = () => {
    const ws = new WebSocket(`${WS_URL}/${clientId}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket Connected')
      startProcessingLoop()
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'result') {
        detectionsRef.current = data.detections
        
        setStats({
          currentOnScreen: data.stats.current_on_screen,
          organicCount: data.stats.organic_count,
          recyclableCount: data.stats.recyclable_count,
          elapsedSeconds: data.stats.elapsed_seconds,
          detectedItems: data.stats.current_items
        })
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      stopDetection()
    }
  }

  const startProcessingLoop = () => {
    // Send frames at 10 FPS
    sendIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN && videoRef.current) {
        const video = videoRef.current
        const tempCanvas = document.createElement('canvas')
        const scale = 0.5 
        tempCanvas.width = video.videoWidth * scale
        tempCanvas.height = video.videoHeight * scale
        
        const ctx = tempCanvas.getContext('2d')
        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)
        
        tempCanvas.toBlob((blob) => {
          if (blob) wsRef.current.send(blob)
        }, 'image/jpeg', 0.6)
      }
    }, 100)

    // Draw boxes at 60 FPS
    const renderLoop = () => {
      drawBoxes()
      requestRef.current = requestAnimationFrame(renderLoop)
    }
    renderLoop()
  }

  const drawBoxes = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
    }

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    detectionsRef.current.forEach(det => {
      const { box, label, confidence, category } = det
      const [x1, y1, x2, y2] = box

      const x = x1 * canvas.width
      const y = y1 * canvas.height
      const w = (x2 - x1) * canvas.width
      const h = (y2 - y1) * canvas.height
      
      const color = category === 'organic' ? '#22c55e' : '#3b82f6'
      
      // Draw Box
      ctx.strokeStyle = color
      ctx.lineWidth = 4
      ctx.strokeRect(x, y, w, h)

      // Draw Label
      ctx.fillStyle = color
      const text = `${label} ${(confidence * 100).toFixed(0)}%`
      ctx.font = 'bold 16px sans-serif'
      const textWidth = ctx.measureText(text).width
      const textHeight = 24
      
      let labelY = y - textHeight
      if (labelY < 0) labelY = y
      
      ctx.fillRect(x, labelY, textWidth + 10, textHeight)
      ctx.fillStyle = 'white'
      ctx.fillText(text, x + 5, labelY + 17)
    })
  }

  const stopDetection = () => {
    setIsActive(false)
    if (sendIntervalRef.current) clearInterval(sendIntervalRef.current)
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    
    setStats({
      currentOnScreen: 0,
      organicCount: 0,
      recyclableCount: 0,
      elapsedSeconds: 0,
      detectedItems: []
    })
    detectionsRef.current = []
    
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Live Webcam Detection</h2>
        <p className="text-gray-400">High-Performance Real-time Waste Detection</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <p className="text-red-500 font-semibold">Error</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Video Feed */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-white/10 shadow-2xl">
              
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-contain ${!isActive ? 'hidden' : ''}`}
              />
              
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />

              {!isActive && (
                <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
                  <div className="text-center text-gray-500">
                    <Video size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Click "Start Detection" to begin</p>
                  </div>
                </div>
              )}

              {/* --- UPDATED LIVE INDICATOR --- */}
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-20">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <span className="text-white font-bold text-xs tracking-wider">LIVE</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex gap-4">
            {!isActive ? (
              <button onClick={startDetection} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Video size={20} />
                Start Detection
              </button>
            ) : (
              <button onClick={stopDetection} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl flex-1 flex items-center justify-center gap-2 transition-all duration-300">
                <VideoOff size={20} />
                Stop Detection
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Stats Panel */}
        <div className="space-y-6">
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium mb-2">Items on Screen</p>
              <p className="text-6xl font-bold text-white">{stats.currentOnScreen}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div className="card bg-green-500/20 border border-green-500/30">
              <div className="text-center">
                <Leaf className="text-green-400 mx-auto mb-2" size={32} />
                <p className="text-green-400 text-sm font-medium mb-1">Organic</p>
                <p className="text-4xl font-bold text-white">{stats.organicCount}</p>
              </div>
            </motion.div>

            <motion.div className="card bg-blue-500/20 border border-blue-500/30">
              <div className="text-center">
                <Recycle className="text-blue-400 mx-auto mb-2" size={32} />
                <p className="text-blue-400 text-sm font-medium mb-1">Recyclable</p>
                <p className="text-4xl font-bold text-white">{stats.recyclableCount}</p>
              </div>
            </motion.div>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary-dark rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="text-accent-coral" size={24} />
                <span className="text-white font-medium">Session Time</span>
              </div>
              <span className="text-2xl font-bold text-accent-pink">
                {formatTime(stats.elapsedSeconds)}
              </span>
            </div>
          </div>

          {stats.detectedItems.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h3 className="text-xl font-bold text-white mb-4">Current Detections</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {stats.detectedItems.map((item, idx) => (
                  <motion.div
                    key={`${item.name}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      item.category === 'organic' 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-blue-500/10 border border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.category === 'organic' ? (
                        <Leaf className="text-green-400" size={20} />
                      ) : (
                        <Recycle className="text-blue-400" size={20} />
                      )}
                      <span className="text-white font-medium capitalize">{item.name}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                      item.category === 'organic' ? 'bg-green-500' : 'bg-blue-500'
                    } text-white`}>
                      {item.count}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}