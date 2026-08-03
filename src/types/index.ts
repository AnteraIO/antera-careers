export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string | null
  tags: string[]
  views: number
  upvotes: number
  downvotes: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  resume_url: string | null
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
