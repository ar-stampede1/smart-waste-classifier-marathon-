import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2, Image as ImageIcon, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

export default function ImageDetection() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      setResults(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false
  })

  const handleDetect = async () => {
    if (!image) return

    setLoading(true)
    console.log('Starting detection...')
    console.log('Image file:', image.name, image.type, image.size)
    
    const formData = new FormData()
    formData.append('file', image)

    try {
      console.log('Sending request to:', `${API_URL}/detect-image`)
      const response = await axios.post(`${API_URL}/detect-image`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      })
      
      console.log('Response received:', response.data)
      setResults(response.data)
      
    } catch (error) {
      console.error('Detection error:', error)
      
      if (error.response) {
        // Server responded with error
        console.error('Server error:', error.response.data)
        alert(`Server Error: ${error.response.data.error || 'Unknown error'}`)
      } else if (error.request) {
        // Request made but no response
        console.error('No response from server')
        alert('No response from server. Make sure the backend is running on http://localhost:8000')
      } else {
        // Something else happened
        console.error('Error:', error.message)
        alert(`Error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setImage(null)
    setPreview(null)
    setResults(null)
  }

  const chartColors = ['#F58F7C', '#F2C4CE', '#D8D6D6', '#4F4F51']

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Image Detection</h2>
        <p className="text-gray-400">Upload an image to detect and classify waste items</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`card border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragActive
                ? 'border-accent-coral bg-accent-coral/10 scale-105'
                : 'border-primary-light hover:border-accent-pink'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center py-12">
              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-xl max-h-96 mx-auto object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClear()
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="text-accent-coral mb-4" size={64} />
                  <p className="text-xl font-semibold text-white mb-2">
                    {isDragActive ? 'Drop image here' : 'Drag & drop an image'}
                  </p>
                  <p className="text-gray-400 mb-4">or click to browse</p>
                  <p className="text-sm text-gray-500">Supports: JPG, PNG, JPEG</p>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleDetect}
              disabled={!image || loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Detecting...
                </>
              ) : (
                <>
                  <ImageIcon size={20} />
                  Detect Objects
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={!image}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                {/* Annotated Image */}
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Detection Results</h3>
                  <img
                    src={results.annotated_image}
                    alt="Detection results"
                    className="rounded-xl w-full"
                  />
                </div>

                {/* Statistics */}
                <div className="stat-card">
                  <div className="text-center">
                    <p className="text-white/80 text-sm font-medium mb-2">Total Detections</p>
                    <p className="text-6xl font-bold text-white">{results.total_detections}</p>
                  </div>
                </div>

                {/* Categories */}
                {results.categories.length > 0 && (
                  <div className="card">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 size={24} />
                      Category Breakdown
                    </h3>
                    <div className="space-y-3">
                      {results.categories.map((cat, idx) => (
                        <motion.div
                          key={cat.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-4 bg-primary-dark rounded-xl"
                        >
                          <span className="text-white font-medium capitalize">{cat.name}</span>
                          <div className="flex items-center gap-3">
                            <div className="bg-accent-coral text-white px-4 py-1 rounded-full font-bold">
                              {cat.count}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="mt-6 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.categories}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#4F4F51" />
                          <XAxis dataKey="name" stroke="#D8D6D6" />
                          <YAxis stroke="#D8D6D6" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#2C2830',
                              border: '1px solid #4F4F51',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {results.categories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card h-full flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center text-gray-400">
                  <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Upload an image and click "Detect Objects"</p>
                  <p className="text-sm mt-2">Results will appear here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}