import { Link } from 'react-router-dom'
import { Menu, LogOut, BookOpen, User as UserIcon, LayoutDashboard, Home, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const NavLinks = ({ isMobile = false, onClick }: { isMobile?: boolean; onClick?: () => void }) => (
    <>
      <Link 
        to="/" 
        onClick={onClick}
        className={`flex items-center gap-2 font-mono font-bold uppercase tracking-wider transition-colors ${
          isMobile 
            ? 'text-neutral-700 hover:text-black py-3 px-4 border-b border-neutral-200' 
            : 'text-[10px] text-neutral-700 hover:text-black'
        }`}
      >
        <Home className="h-3.5 w-3.5" />
        <span>home</span>
      </Link>
      <Link 
        to="/blog" 
        onClick={onClick}
        className={`flex items-center gap-2 font-mono font-bold uppercase tracking-wider transition-colors ${
          isMobile 
            ? 'text-neutral-700 hover:text-black py-3 px-4 border-b border-neutral-200' 
            : 'text-[10px] text-neutral-700 hover:text-black'
        }`}
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span>blog</span>
      </Link>
      <Link 
        to="/resume" 
        onClick={onClick}
        className={`flex items-center gap-2 font-mono font-bold uppercase tracking-wider transition-colors ${
          isMobile 
            ? 'text-neutral-700 hover:text-black py-3 px-4 border-b border-neutral-200' 
            : 'text-[10px] text-neutral-700 hover:text-black'
        }`}
      >
        <UserIcon className="h-3.5 w-3.5" />
        <span>resume</span>
      </Link>
      {isAdmin && (
        <Link 
          to="/admin" 
          onClick={onClick}
          className={`flex items-center gap-2 font-mono font-bold uppercase tracking-wider transition-colors ${
            isMobile 
              ? 'text-neutral-700 hover:text-black py-3 px-4 border-b border-neutral-200' 
              : 'text-[10px] text-neutral-700 hover:text-black'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>admin</span>
        </Link>
      )}
    </>
  )

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#FAFAF8] border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 border-2 border-black flex items-center justify-center overflow-hidden">
                <img 
                  src="/antera-logo.png" 
                  alt="Antera logo" 
                  className="h-6 w-6 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load:', e)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black group-hover:text-[#FA520F] transition-colors hidden sm:inline">
                Antera Careers
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Auth section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[10px] font-mono font-bold uppercase text-neutral-700">
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Link to="/admin">
                  <button className="relative border-4 border-black bg-transparent px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-black hover:text-white">
                    login
                  </button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-[#FAFAF8] border-t border-neutral-200">
          <div className="flex flex-col p-6">
            <NavLinks isMobile onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}