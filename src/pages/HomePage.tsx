import { useJobs } from '@/hooks/useJobs'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import hero1 from '@/assets/hero-1.jpg'
import hero2 from '@/assets/hero-2.jpg'
import hero3 from '@/assets/hero-3.jpg'

export function HomePage() {
  const { jobs, loading } = useJobs()
  const recentJobs = jobs.slice(0, 6)
  const [currentImage, setCurrentImage] = useState(0)
  const heroImages = [hero1, hero2, hero3]

  // Rotate background images every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  // Split headline into individual words for staggered animation
  const titleWords = "Join Antera and Shape the Future of Engineering and AI in Africa.".split(" ")

  return (
    <div className="bg-[#FAFAF8] text-black min-h-screen selection:bg-[#FA520F] selection:text-white">
      {/* Hero Section with Background Image Slideshow */}
      <section className="relative min-h-screen w-full bg-black overflow-hidden border-b border-neutral-200">
        {/* Background image slideshow with crossfade */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentImage]}
                alt={`Hero Background ${currentImage + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          {/* Warm sunset gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#FA520F]/30 to-[#FCD34D]/20 z-[1]" />
        </div>

        {/* Decorative corner ornaments - top left */}
        <div className="absolute top-0 left-0 z-20 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M2 2 L30 2 L30 6 L6 6 L6 30 L2 30 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
            <path d="M10 10 L25 10 L25 14 L14 14 L14 25 L10 25 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
            <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.25" />
          </svg>
        </div>

        {/* Decorative corner ornaments - top right */}
        <div className="absolute top-0 right-0 z-20 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M98 2 L70 2 L70 6 L94 6 L94 30 L98 30 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
            <path d="M90 10 L75 10 L75 14 L86 14 L86 25 L90 25 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
            <circle cx="92" cy="8" r="1.5" fill="white" opacity="0.25" />
          </svg>
        </div>

        {/* Decorative corner ornaments - bottom left */}
        <div className="absolute bottom-0 left-0 z-20 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M2 98 L30 98 L30 94 L6 94 L6 70 L2 70 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
            <path d="M10 90 L25 90 L25 86 L14 86 L14 75 L10 75 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
            <circle cx="8" cy="92" r="1.5" fill="white" opacity="0.25" />
          </svg>
        </div>

        {/* Decorative corner ornaments - bottom right */}
        <div className="absolute bottom-0 right-0 z-20 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M98 98 L70 98 L70 94 L94 94 L94 70 L98 70 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
            <path d="M90 90 L75 90 L75 86 L86 86 L86 75 L90 75 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
            <circle cx="92" cy="92" r="1.5" fill="white" opacity="0.25" />
          </svg>
        </div>

        {/* Decorative edge lines */}
        <div className="absolute top-8 left-12 right-12 z-20 h-px pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <div className="absolute bottom-8 left-12 right-12 z-20 h-px pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <div className="absolute top-12 left-8 bottom-12 z-20 w-px pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
        <div className="absolute top-12 right-8 bottom-12 z-20 w-px pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>

        {/* Main content */}
        <div className="relative z-30 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
          <div className="max-w-4xl">
            {/* Animated headline with larger text sizes */}
            <h1 className="mb-6 text-7xl md:text-8xl lg:text-9xl font-medium leading-[1.08] tracking-tight text-white">
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Animated description with larger text */}
            <motion.p 
              className="mb-10 max-w-2xl text-xl md:text-2xl leading-relaxed text-white font-medium"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Join us to design, research, and develop world-class systems with a highly-motivated team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="/jobs">
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[-0.03em] leading-[0.95]">
                Open Careers
              </h2>
              <p className="text-[10px] font-mono uppercase text-neutral-700 mt-2">
                {jobs.length} total openings
              </p>
            </div>
            <Link 
              to="/jobs"
              className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors"
            >
              view all jobs
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
            {recentJobs.map((job, i) => (
              <div
                key={job.id}
                className={`group border-b ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'md:border-b' : ''} border-neutral-200 hover:bg-neutral-50/50 transition-colors`}
              >
                <Link to={`/job/${job.slug}`} className="block p-8 md:p-12 min-h-[380px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 bg-[#FA520F] text-white">
                        {job.employment_type}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-700 uppercase">
                        {job.department}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 group-hover:text-[#FA520F] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-6">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-dashed border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-700">
                      <MapPin className="h-3.5 w-3.5 text-[#FA520F]" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-700">
                        <DollarSign className="h-3.5 w-3.5 text-[#FA520F]" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {recentJobs.length === 0 && !loading && (
            <div className="text-center py-20 border border-dashed border-neutral-200">
              <p className="font-mono text-neutral-700">No job openings found at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}