-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL, -- e.g., "Dar es Salaam, Tanzania", "Remote", "Dodoma, Tanzania"
  employment_type TEXT NOT NULL, -- e.g., "Full-time", "Part-time", "Contract", "Internship"
  experience_level TEXT, -- e.g., "Junior", "Mid-level", "Senior", "Lead"
  salary_range TEXT, -- e.g., "TSh 1,500,000 - 2,500,000"
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  qualifications TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_jobs_published ON jobs(published);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);

-- Job Applications table
CREATE TABLE job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  motivation_letter_url TEXT,
  cover_letter TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  status TEXT DEFAULT 'Pending', -- e.g., "Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (for admin & recruiters)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helper functions for incrementing views
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs SET views = views + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published jobs" ON jobs FOR SELECT USING (published = true);
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admin can do anything on jobs" ON jobs FOR ALL USING (auth.jwt() ->> 'email' = 'admin@example.com');
CREATE POLICY "Admin can do anything on job_applications" ON job_applications FOR ALL USING (auth.jwt() ->> 'email' = 'admin@example.com');
CREATE POLICY "Public can insert applications" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Starter Content
INSERT INTO jobs (slug, title, department, location, employment_type, experience_level, salary_range, description, requirements, qualifications, benefits, tags, published) VALUES
('full-stack-engineer-swahili-ai', 'Full-Stack Software Engineer (Swahili AI)', 'Engineering', 'Dar es Salaam, Tanzania (Hybrid)', 'Full-time', 'Mid-to-Senior', 'TSh 2,500,000 - 4,000,000', 'We are looking for a skilled Full-Stack Engineer to build and scale user interfaces and robust APIs for our Swahili Large Language Model products. You will work on integrating high-performance AI models with web interfaces and building tools for low-resource language processing.', ARRAY['3+ years of experience with React, TypeScript, Node.js and Python', 'Familiarity with Supabase, PostgreSQL or related SQL databases', 'Experience building and scaling REST or GraphQL APIs', 'Basic understanding of machine learning models and API integration'], ARRAY['BSc in Computer Science, Software Engineering or equivalent experience', 'Strong portfolio of projects demonstrating full-stack expertise', 'Excellent written and verbal communication skills in Swahili and English'], ARRAY['Competitive salary & hybrid workspace flexibility', 'Access to state-of-the-art AI research resources and hardware', 'Health insurance and professional development stipend'], ARRAY['React', 'TypeScript', 'Python', 'AI'], true),
('ai-research-scientist-llm', 'AI Research Scientist (LLMs & NLP)', 'Research & Development', 'Dar es Salaam, Tanzania', 'Full-time', 'Senior', 'Negotiable', 'Join the R&D team at Antera as an AI Research Scientist specializing in NLP. You will lead the fine-tuning, training, and evaluations of Swahili and other low-resource language LLMs, working with LoRA, QLoRA, and custom tokenizers.', ARRAY['Strong experience in NLP, training LLMs, or transformer-based architectures', 'Proficient in Python, PyTorch, Hugging Face Transformers, and DeepSpeed', 'Experience with fine-tuning techniques (LoRA, QLoRA, Prefix Tuning)', 'Knowledge of data curation and dataset construction for low-resource languages'], ARRAY['MSc or PhD in Artificial Intelligence, Computer Science, or related quantitative field', 'Published papers in top AI conferences (ACL, EMNLP, NeurIPS, etc.) is a plus'], ARRAY['Flexible remote work options', 'Latest generation GPU computing resources', 'Generous equity options'], ARRAY['Python', 'PyTorch', 'LLMs', 'Research'], true);
