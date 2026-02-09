import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Recycle, Image as ImageIcon, Video, Info } from 'lucide-react'
import ImageDetection from './pages/ImageDetection'
import WebcamDetection from './pages/WebcamDetection'
import About from './pages/About'
import './index.css'

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-primary-medium'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{children}</span>
      </motion.div>
    </Link>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-dark via-primary-medium to-primary-dark border-b border-primary-medium">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="bg-gradient-to-br from-accent-coral to-accent-pink p-3 rounded-2xl">
                  <Recycle className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Waste Classifier</h1>
                  <p className="text-sm text-gray-400">AI-Powered Detection</p>
                </div>
              </motion.div>
            </Link>

            {/* Navigation */}
            <nav className="flex gap-4">
              <NavLink to="/" icon={ImageIcon}>Image</NavLink>
              <NavLink to="/webcam" icon={Video}>Webcam</NavLink>
              <NavLink to="/about" icon={Info}>About</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-medium border-t border-primary-dark mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400">
          <p>Made with ❤️ using React, FastAPI & YOLOv8</p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ImageDetection />} />
          <Route path="/webcam" element={<WebcamDetection />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App