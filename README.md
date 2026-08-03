# Welcome to Antera Careeer.

# 🛠️ Tech Stack & Key Features

* **Frontend:** React 18, TypeScript 5, Vite, Tailwind CSS 3, Framer Motion, Lucide icons.
* **State Management:** Zustand 4 (lightweight, reactive store).
* **Backend & Database:** Supabase (PostgreSQL, Realtime database, Auth, and Storage).
* **Social Sharing:** Instant pre-configured links for X (Twitter), LinkedIn, WhatsApp, and Facebook.
* **Dynamic Canvas Poster Engine:** Generates high-resolution hiring posters dynamically on an HTML5 canvas featuring the logo, job details, and requirements. Downloadeable as a `.png` file.
* **Applicant Tracking System (ATS):** Applicants can input their information and upload PDF resumes & motivation letters directly to the cloud.

# 📦 Supabase Storage Buckets Setup

To allow candidates to upload their documents and to handle recruitment media, you must set up a Supabase Storage bucket in your project dashboard.

1. Navigate to **Storage** in your Supabase Console.
2. Click **Create a new bucket**.
3. Name the bucket: `post-images` (Must be lowercase).
4. Set the privacy level to **Public** (This enables sharing recruitment materials, candidate resumes, and cover letters easily with hiring managers via unique public URLs).
5. Add the following storage security policies to allow upload:
   * **Insert Policy:** Allowed for public users (`true`).
   * **Select Policy:** Allowed for public users (`true`).


# 2. Configure Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@example.com
```

# 3. Initialize the Database
Execute the SQL DDL statements found in `schema/schema.sql` inside the **SQL Editor** of your Supabase Console. This will set up the tables, schema triggers, automatic `updated_at` timestamps, RPC increment metrics, and standard security policies.

# 4. Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
```

# 👥 Admin Access Control & Candidate Tracking

* **Login Admin:** Access the administrator login dashboard via the `/admin` path.
* **Credentials:** Log in with any Supabase Auth user that matches your `VITE_ADMIN_EMAIL` environment variable.
* **Dashboard Tab 1 (Jobs):** Allows full CRUD operations (Create, Read, Update, Delete) on vacancies. You can edit requirements or benefits line-by-line and toggling publishing instantly.
* **Dashboard Tab 2 (Applications):** Monitor and review incoming candidates. You can view their uploaded resume PDF, cover letters, and downloaded motivation letter PDFs, and seamlessly advance or reject candidates with a status dropdown selector.

