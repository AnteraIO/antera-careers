import { Link } from 'react-router-dom'
import { 
  Menu, 
  X, 
  ArrowRight, 
  Megaphone,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

const InstagramIcon = () => (
  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </motion.svg>
)

const XIcon = () => (
  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" 
    whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </motion.svg>
)

const LinkedinIcon = () => (
  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </motion.svg>
)

const YoutubeIcon = () => (
  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </motion.svg>
)

const FacebookIcon = () => (
  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </motion.svg>
)

export function Navbar() {
  const { isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : [])
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans">
      {/* Top Banner - With Announcement Tag */}
      {isBannerVisible && (
        <div className="bg-[#111111] text-white text-xs py-2 px-6 flex justify-between items-center w-full tracking-wide">
          <div className="flex-1 flex justify-start items-center gap-4 pl-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EAEAEA] text-black font-bold text-[10px] uppercase tracking-wider rounded-sm shrink-0">
              <Megaphone className="w-3 h-3" />
              Announcement
            </span>
            <span className="truncate">
              Join Antera and Shape the Future of Engineering and AI in Africa. | We're Hiring!
            </span>
          </div>
          <button 
            onClick={() => setIsBannerVisible(false)}
            className="text-gray-400 hover:text-white transition-colors ml-4 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav 
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors duration-200 border-b ${
          isOpen 
            ? 'bg-[#18181b] text-white border-zinc-800' 
            : 'bg-white text-black border-neutral-200'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 z-50">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200 bg-white flex items-center justify-center">
            <img 
              src="/antera-logo.jpeg" 
              alt="Antera Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <span className="text-xl font-semibold tracking-tight">Antera Software</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 z-50">
          <Link 
            to="/jobs"
            className={`hidden lg:flex px-6 py-2 text-sm font-medium border transition-colors ${
              isOpen 
                ? 'border-zinc-600 hover:bg-zinc-800 text-white' 
                : 'border-black hover:bg-gray-50 text-black'
            }`}
          >
            View Jobs
          </Link>
          
          <Link 
            to="https://wa.me/255760984921"
            target="_blank"
            className={`hidden lg:flex px-6 py-2 text-sm font-medium border transition-colors ${
              isOpen 
                ? 'border-[#FA520F] bg-[#FA520F] text-white hover:bg-[#e0490d]' 
                : 'border-black bg-white text-black hover:bg-neutral-50'
            }`}
          >
            Contact Sales
          </Link>

          {/* Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 border transition-colors ${
              isOpen
                ? 'bg-white text-black border-white hover:bg-gray-200'
                : 'bg-white text-black border-black hover:bg-gray-50'
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full h-[100vh] bg-[#18181b] text-white overflow-y-auto pb-32"
          >
            <div className="max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Column 1: Navigation */}
              <div className="lg:col-span-3">
                <ul className="flex flex-col gap-5 text-[22px] font-light">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="hover:text-[#FA520F] transition-colors text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Company Info */}
              <div className="lg:col-span-6 pr-8">
                <div className="flex justify-between items-center border-b border-zinc-700 pb-3 mb-6">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                    About Antera
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-[15px] text-zinc-300 leading-relaxed">
                    Join us to design, research, and develop world-class systems with a highly-motivated team.
                  </p>
                  <Link 
                    to="/company" 
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-bold text-zinc-400 hover:text-white tracking-widest uppercase transition-colors flex items-center gap-1"
                  >
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Column 3: Contact & Socials */}
              <div className="lg:col-span-3">
                <div className="border-b border-zinc-700 pb-3 mb-6">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                    Contact & Socials
                  </span>
                </div>
                <ul className="flex flex-col gap-4 text-sm text-zinc-300">
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                    <a href="mailto:info@antera.co.tz" className="hover:text-white transition-colors">info@antera.co.tz</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                    <a href="tel:+255774174921" className="hover:text-white transition-colors">+255 774 174 921</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                    <a 
                      href="https://wa.me/255760984921" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      +255 760 984 921
                    </a>
                  </li>
                  <li className="flex flex-col gap-2 pt-2">
                    <span className="text-zinc-500">Follow us:</span>
                    <div className="flex flex-col gap-2 text-sm">
                      <a 
                        href="https://instagram.com/antera_tz" 
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 hover:text-white transition-colors"
                      >
                        <InstagramIcon />
                        Instagram
                      </a>
                      <a 
                        href="https://twitter.com/antera_tz" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-white transition-colors"
                      >
                        <XIcon />
                        X
                      </a>
                      <a 
                        href="https://linkedin.com/company/antera_tz" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-white transition-colors"
                      >
                        <LinkedinIcon />
                        LinkedIn
                      </a>
                      <a 
                        href="https://youtube.com/@antera_tz" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-white transition-colors"
                      >
                        <YoutubeIcon />
                        YouTube
                      </a>
                      <a 
                        href="https://facebook.com/antera_tz" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-white transition-colors"
                      >
                        <FacebookIcon />
                        Facebook
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}