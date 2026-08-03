import { Link } from 'react-router-dom'
import { Menu, LogOut, Briefcase, LayoutDashboard, Home, X } from 'lucide-react'
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
            ? 'text-black hover:bg-neutral-50 py-4 px-6 border-b border-neutral-200' 
            : 'text-[10px] text-black hover:bg-neutral-50 px-5 h-full flex items-center border-r border-neutral-200'
        }`}
      >
        <Home className="h-3.5 w-3.5 stroke-[2.5px]" />
        <span>home</span>
      </Link>
      <Link 
        to="/jobs"
        onClick={onClick}
        className={`flex items-center gap-2 font-mono font-bold uppercase tracking-wider transition-colors ${
          isMobile 
            ? 'text-black hover:bg-neutral-50 py-4 px-6 border-b border-neutral-200' 
            : 'text-[10px] text-black hover:bg-neutral-50 px-5 h-full flex items-center border-r border-neutral-200'
        }`}
      >
        <Briefcase className="h-3.5 w-3.5 stroke-[2.5px]" />
        <span>jobs</span>
      </Link>
      {isAdmin && (
        <Link 
          to="/admin" 
          onClick={onClick}
          className={`flex items-center gap-2 font-mono font-bold uppercase tracking-wider transition-colors ${
            isMobile 
              ? 'text-black hover:bg-neutral-50 py-4 px-6 border-b border-neutral-200' 
              : 'text-[10px] text-black hover:bg-neutral-50 px-5 h-full flex items-center border-r border-neutral-200'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5 stroke-[2.5px]" />
          <span>admin</span>
        </Link>
      )}
    </>
  )

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200 text-xs font-mono font-bold antialiased uppercase tracking-wider h-16 flex flex-col">
        <div className="mx-auto flex items-stretch justify-between h-full w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 px-6 border-r border-neutral-200 hover:bg-neutral-50 transition-colors flex-shrink-0 relative">
            <span className="absolute inset-0 border-t border-l border-neutral-50 pointer-events-none" />
            <div className="h-6 w-6 border-2 border-black flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
              <img 
                src="/antera-logo.jpeg" 
                alt="Antera logo" 
                className="h-5 w-5 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <span className="font-black text-black tracking-tighter">
              Antera Careers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-stretch">
            <NavLinks />
          </div>

          {/* Right side - Mobile menu button only */}
          <div className="flex items-stretch">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden px-6 flex items-center justify-center text-black border-l border-neutral-200 hover:bg-neutral-50 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5 stroke-[2.5px]" /> : <Menu className="w-5 h-5 stroke-[2.5px]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-white border-t border-neutral-200 flex flex-col divide-y-4 divide-neutral-200 overflow-y-auto font-mono font-bold text-xs uppercase tracking-wider">
          <div className="flex flex-col divide-y-2 divide-neutral-100 text-black">
            <NavLinks isMobile onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}