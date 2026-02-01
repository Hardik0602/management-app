import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
const Comments = ({ taskId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
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
    try {
      await fetch(`http://localhost:3000/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userName: user.name,
          userEmail: user.email,
          message: text,
          createdAt: new Date().toISOString()
        })
      })
      setText('')
      loadComments()
      toast.success('Comment Added')
    } catch {
      toast.error('Failed to Add Comment')
    }
  }
  return (
    <div className='w-full md:w-96 bg-white rounded shadow p-4 flex flex-col'>
      <h2 className='font-bold text-2xl mb-3 text-center'>Comments</h2>
      <div className='flex gap-2  mb-3'>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Add Comment'
          className='flex-1 border rounded px-3 py-2 text-sm' />
        <button
          onClick={addComment}
          className='bg-indigo-500 text-white px-3 rounded hover:bg-indigo-400 transition'>
          Add
        </button>
      </div>
      <div className='flex-1 overflow-y-auto space-y-3'>
        {loading && <p className='text-sm text-gray-400'>Loading...</p>}
        {[...comments].reverse().map(c => (
          <div key={c.id} className='bg-blue-50 p-3 rounded text-sm'>
            <p className='font-medium'>{c.userName}</p>
            <p className='text-xs text-gray-400'>{c.userEmail}</p>
            <p className='my-2'>{c.message}</p>
            <p className='text-xs text-gray-400'>
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {!loading && comments.length === 0 && (
          <p className='text-gray-400 text-md font-bold text-center md:mt-15'>No Comments</p>
        )}
      </div>
    </div>
  )
}
export default Comments