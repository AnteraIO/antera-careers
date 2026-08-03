import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { Post } from '@/types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Upload } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { toast } from 'sonner'
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer'

export function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [_loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Auth Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user && isAdmin) {
      fetchPosts()
    }
  }, [user, isAdmin])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to fetch posts')
    } else {
      setPosts(data || [])
    }
    setLoading(false)
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
    if (!editingPost) return

    const postData = {
      ...editingPost,
      updated_at: new Date().toISOString()
    }

    let error
    if (editingPost.id) {
      const { error: err } = await supabase.from('posts').update(postData).eq('id', editingPost.id)
      error = err
    } else {
      const { error: err } = await supabase.from('posts').insert([postData])
      error = err
    }

    if (error) {
      toast.error('Failed to save post')
    } else {
      toast.success('Post saved successfully')
      setEditingPost(null)
      fetchPosts()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete post')
    } else {
      toast.success('Post deleted')
      fetchPosts()
    }
  }

  const handleTitleChange = (title: string) => {
    setEditingPost(prev => ({
      ...prev,
      title,
      slug: prev?.id ? prev.slug : slugify(title)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath)

      setEditingPost(prev => ({ ...prev, cover_image: publicUrl }))
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message)
    } finally {
      setIsUploading(false)
    }
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
              <button type="submit" className="w-full relative border-4 border-black bg-[#FA520F] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
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
            <button onClick={() => supabase.auth.signOut()} className="w-full relative border-4 border-black bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-black hover:text-white">
              Sign Out
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.03em] leading-[0.95]">
            Admin
          </h1>
          <p className="text-[10px] font-mono font-bold uppercase text-neutral-700 mt-2">
            {posts.length} posts
          </p>
        </div>
        {!editingPost && (
          <button onClick={() => setEditingPost({ title: '', content: '', excerpt: '', tags: [], published: false, slug: '' })} className="relative border-4 border-black bg-[#FA520F] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </button>
        )}
      </div>

      {editingPost ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-normal tracking-tight">{editingPost.id ? 'Edit Post' : 'Create New Post'}</CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="relative border-4 border-black bg-transparent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-black hover:text-white"
                type="button"
              >
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <button onClick={() => setEditingPost(null)} className="p-2 border-4 border-black text-neutral-700 hover:border-black hover:text-black transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {previewMode ? (
                <div className="space-y-8">
                  <div className="aspect-video w-full max-h-64 border border-neutral-200 overflow-hidden">
                    {editingPost.cover_image ? (
                      <img src={editingPost.cover_image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-700 font-mono text-sm">No Cover Image</div>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-normal tracking-tight">{editingPost.title}</h1>
                  <MarkdownRenderer content={editingPost.content || ''} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Title</label>
                      <Input value={editingPost.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Slug</label>
                      <Input value={editingPost.slug} onChange={(e) => setEditingPost(prev => ({ ...prev, slug: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Cover Image</label>
                      <div className="flex gap-2">
                        <Input value={editingPost.cover_image || ''} onChange={(e) => setEditingPost(prev => ({ ...prev, cover_image: e.target.value }))} placeholder="Public URL" />
                        <div className="relative">
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          <button type="button" className="relative border-4 border-black bg-transparent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000000] transition-all duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50" disabled={isUploading}>
                            {isUploading ? '...' : <Upload className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Excerpt</label>
                      <Textarea value={editingPost.excerpt} onChange={(e) => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Tags (comma separated)</label>
                      <Input
                          value={editingPost.tags?.join(', ')}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                          type="checkbox"
                          id="published"
                          checked={editingPost.published}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, published: e.target.checked }))}
                          className="w-4 h-4 border-2 border-black"
                      />
                      <label htmlFor="published" className="text-[10px] font-mono font-bold uppercase text-neutral-700">Published</label>
                    </div>
                  </div>
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold uppercase text-neutral-700">Content (Markdown)</label>
                          <Textarea
                              value={editingPost.content}
                              onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                              rows={18}
                              required
                          />
                      </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setEditingPost(null)} className="relative border-4 border-black bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-black hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="relative border-4 border-black bg-[#FA520F] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Post
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-0 border border-neutral-200 bg-white">
          {posts.map((post, i) => (
            <div key={post.id} className={`flex items-center justify-between p-6 ${i !== posts.length - 1 ? 'border-b border-neutral-200' : ''} hover:bg-neutral-50/50 transition-colors`}>
              <div className="flex items-center gap-4">
                <div className={post.published ? 'text-[#FA520F]' : 'text-neutral-700'}>
                    {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-medium text-lg tracking-tight">{post.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-700">
                    <span>{post.slug}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingPost(post)} className="p-2 border-2 border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 border-2 border-neutral-200 text-red-400 hover:border-red-600 hover:text-red-600 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-mono text-neutral-700">No posts yet. Create your first post!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}