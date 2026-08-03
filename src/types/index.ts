export interface Job {
  id: string
  slug: string
  title: string
  department: string
  location: string
  employment_type: string
  experience_level: string | null
  salary_range: string | null
  description: string
  requirements: string[]
  qualifications: string[]
  benefits: string[]
  tags: string[]
  views: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  full_name: string
  email: string
  phone: string | null
  resume_url: string | null
  motivation_letter_url: string | null
  cover_letter: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  status: string
  created_at: string
  job_title?: string // Join helper
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  email: string | null
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
}
