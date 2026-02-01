import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'
const TaskContext = createContext()
export function TaskProvider({ children }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const loadTasks = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/tasks?assignedTo=${user.email}`)
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.log(error)
      toast.error('error fetching tasks')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadTasks()
  }, [user])
  return (
    <TaskContext.Provider value={{ tasks, loading, refreshTasks: loadTasks }}>
      {children}
    </TaskContext.Provider>
  )
}
export const useTasks = () => useContext(TaskContext)