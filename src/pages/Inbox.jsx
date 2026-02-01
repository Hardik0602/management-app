import React from 'react'
import { useState } from 'react'
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
  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-4xl space-y-8 p-3'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3'>
          <h1 className='text-2xl font-bold text-center'>Inbox</h1>
          <div className='flex flex-col md:flex-row gap-3 px-20 md:p-0'>
            <select
              value={sortMode}
              onChange={e => setSortMode(e.target.value)}
              className='border rounded px-2 py-1 text-sm cursor-pointer'>
              <option value='due'>Sort: Due Date</option>
              <option value='priority'>Sort: Priority</option>
            </select>
            <select
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
              className='border rounded px-2 py-1 text-sm cursor-pointer'>
              <option value='all'>Category: All</option>
              {categories.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className='border rounded px-2 py-1 text-sm cursor-pointer'>
              <option value='all'>Status: All</option>
              {statuses.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={filters.priority}
              onChange={e => setFilters({ ...filters, priority: e.target.value })}
              className='border rounded px-2 py-1 text-sm cursor-pointer'>
              <option value='all'>Priority: All</option>
              {priorities.map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={() => {
                refreshTasks()
                setSortMode('due')
                setFilters({
                  category: 'all',
                  status: 'all',
                  priority: 'all'
                })
              }}
              className='bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500'>
              Refresh
            </button>
          </div>
        </div>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className='font-semibold text-gray-600 mb-3'>{category}</h2>
            <div className='space-y-4'>
              {items.map(t => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className='text-center text-gray-400 mt-50 text-3xl font-bold'>No tasks found</p>
        )}
      </div>
    </div>
  )
}
export default Inbox