import { usePosts } from '@/hooks/usePosts'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import heroImage from '@/assets/hero.png'

export function HomePage() {
  const { posts, loading } = usePosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="bg-[#FAFAF8] text-black min-h-screen selection:bg-[#FA520F] selection:text-white">
      {/* Hero Section with Background Image */}
      <section 
        className="relative border-b border-neutral-200 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Dark overlay for text contrast - no blur/glass */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-[-0.03em] leading-[0.95] mb-8 text-white"
            >
              Engineering.
              <br />
              Design.
              <br />
              Growth.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg max-w-2xl leading-relaxed text-white/80 mx-auto mb-10"
            >
              I, Shadrack just like building fast software and clean interfaces with a unique taste that actually work. 
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/blog">
                <button className="group relative border-4 border-black bg-[#FA520F] px-8 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                  <span className="absolute inset-0 border-t-2 border-l-2 border-white/40 pointer-events-none" />
                  <span className="absolute inset-0 border-b-2 border-r-2 border-black/40 pointer-events-none" />
                  <span className="relative flex items-center gap-2">
                    Explore Blog
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <Link to="/resume">
                <button className="group relative border-4 border-black bg-transparent px-8 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-black hover:text-white">
                  <span className="absolute inset-0 border-t-2 border-l-2 border-white/20 pointer-events-none" />
                  <span className="absolute inset-0 border-b-2 border-r-2 border-black/20 pointer-events-none" />
                  <span className="relative">About Me</span>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[-0.03em] leading-[0.95]">
                Latest Posts
              </h2>
              <p className="text-[10px] font-mono uppercase text-neutral-700 mt-2">
                {posts.length} total
              </p>
            </div>
            <Link 
              to="/blog" 
              className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors"
            >
              view all
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
            {recentPosts.map((post, i) => (
              <div
                key={post.id}
                className={`group border-b ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'md:border-b' : ''} border-neutral-200 hover:bg-neutral-50/50 transition-colors`}
              >
                <Link to={`/post/${post.slug}`} className="block p-8 md:p-12 min-h-[420px] flex flex-col justify-between">
                  {post.cover_image && (
                    <div className="aspect-video relative border border-neutral-200 overflow-hidden mb-8 bg-neutral-100">
                      <img 
                        src={post.cover_image} 
                        alt={post.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 bg-black text-white">Read</span>
                      <span className="text-[10px] font-mono text-neutral-700 uppercase">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-3 group-hover:text-[#FA520F] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-base text-neutral-500 leading-relaxed line-clamp-3">
                      {post.excerpt?.replace(/^(?:TITLE|EXCERPT|CONTENT):\s*/gi, '').trim() ||
                       post.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {recentPosts.length === 0 && !loading && (
            <div className="text-center py-20 border border-dashed border-neutral-200">
              <p className="font-mono text-neutral-700">No posts found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}