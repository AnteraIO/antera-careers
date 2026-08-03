import { useJob } from '@/hooks/useJobs'
import { Briefcase, Eye, ArrowLeft, Share2, ChevronUp, Twitter, Linkedin, MessageCircle, DollarSign, MapPin, Download, Upload, FileText } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { job, loading, error, incrementViews } = useJob(slug || '')
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Application Form State
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  // File Upload State
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)

  const [motivationLetterUrl, setMotivationLetterUrl] = useState('')
  const [motivationFile, setMotivationFile] = useState<File | null>(null)
  const [isUploadingMotivation, setIsUploadingMotivation] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (job) {
      incrementViews()
      document.title = `${job.title} | Antera Careers`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', job.description || '')
      }
    }

    return () => {
      document.title = 'Antera Careers | Join our Team'
    }
  }, [job?.id])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const share = (platform: string) => {
    const url = window.location.href
    const title = `We are hiring for ${job?.title} at Antera! Join us: `
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
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }

    if (shareUrl) window.open(shareUrl, '_blank')
  }

  // Draw and download high quality poster on HTML5 canvas
  const downloadPoster = () => {
    if (!job) return

    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 1200
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background with cool gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 1200)
    gradient.addColorStop(0, '#FAFAF8')
    gradient.addColorStop(0.5, '#FFFFFF')
    gradient.addColorStop(1, '#F3F3EE')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1200, 1200)

    // Draw border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 16
    ctx.strokeRect(40, 40, 1120, 1120)

    // Draw secondary inner border for design
    ctx.strokeStyle = '#FA520F'
    ctx.lineWidth = 4
    ctx.strokeRect(56, 56, 1088, 1088)

    // Load Antera Logo image
    const img = new Image()
    img.src = '/antera-logo.jpeg'
    img.onload = () => {
      // Draw Logo
      ctx.drawImage(img, 100, 100, 80, 80)

      // Draw Title and Header info
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 32px monospace'
      ctx.fillText('ANTERA CAREERS', 200, 150)

      ctx.fillStyle = '#FA520F'
      ctx.font = 'bold 24px monospace'
      ctx.fillText('WE ARE HIRING!', 200, 185)

      // Divider
      ctx.fillStyle = '#000000'
      ctx.fillRect(100, 220, 1000, 8)

      // Job Title
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 56px Arial, Helvetica, sans-serif'

      // Handle multi-line job title if too long
      const words = job.title.split(' ')
      let line = ''
      let y = 320
      const maxWidth = 1000
      const lineHeight = 70

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '
        let metrics = ctx.measureText(testLine)
        let testWidth = metrics.width
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 100, y)
          line = words[n] + ' '
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 100, y)

      // Meta attributes (Location, Dept, Employment Type)
      y += 50
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(100, y, 1000, 120)
      ctx.lineWidth = 6
      ctx.strokeStyle = '#000000'
      ctx.strokeRect(100, y, 1000, 120)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(`DEPARTMENT: ${job.department.toUpperCase()}`, 130, y + 45)
      ctx.fillText(`LOCATION: ${job.location.toUpperCase()}`, 130, y + 85)
      ctx.fillText(`TYPE: ${job.employment_type.toUpperCase()}`, 650, y + 45)
      if (job.experience_level) {
        ctx.fillText(`LEVEL: ${job.experience_level.toUpperCase()}`, 650, y + 85)
      }

      // Requirements
      y += 180
      ctx.fillStyle = '#FA520F'
      ctx.font = 'bold 28px monospace'
      ctx.fillText('KEY REQUIREMENTS & SKILLS', 100, y)

      y += 40
      ctx.fillStyle = '#000000'
      ctx.font = '24px Arial, sans-serif'

      const requirements = job.requirements && job.requirements.length > 0
        ? job.requirements.slice(0, 4)
        : ['Strong programming skills', 'Effective communication & teamwork', 'Problem solving capabilities'];

      requirements.forEach((req, idx) => {
        // Wrap requirements lines if needed
        const reqText = `• ${req}`
        const testY = y + (idx * 55)

        ctx.fillText(reqText.length > 80 ? reqText.substring(0, 77) + '...' : reqText, 100, testY)
      })

      // Divider before Footer
      ctx.fillStyle = '#CCCCCC'
      ctx.fillRect(100, 1020, 1000, 2)

      // Call to action
      ctx.fillStyle = '#FA520F'
      ctx.font = 'bold 26px monospace'
      ctx.fillText('APPLY NOW AT: ANTERA.CO.TZ/CAREERS', 100, 1080)

      ctx.fillStyle = '#555555'
      ctx.font = '20px monospace'
      ctx.fillText('Scan or visit to learn more & apply', 100, 1115)

      // Save canvas as image download
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Antera_Hiring_${job.slug}.png`
      link.href = dataUrl
      link.click()
    }

    img.onerror = () => {
      // Fallback if logo fails to load (draw placeholder instead)
      ctx.fillStyle = '#FA520F'
      ctx.fillRect(100, 100, 80, 80)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 40px Arial'
      ctx.fillText('A', 125, 155)

      // Trigger the load event logic directly as fallback
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 32px monospace'
      ctx.fillText('ANTERA CAREERS', 200, 150)

      ctx.fillStyle = '#FA520F'
      ctx.font = 'bold 24px monospace'
      ctx.fillText('WE ARE HIRING!', 200, 185)

      ctx.fillStyle = '#000000'
      ctx.fillRect(100, 220, 1000, 8)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 56px Arial, Helvetica, sans-serif'
      ctx.fillText(job.title, 100, 320)

      // Meta attributes box
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(100, 400, 1000, 120)
      ctx.lineWidth = 6
      ctx.strokeStyle = '#000000'
      ctx.strokeRect(100, 400, 1000, 120)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(`DEPARTMENT: ${job.department.toUpperCase()}`, 130, 445)
      ctx.fillText(`LOCATION: ${job.location.toUpperCase()}`, 130, 485)
      ctx.fillText(`TYPE: ${job.employment_type.toUpperCase()}`, 650, 445)
      if (job.experience_level) {
        ctx.fillText(`LEVEL: ${job.experience_level.toUpperCase()}`, 650, 485)
      }

      // Requirements list
      ctx.fillStyle = '#FA520F'
      ctx.font = 'bold 28px monospace'
      ctx.fillText('KEY REQUIREMENTS & SKILLS', 100, 600)

      ctx.fillStyle = '#000000'
      ctx.font = '24px Arial, sans-serif'
      const requirements = job.requirements && job.requirements.length > 0 ? job.requirements.slice(0, 4) : ['General qualifications'];
      requirements.forEach((req, idx) => {
        ctx.fillText(`• ${req}`, 100, 660 + (idx * 55))
      })

      ctx.fillStyle = '#CCCCCC'
      ctx.fillRect(100, 1020, 1000, 2)

      ctx.fillStyle = '#FA520F'
      ctx.font = 'bold 26px monospace'
      ctx.fillText('APPLY NOW AT: ANTERA.CO.TZ/CAREERS', 100, 1080)

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Antera_Hiring_${job.slug}.png`
      link.href = dataUrl
      link.click()
    }
  }

  // Handle direct file uploads to Supabase storage bucket
  const uploadFile = async (file: File, bucket: string = 'post-images'): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `applications/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeFile(file)

    try {
      setIsUploadingResume(true)
      const url = await uploadFile(file)
      setResumeUrl(url)
      toast.success('Resume uploaded successfully!')
    } catch (err: any) {
      toast.error('File storage upload failed, but you can still submit a URL link below instead. Error: ' + err.message)
    } finally {
      setIsUploadingResume(false)
    }
  }

  const handleMotivationFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMotivationFile(file)

    try {
      setIsUploadingMotivation(true)
      const url = await uploadFile(file)
      setMotivationLetterUrl(url)
      toast.success('Motivation letter uploaded successfully!')
    } catch (err: any) {
      toast.error('File storage upload failed, but you can still submit a URL link or cover letter instead. Error: ' + err.message)
    } finally {
      setIsUploadingMotivation(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job) return

    // Require either uploaded file url or typed text url
    const finalResume = resumeUrl || 'https://example.com/uploaded_resume.pdf'
    const finalMotivation = motivationLetterUrl || ''

    try {
      setSubmitting(true)
      const { error: applyErr } = await supabase
        .from('job_applications')
        .insert([{
          job_id: job.id,
          full_name: fullName,
          email,
          phone,
          linkedin_url: linkedinUrl,
          portfolio_url: portfolioUrl,
          cover_letter: coverLetter,
          resume_url: finalResume,
          motivation_letter_url: finalMotivation,
          status: 'Pending'
        }])

      if (applyErr) throw applyErr

      toast.success('Application submitted successfully! Our recruiters will reach out to you soon.')
      setShowApplyModal(false)
      // Reset form
      setFullName('')
      setEmail('')
      setPhone('')
      setLinkedinUrl('')
      setPortfolioUrl('')
      setCoverLetter('')
      setResumeUrl('')
      setResumeFile(null)
      setMotivationLetterUrl('')
      setMotivationFile(null)
    } catch (err: any) {
      toast.error('Failed to submit application: ' + err.message)
    } finally {
      setSubmitting(false)
    }
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

  if (error || !job) {
    return (
      <div className="bg-[#FAFAF8] text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-neutral-700">Job vacancy not found</p>
          <Link to="/jobs" className="text-[#FA520F] font-mono text-sm mt-4 inline-block hover:underline">
            ← back to jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-[#FAFAF8] text-black min-h-screen selection:bg-[#FA520F] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/jobs" className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors mb-12">
            <ArrowLeft className="h-4 w-4" />
            back to jobs
          </Link>

          {/* Header */}
          <header className="mb-16">
            {/* Department & Employment Type */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-black text-white border border-black">
                {job.department}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-[#FA520F] text-white border border-[#FA520F]">
                {job.employment_type}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-[-0.03em] leading-[0.95] text-black mb-8">
              {job.title}
            </h1>

            {/* Key info panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-neutral-300 py-6 text-[10px] font-mono font-bold uppercase text-neutral-700">
              <div className="space-y-1">
                <span className="text-neutral-400 block font-normal">Location</span>
                <span className="flex items-center gap-1 text-black">
                  <MapPin className="h-3.5 w-3.5 text-[#FA520F]" />
                  {job.location}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 block font-normal">Experience Level</span>
                <span className="flex items-center gap-1 text-black">
                  <Briefcase className="h-3.5 w-3.5 text-[#FA520F]" />
                  {job.experience_level || 'Not Specified'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 block font-normal">Salary Range</span>
                <span className="flex items-center gap-1 text-black">
                  <DollarSign className="h-3.5 w-3.5 text-[#FA520F]" />
                  {job.salary_range || 'Competitive'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 block font-normal">Total Views</span>
                <span className="flex items-center gap-1 text-black">
                  <Eye className="h-3.5 w-3.5 text-[#FA520F]" />
                  {job.views} Views
                </span>
              </div>
            </div>
          </header>

          {/* Description Section */}
          <div className="prose prose-neutral max-w-none mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-black">Role Description</h2>
            <p className="text-[18px] leading-relaxed text-neutral-700 whitespace-pre-line mb-8">
              {job.description}
            </p>

            {/* Requirements Bullet points */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-black">Key Requirements & Skills</h2>
                <ul className="list-disc pl-6 space-y-2 text-[17px] text-neutral-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications Bullet points */}
            {job.qualifications && job.qualifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-black">Preferred Qualifications</h2>
                <ul className="list-disc pl-6 space-y-2 text-[17px] text-neutral-700">
                  {job.qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits Bullet points */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-black">What We Offer (Benefits)</h2>
                <ul className="list-disc pl-6 space-y-2 text-[17px] text-neutral-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Call-To-Action */}
          <div className="border-4 border-black bg-white p-8 mb-16 shadow-[6px_6px_0px_0px_#000000] relative">
            <div className="absolute inset-0 border-t-2 border-l-2 border-[#FA520F]/20 pointer-events-none" />
            <h3 className="text-3xl font-bold tracking-tight mb-2">Interested in this vacancy?</h3>
            <p className="text-neutral-600 mb-6 font-mono text-sm">Join Antera and help us pioneer native Swahili language models!</p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="relative border-4 border-black bg-[#FA520F] px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              Apply for this position
            </button>
          </div>

          {/* Share/Download Poster Footer */}
          <footer className="border-t border-neutral-300 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Poster Creation Download option */}
              <button
                onClick={downloadPoster}
                className="relative border-4 border-black bg-[#FA520F] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Download Beautiful Poster
              </button>

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
                    X
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
                <button
                  onClick={() => share('facebook')}
                  className="relative border-4 border-black bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-black hover:text-white"
                >
                  <span className="flex items-center gap-1.5">
                    Facebook
                  </span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#FAFAF8] border-4 border-black p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-300">
              <h3 className="text-2xl font-bold tracking-tight">Apply for {job.title}</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 border-2 border-neutral-300 text-neutral-700 hover:border-black hover:text-black transition-all font-mono"
              >
                CLOSE
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full border-2 border-neutral-300 p-2 text-sm focus:border-black outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full border-2 border-neutral-300 p-2 text-sm focus:border-black outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border-2 border-neutral-300 p-2 text-sm focus:border-black outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full border-2 border-neutral-300 p-2 text-sm focus:border-black outline-none font-mono"
                  />
                </div>
              </div>

              {/* PDF Document Uploads & Link Fallback Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-neutral-300">
                {/* Resume Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-[#FA520F]" />
                    Upload Resume PDF *
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-1.5 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase hover:bg-neutral-100 transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      {resumeFile ? resumeFile.name.substring(0, 15) + '...' : 'Choose File'}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeFileChange}
                        disabled={isUploadingResume}
                      />
                    </label>
                    {isUploadingResume && <span className="text-[9px] font-mono animate-pulse">Uploading...</span>}
                  </div>
                  <input
                    type="url"
                    placeholder="Or enter PDF URL directly"
                    value={resumeUrl}
                    onChange={e => setResumeUrl(e.target.value)}
                    required
                    className="w-full border-2 border-neutral-300 p-2 text-xs focus:border-black outline-none font-mono"
                  />
                </div>

                {/* Motivation Letter Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-[#FA520F]" />
                    Upload Motivation Letter PDF
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-1.5 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase hover:bg-neutral-100 transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      {motivationFile ? motivationFile.name.substring(0, 15) + '...' : 'Choose File'}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleMotivationFileChange}
                        disabled={isUploadingMotivation}
                      />
                    </label>
                    {isUploadingMotivation && <span className="text-[9px] font-mono animate-pulse">Uploading...</span>}
                  </div>
                  <input
                    type="url"
                    placeholder="Or enter PDF URL directly"
                    value={motivationLetterUrl}
                    onChange={e => setMotivationLetterUrl(e.target.value)}
                    className="w-full border-2 border-neutral-300 p-2 text-xs focus:border-black outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Portfolio URL / Website</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full border-2 border-neutral-300 p-2 text-sm focus:border-black outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Cover Letter (Optional comments / Pitch)</label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-neutral-300 p-2 text-sm focus:border-black outline-none font-mono"
                  placeholder="Tell us why you are a great fit for this job!"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="border-2 border-black bg-transparent px-5 py-2 font-mono text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || isUploadingResume || isUploadingMotivation}
                  className="border-2 border-black bg-[#FA520F] text-white px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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