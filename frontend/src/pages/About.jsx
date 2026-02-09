import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Sparkles,
      title: 'Advanced AI Detection',
      description: 'Powered by YOLOv8, one of the most advanced real-time object detection models'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process images instantly and stream webcam at 10+ FPS for real-time detection'
    },
    {
      icon: Shield,
      title: 'Accurate Results',
      description: '40% confidence threshold ensures reliable and accurate waste classification'
    },
    {
      icon: TrendingUp,
      title: 'Live Analytics',
      description: 'Track detections in real-time with comprehensive statistics and visualizations'
    }
  ]

  const techStack = [
    { name: 'React', description: 'Modern UI library for building interactive interfaces' },
    { name: 'FastAPI', description: 'High-performance Python backend framework' },
    { name: 'YOLOv8', description: 'State-of-the-art object detection model' },
    { name: 'WebSocket', description: 'Real-time bidirectional communication' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Framer Motion', description: 'Production-ready animation library' }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-pink">
            Waste Classifier
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          AI-powered waste detection and classification system designed to help automate recycling and waste management processes
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-accent-coral to-accent-pink p-3 rounded-xl">
                <feature.icon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-coral to-accent-pink rounded-full flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload or Stream</h3>
              <p className="text-gray-400">
                Choose between uploading a static image or streaming from your webcam in real-time
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-coral to-accent-pink rounded-full flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Processing</h3>
              <p className="text-gray-400">
                Our YOLOv8 model analyzes the image/frame and detects all waste items with high accuracy
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-coral to-accent-pink rounded-full flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Results</h3>
              <p className="text-gray-400">
                View detailed detection results with bounding boxes, categories, counts, and interactive visualizations
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Technology Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className="bg-primary-dark p-4 rounded-xl hover:bg-primary-medium transition-colors"
            >
              <h4 className="text-lg font-bold text-accent-coral mb-1">{tech.name}</h4>
              <p className="text-sm text-gray-400">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-gradient-to-br from-accent-pink/10 to-accent-coral/10 border border-accent-pink/20"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Model Information</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 mb-2">Model</p>
            <p className="text-2xl font-bold text-accent-pink">YOLOv8</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Confidence Threshold</p>
            <p className="text-2xl font-bold text-accent-coral">40%</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Detection Speed</p>
            <p className="text-2xl font-bold text-accent-pink">~10 FPS</p>
          </div>
        </div>
      </motion.div>

      {/* Use Cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Use Cases</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-accent-coral mt-1">♻️</span>
            <span><strong>Waste Segregation:</strong> Automate the sorting of waste into recyclable and non-recyclable categories</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-coral mt-1">🏭</span>
            <span><strong>Recycling Facilities:</strong> Improve efficiency in recycling plants with automated detection</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-coral mt-1">📊</span>
            <span><strong>Waste Analytics:</strong> Gather data on waste composition for better management decisions</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-coral mt-1">🌍</span>
            <span><strong>Environmental Monitoring:</strong> Track waste types and quantities for environmental studies</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-coral mt-1">🏫</span>
            <span><strong>Education:</strong> Teach proper waste classification and recycling practices</span>
          </li>
        </ul>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center text-gray-400"
      >
        <p className="text-lg">
          Built with ❤️ using cutting-edge AI and web technologies
        </p>
        <p className="mt-2 text-sm">
          Powered by YOLOv8, React, FastAPI & Tailwind CSS
        </p>
      </motion.div>
    </div>
  )
}