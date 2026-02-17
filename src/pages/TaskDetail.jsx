import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { toast } from 'react-toastify'
import Comments from '../components/Comments'
import ActionConfirmModal from '../components/ActionConfirmModal'
import { users } from '../data/users'
const TaskDetail = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, refreshTasks } = useTasks()
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <svg className='w-16 h-16 text-slate-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          <h3 className='text-lg font-semibold text-slate-900 mb-2'>Task Not Found</h3>
          <p className='text-slate-500 mb-6'>The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
            Back to Inbox
          </button>
        </div>
      </div>
    )
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
        const statusMap = {
          in_progress: 'Marked for Review',
          approved: 'Approve',
          rejected: 'Reject'
        }
        const commentStatus = statusMap[newStatus]
        await fetch(`http://localhost:3000/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: id,
            userName: users.find(u => u.email === task.assignedTo)?.name,
            userEmail: task.assignedTo,
            message: `${commentStatus} — ${note}`,
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
  const priorityConfig = {
    high: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500'
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500'
    },
    low: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500'
    }
  }
  const statusConfig = {
    pending: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      label: 'Pending'
    },
    in_progress: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'In Progress'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Rejected'
    }
  }
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const status = statusConfig[task.status] || statusConfig.pending
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200 mb-4'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            <span className='font-medium'>Back</span>
          </button>
          <h1 className='text-3xl font-bold text-slate-900'>Task Details</h1>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6 lg:sticky lg:top-6 self-start'>
            <div className='bg-white rounded-lg borde border-slate-200 overflow-hidden'>
              {isOverdue && (
                <div className='bg-red-600 text-white px-6 py-3 flex items-center gap-2'>
                  <svg className='w-5 h-5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                  </svg>
                  <span className='font-semibold'>This task is overdue and requires immediate attention</span>
                </div>
              )}
              <div className='p-6 border-b border-slate-200'>
                <div className='flex items-start justify-between mb-4'>
                  <h2 className='text-2xl font-bold text-slate-900 flex-1'>{task.title}</h2>
                  <div className='flex items-center gap-2 ml-4'>
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${status.bg} ${status.text}`}>
                      {isOverdue ? 'Overdue' : status.label}
                    </span>
                  </div>
                </div>
                <p className='text-slate-600 leading-relaxed'>{task.description}</p>
              </div>
              <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Category
                  </label>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                    </svg>
                    <span className='text-slate-900 font-medium'>{task.category}</span>
                  </div>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Priority
                  </label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${priority.bg} border ${priority.border}`}>
                    <div className={`w-2 h-2 rounded-full ${priority.dot}`}></div>
                    <span className={`text-sm font-medium ${priority.text} capitalize`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Due Date
                  </label>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Submitted By
                  </label>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                      <span className='text-xs font-medium text-slate-600'>
                        {task.submittedBy.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className='text-slate-900 font-medium'>{task.submittedBy}</span>
                  </div>
                </div>
                <div className='md:col-span-2'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Submitted On
                  </label>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span className='text-slate-600'>{formatDate(task.submittedDate)}</span>
                  </div>
                </div>
              </div>
              {task.details && Object.keys(task.details).length > 0 && (
                <div className='p-6 bg-slate-50 border-t border-slate-200'>
                  <h3 className='text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4'>
                    Additional Details
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {Object.entries(task.details).map(([key, value]) => (
                      <div key={key} className='bg-white rounded-lg border border-slate-200 p-4'>
                        <label className='text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1'>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <span className='text-slate-900 font-medium'>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!isDone && (
                <div className='p-6 bg-slate-50 border-t border-slate-200'>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                      onClick={() => {
                        setSelectedAction('approved')
                        setModalOpen(true)
                      }}
                      className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAction('in_progress')
                        setModalOpen(true)
                      }}
                      className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                      <span>Mark for Review</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAction('rejected')
                        setModalOpen(true)
                      }}
                      className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}
              {isDone && (
                <div className={`p-6 border-t ${task.status === 'approved'
                  ? 'bg-green-50 border-green-200'
                  : task.status === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                  }`}>
                  <div className='flex items-center gap-3'>
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${task.status === 'approved'
                      ? 'bg-green-100'
                      : task.status === 'rejected'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                      }`}>
                      <svg className={`w-5 h-5 ${task.status === 'approved'
                        ? 'text-green-600'
                        : task.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-blue-600'
                        }`} fill='currentColor' viewBox='0 0 20 20'>
                        {task.status === 'approved' ? (
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                        ) : task.status === 'rejected' ? (
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                        ) : (
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${task.status === 'approved'
                        ? 'text-green-900'
                        : task.status === 'rejected'
                          ? 'text-red-900'
                          : 'text-blue-900'
                        }`}>
                        {task.status === 'approved'
                          ? 'This task has been approved'
                          : task.status === 'rejected'
                            ? 'This task has been rejected'
                            : 'This task is under review'}
                      </p>
                      <p className={`text-xs ${task.status === 'approved'
                        ? 'text-green-700'
                        : task.status === 'rejected'
                          ? 'text-red-700'
                          : 'text-blue-700'
                        }`}>
                        No further action required
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='lg:col-span-1'>
            <Comments taskId={task.id} />
          </div>
        </div>
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