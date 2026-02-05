import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
const Notifications = () => {
  const { notifications, readIds, markRead, markAllRead } = useTasks()
  const navigate = useNavigate()
  const handleClick = (n) => {
    markRead(n.id)
    navigate(`/task/${n.taskId}`)
  }
  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation()
    markRead(notificationId)
  }
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
          </svg>
        )
      case 'dueSoon':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
          </svg>
        )
      default:
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
          </svg>
        )
    }
  }
  const getNotificationStyle = (type, isRead) => {
    const baseStyle = 'transition-all duration-200'
    if (isRead) {
      return `bg-white border-slate-200 opacity-60 ${baseStyle}`
    }
    switch (type) {
      case 'overdue':
        return `bg-red-50 border-red-200 ${baseStyle}`
      case 'dueSoon':
        return `bg-amber-50 border-amber-200 ${baseStyle}`
      default:
        return `bg-blue-50 border-blue-200 ${baseStyle}`
    }
  }
  const getIconStyle = (type, isRead) => {
    if (isRead) return 'bg-slate-100 text-slate-400'
    switch (type) {
      case 'overdue':
        return 'bg-red-100 text-red-600'
      case 'dueSoon':
        return 'bg-amber-100 text-amber-600'
      default:
        return 'bg-blue-100 text-blue-600'
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>Notifications</h1>
              <p className='text-slate-600 mt-1'>
                {notifications.length > 0
                  ? `${unreadCount} unread of ${notifications.length} total`
                  : 'No notifications at this time'}
              </p>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
        <div className='space-y-3'>
          {notifications.map(n => {
            const isRead = readIds.has(n.id)
            return (
              <div
                key={n.id}
                className={`border rounded-lg hover:shadow-md ${getNotificationStyle(n.type, isRead)}`}>
                <div className='p-4'>
                  <div className='flex items-start gap-4'>
                    <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getIconStyle(n.type, isRead)}`}>
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className={`text-sm ${isRead ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>
                        {n.message}
                      </p>
                      <div className='flex items-center gap-4 mt-2'>
                        <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                          <span>Due: {formatDate(n.dueDate)}</span>
                        </div>
                        {!isRead && (
                          <div className='flex items-center gap-1.5'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                            <span className='text-xs font-medium text-blue-600'>Unread</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {!isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, n.id)}
                          className='cursor-pointer p-2 text-slate-400 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors duration-200'
                          title='Mark as read'>
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                        </button>
                      )}
                      <button
                        className='cursor-pointer p-2 text-slate-400 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors duration-200'
                        onClick={() => handleClick(n)}
                        title='Go to Taks'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {notifications.length === 0 && (
          <div className='bg-white rounded-lg border border-slate-200 p-12 text-center'>
            <div className='max-w-sm mx-auto'>
              <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>No notifications</h3>
              <p className='text-slate-500'>
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          </div>
        )}
        {notifications.length > 0 && unreadCount === 0 && (
          <div className='mt-6 bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='flex items-center gap-3'>
              <div className='shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
              </div>
              <div>
                <p className='text-sm font-semibold text-green-900'>All caught up!</p>
                <p className='text-xs text-green-700'>You've read all your notifications.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Notifications