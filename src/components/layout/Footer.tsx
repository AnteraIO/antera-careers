import { Github, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-[#FAFAF8] mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-[10px] font-mono font-bold uppercase text-neutral-700 order-2 sm:order-1">
            © {currentYear} sheddy.dev
          </p>

          {/* Social links */}
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <a 
              href="https://github.com/zuck30/zuck30" 
              className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-all"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/shadrackovsky" 
              className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}