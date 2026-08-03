import { Download, ExternalLink, Mail, MapPin, Calendar, Briefcase, GraduationCap, Code, Users, Workflow, Github, Globe } from 'lucide-react'

export function ResumePage() {
  return (
    <div className="bg-[#FAFAF8] text-black min-h-screen selection:bg-[#FA520F] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-16 pb-8 border-b border-neutral-200">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-[-0.03em] leading-[0.95]">
                Shadrack Timothy John Mwalyanga
              </h1>
              <p className="text-base md:text-lg text-neutral-500 font-mono">
                Computer Software Engineer and Young Aspiring AI Researcher. Passionate about building scalable software, AI-driven applications, and contributing to open-source projects.
              </p>
              <div className="flex flex-wrap gap-4 text-[10px] font-mono font-bold uppercase text-neutral-700">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Dodoma, Dar es Salaam, Tanzania</span>
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> mwalyangashadrack@gmail.com</span>
              </div>
            </div>
            <a href="/resume.pdf" download="Shadrack_John_Resume.pdf" className="shrink-0">
              <button className="relative border-4 border-black bg-[#FA520F] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center gap-2">
                <Download className="h-4 w-4" />
                download.pdf
              </button>
            </a>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 border-r border-neutral-200">
              {/* About Section */}
              <div className="p-6 md:p-8 border-b border-neutral-200">
                <h2 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-4">
                  <Users className="h-4 w-4" />
                  about
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Hi, My name is Shadrack or Shadrackovsky and freelance systems developer with 4+ years building scalable software and AI-driven
applications for African markets. Focused on low-resource language technology, intelligent recommendation systems, and full-stack
product development. Proficient in Python, React, TypeScript, and Tailwind CSS, with hands-on data engineering experience in
Python and Jupyter Notebook. Founder of ANTERA, an AI research company, and an active open-source contributor.
                </p>
              </div>

              {/* Experience Section */}
              <div className="p-6 md:p-8 border-b border-neutral-200">
                <h2 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-6">
                  <Briefcase className="h-4 w-4" />
                  experience
                </h2>
                <div className="space-y-6">
                  {/* Technical Intern */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                      <h3 className="text-lg font-medium tracking-tight">Technical Intern</h3>
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> July 2024 - October 2024
                      </span>
                    </div>
                    <p className="text-[#FA520F] font-mono text-sm mb-2">Azampay Tanzania, Dar es Salaam</p>

                  </div>

                  {/* Freelance Developer */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                      <h3 className="text-lg font-medium tracking-tight">Freelance Full-Stack Developer</h3>
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 2023 - Present
                      </span>
                    </div>
                    <p className="text-[#FA520F] font-mono text-sm mb-2">Freelancer, Remote</p>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="p-6 md:p-8">
                <h2 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-6">
                  <GraduationCap className="h-4 w-4" />
                  education
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                      <h3 className="text-lg font-medium tracking-tight">BSc in Computer Engineering</h3>
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 2022 - Present
                      </span>
                    </div>
                    <p className="text-[#FA520F] font-mono text-sm mb-1">University of Dodoma (CIVE)</p>
                    <p className="text-neutral-500 text-sm">Specializing in Software Development, Machine Learning, System Engineering.</p>
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                      <h3 className="text-lg font-medium tracking-tight">Diploma in Computer Science</h3>
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 2020 - 2022
                      </span>
                    </div>
                    <p className="text-[#FA520F] font-mono text-sm">College of Information and Communication Technologies (COICT)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="p-6 md:p-8">
              {/* Technical Skills */}
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-4">
                  <Code className="h-4 w-4" />
                  skills
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-700 mb-2">Languages & Frameworks</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'].map(skill => (
                        <span key={skill} className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-black text-white border border-black">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-700 mb-2">AI & Machine Learning</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['LLMs', 'RAG', 'Vector DB', 'LangChain', 'PyTorch', 'Hugging Face', 'Computer Vision'].map(skill => (
                        <span key={skill} className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-black text-white border border-black">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-700 mb-2">Data & Cloud</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['SQL', 'PostgreSQL', 'Azure', 'Docker', 'ETL Pipelines', 'Apache Spark', 'Supabase', 'RabbitMQ', 'Power BI'].map(skill => (
                        <span key={skill} className="text-[9px] font-mono font-bold uppercase px-2 py-1 bg-black text-white border border-black">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

           

            {/* Roadmap */}
<div className="mb-8">
  <h2 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-4">
    <Workflow className="h-4 w-4" />
    roadmap
  </h2>
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-mono">
      <span className="text-[#FA520F] font-bold">Now:</span>
      <span className="text-neutral-500">Scaling Swahili LLM & ANTERA products</span>
    </div>
    <div className="flex justify-between text-xs font-mono">
      <span className="text-[#FA520F] font-bold">Next:</span>
      <span className="text-neutral-500">Fine-tuning pipelines, LoRA/QLoRA at scale</span>
    </div>
    <div className="flex justify-between text-xs font-mono">
      <span className="text-[#FA520F] font-bold">2026:</span>
      <span className="text-neutral-500">Graduate study in AI/Data (Poland)</span>
    </div>
    <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between text-xs font-mono">
      <span className="text-neutral-700 font-bold uppercase">Focus:</span>
      <span className="text-[#FA520F]">Low-resource language AI for Africa</span>
    </div>
  </div>
</div>

              {/* Links */}
              <div>
                <h2 className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-4">
                  <Globe className="h-4 w-4" />
                  links
                </h2>
                <div className="space-y-2">
                  <a href="https://shedysilicon.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono text-neutral-700 hover:text-[#FA520F] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Shadrackovsky
                  </a>

                   <a href="https://antera.co.tz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono text-neutral-700 hover:text-[#FA520F] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Antera
                  </a>
                  <a href="https://github.com/zuck30" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono text-neutral-700 hover:text-[#FA520F] transition-colors">
                    <Github className="h-3.5 w-3.5" /> github
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-[10px] font-mono font-bold uppercase text-neutral-700">English (Fluent), Swahili (Native)</p>
                  <p className="text-[10px] font-mono text-neutral-700 mt-1">Open to remote and onsite opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}