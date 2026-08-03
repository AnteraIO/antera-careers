import { usePost } from '@/hooks/usePosts'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Calendar, Clock, Eye, ArrowBigUp, ArrowBigDown, ArrowLeft, Share2, ChevronUp, Twitter, Linkedin, MessageCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { formatDate, estimateReadingTime, cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { post, loading, error, incrementViews, upvote, downvote } = usePost(slug || '')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    if (post) {
      setHasVoted(!!localStorage.getItem(`voted_${post.id}`))
    }
  }, [post?.id])

  useEffect(() => {
    if (post) {
      incrementViews()
      document.title = `${post.title} | Sheddy.dev`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt || '')
      }

      const setOgTag = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`)
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute('property', property)
          document.head.appendChild(el)
        }
        el.setAttribute('content', content)
      }

      setOgTag('og:title', post.title)
      setOgTag('og:description', post.excerpt || '')
      if (post.cover_image) setOgTag('og:image', post.cover_image)
    }

    return () => {
      document.title = 'Sheddy.dev | Personal Portfolio'
    }
  }, [post?.id])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const share = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ''
    let shareUrl = ''

    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    }
    if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    }

    if (shareUrl) window.open(shareUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="bg-[#FAFAF8] text-black min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-24 bg-neutral-200" />
              <div className="space-y-4">
                <div className="h-12 w-3/4 bg-neutral-200" />
                <div className="h-4 w-full bg-neutral-200" />
                <div className="h-4 w-full bg-neutral-200" />
                <div className="h-4 w-2/3 bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-[#FAFAF8] text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-neutral-700">Post not found</p>
          <Link to="/blog" className="text-[#FA520F] font-mono text-sm mt-4 inline-block hover:underline">
            ← back to blog
          </Link>
        </div>
      </div>
    )
  }

  const voteCount = (post.upvotes || 0) - (post.downvotes || 0)

  return (
    <article className="bg-[#FAFAF8] text-black min-h-screen selection:bg-[#FA520F] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/blog" className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors mb-12">
            <ArrowLeft className="h-4 w-4" />
            back
          </Link>

          {/* Post header */}
          <header className="mb-16">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-black text-white border border-black">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-[-0.03em] leading-[0.95] text-black mb-6">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono font-bold uppercase text-neutral-700 border-t border-neutral-200 pt-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {estimateReadingTime(post.content)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {post.views} views
              </span>
            </div>
          </header>

          {/* Cover image */}
          {post.cover_image && (
            <div className="border border-neutral-200 overflow-hidden mb-16">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full object-cover max-h-[500px]" 
                loading="lazy" 
              />
            </div>
          )}

          {/* Markdown content */}
          <div className="prose prose-neutral max-w-none mb-16 text-neutral-800
            prose-headings:text-black prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-[32px] prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-none
            prose-h3:text-[24px] prose-h3:mt-12 prose-h3:mb-4
            prose-p:text-[19px] prose-p:leading-[32px] prose-p:text-neutral-800 prose-p:mb-8
            prose-pre:bg-black prose-pre:text-white prose-pre:rounded-none prose-pre:border prose-pre:border-neutral-500 prose-pre:p-6
            prose-blockquote:border-l-4 prose-blockquote:border-neutral-500 prose-blockquote:font-normal prose-blockquote:italic prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-10 prose-blockquote:text-neutral-600
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8
            prose-li:text-[19px] prose-li:leading-[32px]
            prose-table:border-none prose-table:my-12
            prose-th:border-b prose-th:border-neutral-600 prose-th:p-3 prose-th:text-sm prose-th:font-bold
            prose-td:p-3 prose-td:border-b prose-td:border-neutral-200 prose-td:text-[17px]
            prose-a:text-black prose-a:font-normal prose-a:underline prose-a:decoration-neutral-700 hover:prose-a:decoration-black
            prose-strong:font-bold prose-strong:text-black
            prose-img:border-none prose-img:shadow-none prose-img:my-12
          ">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Footer with voting and sharing */}
          <footer className="border-t border-neutral-500 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Vote buttons */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border-4 border-black">
                  <button
                    className={cn(
                      "p-2 transition-all",
                      hasVoted 
                        ? "opacity-40 cursor-not-allowed" 
                        : "hover:bg-black hover:text-white"
                    )}
                    onClick={() => {
                      if (!hasVoted) {
                        upvote()
                        localStorage.setItem(`voted_${post.id}`, 'up')
                        setHasVoted(true)
                      }
                    }}
                    disabled={hasVoted}
                  >
                    <ArrowBigUp className="h-5 w-5" />
                  </button>
                  <span className="px-3 text-sm font-mono font-bold text-black min-w-[32px] text-center">
                    {voteCount}
                  </span>
                  <button
                    className={cn(
                      "p-2 transition-all",
                      hasVoted 
                        ? "opacity-40 cursor-not-allowed" 
                        : "hover:bg-black hover:text-white"
                    )}
                    onClick={() => {
                      if (!hasVoted) {
                        downvote()
                        localStorage.setItem(`voted_${post.id}`, 'down')
                        setHasVoted(true)
                      }
                    }}
                    disabled={hasVoted}
                  >
                    <ArrowBigDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5" />
                  share:
                </span>
                <button 
                  onClick={() => share('twitter')}
                  className="relative border-4 border-black bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-black hover:text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <Twitter className="h-3 w-3" />
                    tweet
                  </span>
                </button>
                <button 
                  onClick={() => share('linkedin')}
                  className="relative border-4 border-black bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-black hover:text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <Linkedin className="h-3 w-3" />
                    linkedin
                  </span>
                </button>
                <button 
                  onClick={() => share('whatsapp')}
                  className="relative border-4 border-black bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-black hover:text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-3 w-3" />
                    whatsapp
                  </span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-black hover:text-white z-50"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </article>
  )
}