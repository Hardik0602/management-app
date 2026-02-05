import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
const Comments = ({ taskId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const loadComments = () => {
    fetch(`http://localhost:3000/comments?taskId=${taskId}`)
      .then(res => res.json())
      .then(data => {
        setComments(data)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadComments()
  }, [taskId])
  const addComment = async () => {
    if (!text.trim()) return
    setIsSubmitting(true)
    try {
      await fetch(`http://localhost:3000/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userName: user.name,
          userEmail: user.email,
          message: text.trim(),
          createdAt: new Date().toISOString()
        })
      })
      setText('')
      loadComments()
      toast.success('Comment Added')
    } catch {
      toast.error('Failed to Add Comment')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }
  const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
  return (
    <div className='bg-white rounded-lg border border-slate-200 flex flex-col h-full lg:top-24'>
      <div className='p-4 border-b border-slate-200'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-slate-900'>Comments</h2>
          <span className='px-2.5 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full'>
            {comments.length}
          </span>
        </div>
      </div>
      <div className='p-4 border-t border-slate-200 bg-slate-50'>
        <div className='flex items-center gap-2'>
          <div className='shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm'>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className='flex-1'>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Write a comment...'
              rows={1}
              disabled={isSubmitting}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed'
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }} />
          </div>
          <button
            onClick={addComment}
            disabled={!text.trim() || isSubmitting}
            className='shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center'
            title='Send comment'>
            {isSubmitting ? (
              <svg className='animate-spin h-4 w-4' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
            ) : (
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
              </svg>
            )}
          </button>
        </div>
        <p className='text-xs text-slate-500 mt-2'>Press Enter to send, Shift + Enter for new line</p>
      </div>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='flex flex-col items-center gap-2'>
              <svg className='animate-spin h-8 w-8 text-slate-400' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              <p className='text-sm text-slate-500'>Loading comments...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3'>
              <svg className='w-6 h-6 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
            </div>
            <h3 className='text-sm font-semibold text-slate-900 mb-1'>No comments yet</h3>
            <p className='text-xs text-slate-500'>Be the first to comment on this task</p>
          </div>
        ) : (
          [...comments].reverse().map((c, index) => {
            const isCurrentUser = c.userEmail === user.email
            return (
              <div
                key={c.id}
                className={`group ${index !== comments.length - 1 ? 'pb-4 border-b border-slate-100' : ''}`}>
                <div className='flex gap-3'>
                  {/* Avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${isCurrentUser
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-200 text-slate-600'
                    }`}>
                    {c.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-sm font-semibold text-slate-900'>
                        {c.userName}
                        {isCurrentUser && (
                          <span className='ml-1.5 text-xs font-normal text-slate-500'>(You)</span>
                        )}
                      </span>
                      <span className='text-xs text-slate-400'>•</span>
                      <span className='text-xs text-slate-500' title={new Date(c.createdAt).toLocaleString()}>
                        {formatTimestamp(c.createdAt)}
                      </span>
                    </div>
                    <p className='text-sm text-slate-700 leading-relaxed wrap-break-words whitespace-pre-wrap'>
                      {c.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
export default Comments