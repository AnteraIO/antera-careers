import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { BlogPage } from '@/pages/BlogPage'
import { PostPage } from '@/pages/PostPage'
import { ResumePage } from '@/pages/ResumePage'
import { AdminPage } from '@/pages/AdminPage'
import { Toaster } from 'sonner'

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="post/:slug" element={<PostPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<div className="text-center py-20 text-2xl">404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App