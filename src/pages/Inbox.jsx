import React, { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from '../components/TaskCard'
const Inbox = () => {
  const { tasks, refreshTasks } = useTasks()
  const today = new Date()
  const [sortMode, setSortMode] = useState('due')
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all'
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const markOverdue = (data) =>
    data.map(t => {
      const overdue = t.status === 'pending' && new Date(t.dueDate) < today
      return {
        ...t,
        overdue,
        effectivePriority: overdue ? 'high' : t.priority
      }
    })
  const statusOrder = {
    overdue: 0,
    pending: 1,
    in_progress: 2,
    approved: 3,
    rejected: 3
  }
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2
  }
  const applyFilters = (data) =>
    data.filter(t => {
      if (filters.category !== 'all' && t.category !== filters.category) return false
      if (filters.status !== 'all' && t.status !== filters.status) return false
      if (filters.priority !== 'all' && t.effectivePriority !== filters.priority) return false
      return true
    })
  const sortTasks = (data) =>
    [...data].sort((a, b) => {
      const aStatus = a.overdue ? 'overdue' : a.status
      const bStatus = b.overdue ? 'overdue' : b.status
      const s = statusOrder[aStatus] - statusOrder[bStatus]
      if (s !== 0) return s
      if (sortMode === 'due') {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return priorityOrder[a.effectivePriority] - priorityOrder[b.effectivePriority]
    })
  const processed = applyFilters(markOverdue(tasks))
  const grouped = processed.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = []
    acc[task.category].push(task)
    return acc
  }, {})
  Object.keys(grouped).forEach(category => {
    grouped[category] = sortTasks(grouped[category])
  })
  const categories = [...new Set(tasks.map(t => t.category))]
  const statuses = [...new Set(tasks.map(t => t.status))]
  const priorities = ['high', 'medium', 'low']
  const handleRefresh = () => {
    setIsRefreshing(true)
    refreshTasks()
    setTimeout(() => setIsRefreshing(false), 500)
  }
  const handleReset = () => {
    setSortMode('due')
    setFilters({
      category: 'all',
      status: 'all',
      priority: 'all'
    })
  }
  const activeFiltersCount = (filters.category !== 'all' ? 1 : 0) + (filters.status !== 'all' ? 1 : 0) + (filters.priority !== 'all' ? 1 : 0)
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>Task Inbox</h1>
              {/* <p className='text-slate-600 mt-1'>
                {processed.length} {processed.length === 1 ? 'task' : 'tasks'}
                {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active)`}
              </p> */}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className='flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50'>
              <svg
                className={`w-4 h-4 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              <span className='text-sm font-medium text-slate-700'>Refresh</span>
            </button>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-4'>
            <div className='flex flex-col lg:flex-row gap-3'>
              <div className='flex items-center space-x-2 flex-1'>
                <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12' />
                </svg>
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value)}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200'>
                  <option value='due'>Sort by Due Date</option>
                  <option value='priority'>Sort by Priority</option>
                </select>
              </div>
              <div className='flex items-center space-x-2 flex-1'>
                <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                </svg>
                <select
                  value={filters.category}
                  onChange={e => setFilters({ ...filters, category: e.target.value })}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200'>
                  <option value='all'>All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className='flex items-center space-x-2 flex-1'>
                <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <select
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200'>
                  <option value='all'>All Statuses</option>
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className='flex items-center space-x-2 flex-1'>
                <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                </svg>
                <select
                  value={filters.priority}
                  onChange={e => setFilters({ ...filters, priority: e.target.value })}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200'>
                  <option value='all'>All Priorities</option>
                  {priorities.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors duration-200'>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='space-y-8'>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className='flex items-center mb-4'>
                <h2 className='text-lg font-semibold text-slate-900'>{category}</h2>
                <span className='ml-3 px-2.5 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full'>
                  {items.length}
                </span>
              </div>
              <div className='space-y-3'>
                {items.map(t => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div className='bg-white rounded-lg border border-slate-200 p-12 text-center'>
              <div className='max-w-sm mx-auto'>
                <svg className='w-16 h-16 text-slate-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                </svg>
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>No tasks found</h3>
                <p className='text-slate-500 mb-6'>
                  {activeFiltersCount > 0
                    ? 'Try adjusting your filters to see more tasks.'
                    : 'Your inbox is empty. New tasks will appear here.'}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleReset}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium'>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Inbox