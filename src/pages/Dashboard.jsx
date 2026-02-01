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
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-3'>
        <Stats title='Total' value={total} />
        <Stats title='Pending' value={pending} />
        <Stats title='Overdue' value={overdue} />
        <Stats title='Completed' value={completed} />
      </div>
    </div>
  )
}
export default Dashboard