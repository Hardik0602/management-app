import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import Notification from '../components/Notification'
const Notifications = () => {
  const { tasks } = useTasks()
  const navigate = useNavigate()
  const notifications = Notification(tasks)
  return (
    <div className='max-w-2xl mx-auto p-4 space-y-3'>
      <h1 className='text-2xl font-bold mb-5 text-center'>
        Notifications
      </h1>
      {notifications.map(n => (
        <div
          key={n.id}
          onClick={() => navigate(`/task/${n.taskId}`)}
          className={`p-4 rounded shadow border text-center w-full md:w-lg mx-auto
            cursor-pointer hover:-translate-y-1 transition
            ${n.type === 'overdue' && 'bg-red-50 border-red-200'}
            ${n.type === 'dueSoon' && 'bg-orange-50 border-orange-200'}
            ${n.type === 'pending' && 'bg-white'}
          `}>
          <p className='font-medium'>{n.message}</p>
          <p className='text-xs text-gray-400'>Due: {n.dueDate}</p>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className='text-center text-gray-400 mt-50 text-3xl font-bold'>
          No notifications
        </p>
      )}
    </div>
  )
}
export default Notifications