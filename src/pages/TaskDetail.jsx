import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { toast } from 'react-toastify'
import Comments from '../components/Comments'
import ActionConfirmModal from '../components/ActionConfirmModal'
import { useState } from 'react'
const TaskDetail = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, refreshTasks } = useTasks()
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return <p className='text-center text-gray-400 mt-50 text-3xl font-bold'>No Task Found</p>
  }
  const updateStatus = async (newStatus, note) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error()
      if (note?.trim()) {
        await fetch(`http://localhost:3000/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: id,
            userName: task.assignedTo,
            userEmail: task.assignedTo,
            message: `${newStatus.toUpperCase()} — ${note}`,
            createdAt: new Date().toISOString()
          })
        })
      }
      refreshTasks()
      toast.success('Task Updated')
      navigate('/')
    } catch {
      toast.error('Failed to Update Task')
    }
  }
  const today = new Date()
  const due = new Date(task.dueDate)
  const isOverdue = task.status === 'pending' && due < today
  const isDone = task.status !== 'pending'
  const bg = isOverdue
    ? 'bg-red-50 border border-red-200'
    : isDone
      ? 'bg-green-50 border border-green-200'
      : 'bg-white'
  return (
    <div className='p-3 flex justify-center'>
      <div className='flex flex-col md:flex-row gap-5'>
        <div>
          <div className={`${bg} p-6 w-full max-w-lg rounded shadow text-center`}>
            <h2 className='text-2xl font-bold mb-2'>{task.title}</h2>
            <p className='mb-4 text-sm'>{task.description}</p>
            <p className='text-sm text-gray-500'>Due: {task.dueDate}</p>
            <p className='text-sm text-gray-500'>Priority: {task.priority}</p>
            <p className='text-sm text-gray-500'>Submitted by: {task.submittedBy}</p>
            <p className='text-sm text-gray-500 mb-2'>Submission Date: {task.submittedDate}</p>
            <p className='mb-4 font-semibold capitalize'>
              Status:{' '}
              <span
                className={`
              ${isOverdue && 'text-red-600'}
              ${task.status === 'pending' && 'text-yellow-600'}
              ${task.status === 'in_progress' && 'text-blue-600'}
              ${task.status === 'approved' && 'text-green-600'}
              ${task.status === 'rejected' && 'text-red-600'}
            `}>
                {isOverdue ? 'overdue' : task.status.replace('_', ' ')}
              </span>
            </p>
            {task.details && Object.keys(task.details).length > 0 && (
              <div className='my-5 text-left border-y py-4 space-y-2'>
                <h3 className='font-bold mb-2 text-center'>Details</h3>
                {Object.entries(task.details).map(([key, value]) => (
                  <div key={key} className='flex justify-between text-sm'>
                    <span className='text-gray-500 capitalize'>
                      {key}
                    </span>
                    <span className='font-medium'>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {!isDone && (
              <div className='flex gap-3 justify-center'>
                <button
                  onClick={() => {
                    setSelectedAction('in_progress')
                    setModalOpen(true)
                  }}
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition'>
                  For Review
                </button>
                <button
                  onClick={() => {
                    setSelectedAction('approved')
                    setModalOpen(true)
                  }}
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition'>
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedAction('rejected')
                    setModalOpen(true)
                  }}
                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition'>
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
        <Comments taskId={task.id} />
      </div>
      <ActionConfirmModal
        open={modalOpen}
        action={selectedAction}
        onCancel={() => setModalOpen(false)}
        onConfirm={(note) => {
          setModalOpen(false)
          updateStatus(selectedAction, note)
        }} />
    </div>
  )
}
export default TaskDetail