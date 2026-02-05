import React from 'react'
import Stats from '../components/Stats'
import { useTasks } from '../context/TaskContext'
const Dashboard = () => {
  const { tasks } = useTasks()
  const today = new Date()
  const total = tasks.length
  const overdue = tasks.filter(t =>
    t.status === 'pending' && new Date(t.dueDate) < today
  ).length
  const pending = tasks.filter(t =>
    t.status === 'pending' && new Date(t.dueDate) >= today
  ).length
  const completed = tasks.filter(t =>
    t.status !== 'pending'
  ).length
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 7)
  const completedThisWeek = tasks.filter(t =>
    t.status !== 'pending' && new Date(t.submittedDate) >= weekAgo
  ).length
  const effectiveTasks = tasks.map(t => {
    const overdue = t.status === "pending" && new Date(t.dueDate) < today
    return {
      ...t,
      effectivePriority: overdue ? "high" : t.priority
    }
  })
  const pendingTasks = effectiveTasks.filter(t => t.status === "pending")
  const highPriority = pendingTasks.filter(t => t.effectivePriority === "high").length
  const mediumPriority = pendingTasks.filter(t => t.effectivePriority === "medium").length
  const lowPriority = pendingTasks.filter(t => t.effectivePriority === "low").length
  const threeDaysFromNow = new Date(today)
  threeDaysFromNow.setDate(today.getDate() + 3)
  const dueSoon = tasks.filter(t =>
    t.status === 'pending' &&
    new Date(t.dueDate) >= today &&
    new Date(t.dueDate) <= threeDaysFromNow
  ).length
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900'>Dashboard</h1>
          {/* <p className='text-slate-600 mt-1'>Overview of your tasks and activities</p> */}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Stats
            title='Total Tasks'
            value={total}
            icon={
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
              </svg>
            }
            color='blue'
            trend={10} />
          <Stats
            title='Pending'
            value={pending}
            icon={
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            }
            color='amber'
            subtitle='Awaiting action' />
          <Stats
            title='Overdue'
            value={overdue}
            icon={
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
            }
            color='red'
            subtitle='Needs attention' />
          <Stats
            title='Completed'
            value={completed}
            icon={
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            }
            color='green'
            subtitle={`${completedThisWeek} this week`} />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Due Task Priority Breakdown</h2>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <span className='text-sm font-medium text-slate-700'>High Priority</span>
                  </div>
                  <span className='text-sm font-semibold text-slate-900'>{highPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-red-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${pending > 0 ? (highPriority / pending) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 bg-amber-500 rounded-full'></div>
                    <span className='text-sm font-medium text-slate-700'>Medium Priority</span>
                  </div>
                  <span className='text-sm font-semibold text-slate-900'>{mediumPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-amber-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${pending > 0 ? (mediumPriority / pending) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                    <span className='text-sm font-medium text-slate-700'>Low Priority</span>
                  </div>
                  <span className='text-sm font-semibold text-slate-900'>{lowPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${pending > 0 ? (lowPriority / pending) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Quick Insights</h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                <svg className='w-5 h-5 text-amber-600 shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                <div>
                  <p className='text-sm font-semibold text-amber-900'>{dueSoon} tasks due soon</p>
                  <p className='text-xs text-amber-700 mt-0.5'>Due within the next 3 days</p>
                </div>
              </div>
              <div className='flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <svg className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                </svg>
                <div>
                  <p className='text-sm font-semibold text-blue-900'>Completion Rate</p>
                  <p className='text-xs text-blue-700 mt-0.5'>
                    {total > 0 ? Math.round((completed / total) * 100) : 0}% of all tasks completed
                  </p>
                </div>
              </div>
              {overdue === 0 && pending > 0 && (
                <div className='flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <svg className='w-5 h-5 text-green-600 shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <div>
                    <p className='text-sm font-semibold text-green-900'>All caught up!</p>
                    <p className='text-xs text-green-700 mt-0.5'>No overdue tasks</p>
                  </div>
                </div>
              )}
              {pending === 0 && completed > 0 && (
                <div className='flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <svg className='w-5 h-5 text-green-600 shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <div>
                    <p className='text-sm font-semibold text-green-900'>Inbox Zero!</p>
                    <p className='text-xs text-green-700 mt-0.5'>All pending tasks completed</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard