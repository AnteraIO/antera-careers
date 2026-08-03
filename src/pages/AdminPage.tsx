import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { Job, JobApplication } from '@/types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, ClipboardList, Briefcase, Mail, Phone, ExternalLink } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs')
  const [, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null)

  // Auth Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user && isAdmin) {
      fetchJobs()
      fetchApplications()
    }
  }, [user, isAdmin])

  const fetchJobs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch jobs')
    } else {
      setJobs(data || [])
    }
    setLoading(false)
  }

  const fetchApplications = async () => {
    // Select application details along with job title
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, jobs(title)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch applications')
    } else {
      const formattedApps = (data || []).map((app: any) => ({
        ...app,
        job_title: app.jobs?.title || 'Unknown Job'
      }))
      setApplications(formattedApps)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged in successfully')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingJob) return

    const jobData = {
      ...editingJob,
      updated_at: new Date().toISOString()
    }

    let error
    if (editingJob.id) {
      const { error: err } = await supabase.from('jobs').update(jobData).eq('id', editingJob.id)
      error = err
    } else {
      const { error: err } = await supabase.from('jobs').insert([jobData])
      error = err
    }

    if (error) {
      toast.error('Failed to save job vacancy: ' + error.message)
    } else {
      toast.success('Job vacancy saved successfully')
      setEditingJob(null)
      fetchJobs()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete job')
    } else {
      toast.success('Job opening deleted successfully')
      fetchJobs()
    }
  }

  const handleApplicationStatus = async (appId: string, status: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', appId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Application status updated to ${status}`)
      fetchApplications()
    }
  }

  const handleTitleChange = (title: string) => {
    setEditingJob(prev => ({
      ...prev,
      title,
      slug: prev?.id ? prev.slug : slugify(title)
    }))
  }

  if (authLoading) return <div className="text-center py-20 font-mono text-neutral-700">Loading...</div>

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 md:px-12">
        <Card>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-[#FA520F] hover:bg-black text-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black">
                Sign In
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 md:px-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-normal tracking-tight text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-neutral-500">
              You are logged in as <span className="font-bold text-black">{user.email}</span>,
              but you do not have administrative privileges.
            </p>
            <button onClick={() => supabase.auth.signOut()} className="w-full bg-white hover:bg-black text-black hover:text-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-black">
              Sign Out
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.03em] leading-[0.95]">
            Admin Dashboard
          </h1>
          <p className="text-[10px] font-mono font-bold uppercase text-neutral-700 mt-2">
            Careers Board Management
          </p>
        </div>

        {/* Tab Switcher & New Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border-2 border-neutral-200 font-mono text-xs font-bold uppercase">
            <button
              onClick={() => { setActiveTab('jobs'); setEditingJob(null); }}
              className={`px-4 py-2 flex items-center gap-1.5 transition-colors duration-200 ${
                activeTab === 'jobs' ? 'bg-[#FA520F] text-white' : 'bg-transparent text-black hover:bg-neutral-100'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Jobs ({jobs.length})
            </button>
            <button
              onClick={() => { setActiveTab('applications'); setEditingJob(null); }}
              className={`px-4 py-2 flex items-center gap-1.5 transition-colors duration-200 ${
                activeTab === 'applications' ? 'bg-[#FA520F] text-white' : 'bg-transparent text-black hover:bg-neutral-100'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              Applications ({applications.length})
            </button>
          </div>

          {!editingJob && activeTab === 'jobs' && (
            <button
              onClick={() => setEditingJob({
                title: '',
                slug: '',
                department: 'Engineering',
                location: 'Dar es Salaam, Tanzania',
                employment_type: 'Full-time',
                experience_level: 'Mid-level',
                salary_range: '',
                description: '',
                requirements: [],
                qualifications: [],
                benefits: [],
                tags: [],
                published: false
              })}
              className="bg-[#FA520F] hover:bg-black text-white px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Vacancy
            </button>
          )}
        </div>
      </div>

      {editingJob ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-neutral-200">
            <CardTitle className="text-2xl font-normal tracking-tight">{editingJob.id ? 'Edit Job Opening' : 'Post New Job Vacancy'}</CardTitle>
            <button onClick={() => setEditingJob(null)} className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors">
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Job Title *</label>
                    <Input value={editingJob.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Slug *</label>
                      <Input value={editingJob.slug} onChange={(e) => setEditingJob(prev => ({ ...prev, slug: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Department *</label>
                      <Input value={editingJob.department} onChange={(e) => setEditingJob(prev => ({ ...prev, department: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Location *</label>
                      <Input value={editingJob.location} onChange={(e) => setEditingJob(prev => ({ ...prev, location: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Employment Type *</label>
                      <Input value={editingJob.employment_type || ''} placeholder="e.g. Full-time, Internship" onChange={(e) => setEditingJob(prev => ({ ...prev, employment_type: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Experience Level</label>
                      <Input value={editingJob.experience_level || ''} placeholder="e.g. Junior, Mid-level" onChange={(e) => setEditingJob(prev => ({ ...prev, experience_level: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Salary Range</label>
                      <Input value={editingJob.salary_range || ''} placeholder="e.g. TSh 2,500,000 - 4,000,000" onChange={(e) => setEditingJob(prev => ({ ...prev, salary_range: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Tags / Skills (comma separated)</label>
                    <Input
                      value={editingJob.tags?.join(', ')}
                      placeholder="React, TypeScript, LLM"
                      onChange={(e) => setEditingJob(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="published"
                      checked={editingJob.published}
                      onChange={(e) => setEditingJob(prev => ({ ...prev, published: e.target.checked }))}
                      className="w-4 h-4 border-2 border-black"
                    />
                    <label htmlFor="published" className="text-[10px] font-mono font-bold uppercase text-neutral-700">Publish Immediately</label>
                  </div>
                </div>

                {/* Right Side description & lists */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Job Description *</label>
                    <Textarea
                      value={editingJob.description}
                      onChange={(e) => setEditingJob(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Requirements (one per line)</label>
                    <Textarea
                      value={editingJob.requirements?.join('\n')}
                      placeholder="e.g. 3+ years experience&#10;Familiarity with NLP"
                      onChange={(e) => setEditingJob(prev => ({ ...prev, requirements: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) }))}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Preferred Qualifications (one per line)</label>
                    <Textarea
                      value={editingJob.qualifications?.join('\n')}
                      placeholder="e.g. Degree in CS&#10;Published AI papers"
                      onChange={(e) => setEditingJob(prev => ({ ...prev, qualifications: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Benefits & Perks (one per line)</label>
                    <Textarea
                      value={editingJob.benefits?.join('\n')}
                      placeholder="e.g. Hybrid workplace&#10;Health insurance"
                      onChange={(e) => setEditingJob(prev => ({ ...prev, benefits: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) }))}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setEditingJob(null)} className="bg-white hover:bg-neutral-100 text-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black">
                  Cancel
                </button>
                <button type="submit" className="bg-[#FA520F] hover:bg-black text-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save vacancy
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 gap-0 border border-neutral-200 bg-white">
          {jobs.map((job, i) => (
            <div key={job.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 ${i !== jobs.length - 1 ? 'border-b border-neutral-200' : ''} hover:bg-neutral-50/50 transition-colors gap-4`}>
              <div className="flex items-start gap-4">
                <div className={`mt-1.5 ${job.published ? 'text-[#FA520F]' : 'text-neutral-400'}`}>
                  {job.published ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-lg tracking-tight">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-neutral-500 mt-1">
                    <span className="font-bold text-neutral-700">{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.employment_type}</span>
                    <span>•</span>
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingJob(job)} className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(job.id)} className="p-2 border-2 border-neutral-200 text-red-400 hover:border-red-600 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-mono text-neutral-700">No vacancies yet. Get started and post a new job opening!</p>
            </div>
          )}
        </div>
      ) : (
        /* Applications Tab view */
        <div className="grid grid-cols-1 gap-0 border border-neutral-200 bg-white">
          {applications.map((app, i) => (
            <div key={app.id} className={`p-6 ${i !== applications.length - 1 ? 'border-b border-neutral-200' : ''} hover:bg-neutral-50/50 transition-colors`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#FA520F] block mb-1">
                    Application for: {app.job_title}
                  </span>
                  <h3 className="font-medium text-xl tracking-tight text-black">{app.full_name}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-600 mt-1.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-neutral-400" />
                      {app.email}
                    </span>
                    {app.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-neutral-400" />
                        {app.phone}
                      </span>
                    )}
                    <span>Applied on: {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Status Switcher pill */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase text-neutral-500">Status:</span>
                  <select
                    value={app.status}
                    onChange={(e) => handleApplicationStatus(app.id, e.target.value)}
                    className="border-2 border-neutral-300 bg-white px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider text-black focus:outline-none focus:border-[#FA520F] hover:border-black transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
              </div>

              {/* Cover Letter Pitch */}
              {app.cover_letter && (
                <div className="border-l-4 border-neutral-300 pl-4 py-1.5 bg-neutral-50/50 mb-4 text-left">
                  <p className="text-xs font-mono text-neutral-500 font-bold uppercase mb-1">Recruiter Pitch / Cover Letter:</p>
                  <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">{app.cover_letter}</p>
                </div>
              )}

              {/* Action Links (Resume, LinkedIn, Motivation/Cover letter, etc) */}
              <div className="flex flex-wrap gap-2.5">
                {app.resume_url && (
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#FA520F] hover:bg-black text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black"
                  >
                    View Resume PDF
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {app.motivation_letter_url && (
                  <a
                    href={app.motivation_letter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#FA520F] hover:bg-black text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black"
                  >
                    View Motivation Letter PDF
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {app.linkedin_url && (
                  <a
                    href={app.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border-2 border-neutral-300 hover:border-black text-neutral-700 hover:text-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200"
                  >
                    LinkedIn Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {app.portfolio_url && (
                  <a
                    href={app.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border-2 border-neutral-300 hover:border-black text-neutral-700 hover:text-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200"
                  >
                    Portfolio / Github
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-mono text-neutral-700">No applications received yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}