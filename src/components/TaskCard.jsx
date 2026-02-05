import React from 'react'
import { useNavigate } from 'react-router-dom'
const TaskCard = ({ task }) => {
  const navigate = useNavigate()
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
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  const getDueDateDisplay = () => {
    if (task.overdue) {
      return {
        text: 'Overdue',
        class: 'text-red-600 font-semibold'
      }
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        class: 'text-amber-600 font-semibold'
      }
    } else if (diffDays === 1) {
      return {
        text: 'Due Tomorrow',
        class: 'text-amber-600 font-medium'
      }
    } else if (diffDays > 0 && diffDays <= 2) {
      return {
        text: `Due in ${diffDays} days`,
        class: 'text-slate-600'
      }
    } else {
      return {
        text: formatDate(task.dueDate),
        class: 'text-slate-500'
      }
    }
  }
  const dueDateInfo = getDueDateDisplay()
  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className={`bg-white border border-slate-200 rounded-lg p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 ${task.overdue ? 'ring-2 ring-red-200' : ''}`}>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1 min-w-0 pr-4'>
          <h3 className='font-semibold text-slate-900 text-base mb-1 truncate'>
            {task.title}
          </h3>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700'>
              {task.category}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${priority.bg} border ${priority.border}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></div>
          <span className={`text-xs font-medium ${priority.text} capitalize`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
        <div className='flex items-center gap-2'>
          <svg className='w-4 h-4 text-slate-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
          <span className={dueDateInfo.class}>{dueDateInfo.text}</span>
        </div>
        <div className='flex items-center gap-2'>
          <svg className='w-4 h-4 text-slate-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
          </svg>
          <span className='text-slate-600 truncate'>{task.submittedBy}</span>
        </div>
        <div className='flex items-center gap-2 col-span-2'>
          <svg className='w-4 h-4 text-slate-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <span className='text-slate-500'>
            Submitted on {formatDate(task.submittedDate)}
          </span>
        </div>
      </div>
      {task.overdue && (
        <div className='mt-3 pt-3 border-t border-red-100'>
          <div className='flex items-center gap-2 text-red-600'>
            <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
            </svg>
            <span className='text-sm font-medium'>Action Required - This task is overdue</span>
          </div>
        </div>
      )}
    </div>
  )
}
export default TaskCard