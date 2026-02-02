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
  return (
    <div className='max-w-2xl mx-auto p-4 space-y-3'>
      <div className={`flex ${notifications.length > 0 ? 'justify-between' : 'justify-center'} items-center mb-5`}>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className='text-md bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-400 transition'>
            Mark all read
          </button>
        )}
      </div>
      {notifications.map(n => {
        const isRead = readIds.has(n.id)
        return (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`
              p-4 rounded shadow cursor-pointer transition hover:-translate-y-1 text-center
              ${n.type === 'overdue' && 'bg-red-100 border border-red-500'}
              ${n.type === 'dueSoon' && 'bg-orange-100 border border-orange-500'}
              ${n.type === 'pending' && 'bg-white'}
              ${isRead ? 'opacity-40' : 'font-medium'}
            `}>
            <p>{n.message}</p>
            <p className='text-xs text-gray-400'>Due: {n.dueDate}</p>
          </div>
        )
      })}
      {notifications.length === 0 && (
        <p className='text-center text-gray-400 mt-50 text-3xl font-bold'>No Notifications</p>
      )}
    </div>
  )
}
export default Notifications