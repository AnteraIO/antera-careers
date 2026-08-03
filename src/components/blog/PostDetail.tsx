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

  const downloadPoster = () => {
    if (!job) return

    const jobData = job // Store job reference

    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, 800, 1000)

    // Orange border
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 20
    ctx.strokeRect(10, 10, 780, 980)

    // Decorative circles
    ctx.fillStyle = '#f97316'
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.arc(700, 880, 80, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.arc(80, 160, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    const img = new Image()
    img.src = '/antera-logo.jpeg'
    img.onload = () => {
      drawPoster(ctx, img, jobData)
    }
    img.onerror = () => {
      drawPoster(ctx, null, jobData)
    }

    function drawPoster(ctx: CanvasRenderingContext2D, logoImg: HTMLImageElement | null, jobData: typeof job) {
      if (!jobData) return

      // Top Branding Section
      if (logoImg) {
        ctx.drawImage(logoImg, 40, 40, 55, 55)
      }

      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 20px Inter, system-ui, sans-serif'
      ctx.textBaseline = 'top'
      ctx.fillText('ANTERA', 110, 45)

      ctx.textAlign = 'right'
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 13px Inter, system-ui, sans-serif'
      ctx.fillText('HIRING NOW', 760, 45)
      ctx.textAlign = 'left'

      // Hero Title Section
      ctx.fillStyle = '#64748b'
      ctx.font = '22px Inter, system-ui, sans-serif'
      ctx.fillText('is looking for a', 40, 120)

      ctx.fillStyle = '#f97316'
      ctx.font = '22px Inter, system-ui, sans-serif'
      const jobTypeText = jobData.employment_type || 'Full Time'
      ctx.fillText(jobTypeText, 40 + ctx.measureText('is looking for a ').width, 120)

      // Job Title
      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 56px Inter, system-ui, sans-serif'
      ctx.textBaseline = 'top'

      const words = jobData.title.split(' ')
      let line = ''
      let y = 170
      const maxWidth = 700
      const lineHeight = 70

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '
        let metrics = ctx.measureText(testLine)
        let testWidth = metrics.width
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 40, y)
          line = words[n] + ' '
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 40, y)

      const titleY = y + 10

      // Requirements Section
      const reqStartY = titleY + 70
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 12px Inter, system-ui, sans-serif'
      ctx.textBaseline = 'top'
      ctx.fillText('KEY REQUIREMENTS', 40, reqStartY)

      const requirements = jobData.requirements && jobData.requirements.length > 0
        ? jobData.requirements.slice(0, 6)
        : ['Strong programming skills', 'Effective communication', 'Problem solving capabilities']

      let reqY = reqStartY + 35
      ctx.fillStyle = '#475569'
      ctx.font = '15px Inter, system-ui, sans-serif'

      requirements.forEach((req: string, idx: number) => {
        const reqText = `✓ ${req}`
        const maxReqWidth = 700
        
        if (ctx.measureText(reqText).width > maxReqWidth) {
          const truncated = reqText.substring(0, 55) + '...'
          ctx.fillText(truncated, 40, reqY + (idx * 28))
        } else {
          ctx.fillText(reqText, 40, reqY + (idx * 28))
        }
      })

      // Qualifications Section
      const qualStartY = reqY + (requirements.length * 28) + 20
      const qualifications = jobData.qualifications && jobData.qualifications.length > 0
        ? jobData.qualifications.slice(0, 4)
        : []

      if (qualifications.length > 0) {
        ctx.fillStyle = '#94a3b8'
        ctx.font = 'bold 12px Inter, system-ui, sans-serif'
        ctx.textBaseline = 'top'
        ctx.fillText('PREFERRED QUALIFICATIONS', 40, qualStartY)

        let qualY = qualStartY + 35
        ctx.fillStyle = '#475569'
        ctx.font = '15px Inter, system-ui, sans-serif'

        qualifications.forEach((qual: string, idx: number) => {
          const qualText = `✓ ${qual}`
          const maxQualWidth = 700
          
          if (ctx.measureText(qualText).width > maxQualWidth) {
            const truncated = qualText.substring(0, 55) + '...'
            ctx.fillText(truncated, 40, qualY + (idx * 28))
          } else {
            ctx.fillText(qualText, 40, qualY + (idx * 28))
          }
        })

        const gridY = qualY + (qualifications.length * 28) + 40
        drawFooterGrid(ctx, gridY, jobData)
      } else {
        const gridY = reqY + (requirements.length * 28) + 40
        drawFooterGrid(ctx, gridY, jobData)
      }

      function drawFooterGrid(ctx: CanvasRenderingContext2D, gridY: number, jobData: typeof job) {
        if (!jobData) return
        
        const gridHeight = 110

        // Grid background
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        ctx.roundRect(40, gridY, 720, gridHeight, 16)
        ctx.fill()

        // Grid items with better spacing
        const items = [
          { label: 'SALARY', value: jobData.salary_range || 'Competitive', color: '#f97316' },
          { label: 'LOCATION', value: jobData.location || 'Tanzania' },
          { label: 'TYPE', value: jobData.employment_type || 'Full Time' },
          { label: 'DEADLINE', value: 'Open' }
        ]

        const itemWidth = 720 / 4
        items.forEach((item, idx) => {
          const x = 40 + (idx * itemWidth) + 20

          // Label
          ctx.fillStyle = '#94a3b8'
          ctx.font = 'bold 10px Inter, system-ui, sans-serif'
          ctx.textBaseline = 'top'
          ctx.fillText(item.label, x, gridY + 16)

          // Value - with better truncation
          ctx.fillStyle = item.color || '#0f172a'
          ctx.font = 'bold 17px Inter, system-ui, sans-serif'
          let valueText = item.value || 'Not specified'
          if (valueText.length > 22) {
            valueText = valueText.substring(0, 20) + '...'
          }
          ctx.fillText(valueText, x, gridY + 38)
        })

        // Bottom CTA Strip
        ctx.fillStyle = '#94a3b8'
        ctx.font = '13px Inter, system-ui, sans-serif'
        ctx.textBaseline = 'top'

        ctx.textAlign = 'left'
        ctx.fillStyle = '#0f172a'
        ctx.font = '13px Inter, system-ui, sans-serif'
        ctx.fillText('Apply at: careers.antera.co.tz', 40, gridY + gridHeight + 28)

        ctx.textAlign = 'right'
        ctx.fillStyle = '#f97316'
        ctx.font = 'bold 15px Inter, system-ui, sans-serif'
        ctx.fillText('APPLY NOW →', 760, gridY + gridHeight + 28)
        ctx.textAlign = 'left'
      }

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Antera_Hiring_${jobData.slug}.png`
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

    if (!resumeUrl) {
      toast.error('Please upload your resume PDF to submit the application.')
      return
    }

    const finalResume = resumeUrl
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
          <Link to="/jobs" className="group inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors mb-12">
            <ArrowLeft className="h-4 w-4" />
            back to jobs
          </Link>

          <header className="mb-16">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-black text-white border border-black">
                {job.department}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-[#FA520F] text-white border border-[#FA520F]">
                {job.employment_type}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-[-0.03em] leading-[0.95] text-black mb-8">
              {job.title}
            </h1>

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

          <div className="prose prose-neutral max-w-none mb-16">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-black">Role Description</h2>
            <p className="text-[18px] leading-relaxed text-neutral-700 whitespace-pre-line mb-8">
              {job.description}
            </p>

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

          <div className="border-2 border-neutral-200 bg-white p-8 mb-16">
            <h3 className="text-3xl font-bold tracking-tight mb-2">Interested in this vacancy?</h3>
            <p className="text-neutral-600 mb-6 font-mono text-sm">Join Antera and help us build the future together!</p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-[#FA520F] hover:bg-black text-white px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black"
            >
              Apply for this position
            </button>
          </div>

          <footer className="border-t border-neutral-300 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <button
                onClick={downloadPoster}
                className="bg-[#FA520F] hover:bg-black text-white px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Download Poster
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5" />
                  share:
                </span>
                <button 
                  onClick={() => share('twitter')}
                  className="bg-white hover:bg-black text-black hover:text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black"
                >
                  <span className="flex items-center gap-1.5">
                    <Twitter className="h-3 w-3" />
                    X
                  </span>
                </button>
                <button 
                  onClick={() => share('linkedin')}
                  className="bg-white hover:bg-black text-black hover:text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black"
                >
                  <span className="flex items-center gap-1.5">
                    <Linkedin className="h-3 w-3" />
                    linkedin
                  </span>
                </button>
                <button 
                  onClick={() => share('whatsapp')}
                  className="bg-white hover:bg-black text-black hover:text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-3 w-3" />
                    whatsapp
                  </span>
                </button>
                <button
                  onClick={() => share('facebook')}
                  className="bg-white hover:bg-black text-black hover:text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black"
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

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#FAFAF8] border-2 border-neutral-200 p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-300">
              <h3 className="text-2xl font-bold tracking-tight">Apply for {job.title}</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 border-2 border-neutral-300 text-neutral-700 hover:border-black hover:text-black transition-colors font-mono text-xs font-bold uppercase"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-neutral-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-[#FA520F]" />
                    Upload Resume PDF *
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 border-2 border-neutral-300 hover:border-black bg-white px-3 py-3 font-mono text-[10px] font-bold uppercase transition-colors text-center">
                      <Upload className="h-4 w-4 text-[#FA520F]" />
                      {resumeFile ? resumeFile.name : 'Choose Resume PDF'}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeFileChange}
                        disabled={isUploadingResume}
                        required={!resumeUrl}
                      />
                    </label>
                    {isUploadingResume && <span className="text-[10px] font-mono animate-pulse text-neutral-600 text-center">Uploading Resume...</span>}
                    {resumeUrl && <span className="text-[10px] font-mono text-green-600 font-bold text-center">✓ Resume Uploaded Successfully</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-[#FA520F]" />
                    Upload Motivation Letter PDF
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 border-2 border-neutral-300 hover:border-black bg-white px-3 py-3 font-mono text-[10px] font-bold uppercase transition-colors text-center">
                      <Upload className="h-4 w-4 text-[#FA520F]" />
                      {motivationFile ? motivationFile.name : 'Choose Motivation Letter PDF'}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleMotivationFileChange}
                        disabled={isUploadingMotivation}
                      />
                    </label>
                    {isUploadingMotivation && <span className="text-[10px] font-mono animate-pulse text-neutral-600 text-center">Uploading Motivation Letter...</span>}
                    {motivationLetterUrl && <span className="text-[10px] font-mono text-green-600 font-bold text-center">✓ Motivation Letter Uploaded Successfully</span>}
                  </div>
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
                  className="bg-white hover:bg-neutral-100 text-black px-5 py-2 font-mono text-xs font-bold uppercase transition-colors duration-200 border-2 border-neutral-300 hover:border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || isUploadingResume || isUploadingMotivation}
                  className="bg-[#FA520F] hover:bg-black text-white px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 bg-white hover:bg-black text-black hover:text-white p-3 border-2 border-neutral-300 hover:border-black transition-colors duration-200 z-50"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </article>
  )
}