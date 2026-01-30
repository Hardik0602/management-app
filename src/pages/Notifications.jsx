import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetch(`http://localhost:3000/tasks?assignedTo=${user.email}`)
      .then(res => res.json())
      .then(tasks => {
        const notifs = buildNotifications(tasks)
        setNotifications(notifs)
      })
      .finally(setLoading(false))
  }, [user])
  if (loading) return <p className="text-center mt-10">Loading...</p>
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <h1 className="text-xl font-bold mb-5 text-center">Notifications</h1>
      {notifications.map(n => (
        <div
          onClick={() => navigate(`/task/${n.taskId}`)}
          key={n.id}
          className={`p-4 rounded shadow border text-center w-full md:w-lg mx-auto
            hover:-translate-y-1 transition
            ${n.type === "overdue" && "bg-red-50 border-red-200"}
            ${n.type === "dueSoon" && "bg-orange-50 border-orange-200"}
            ${n.type === "pending" && "bg-white"}
          `}>
          <p className="font-medium">{n.message}</p>
          <p className="text-xs text-gray-400">Due: {n.dueDate}</p>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No notifications 🎉
        </p>
      )}
    </div>
  )
}
function buildNotifications(tasks) {
  const today = new Date()
  const twoDays = 2 * 24 * 60 * 60 * 1000
  const list = []
  tasks.forEach(t => {
    if (t.status !== "pending") return
    const due = new Date(t.dueDate)
    const diff = due - today
    if (diff < 0) {
      list.push({
        id: `${t.id}-overdue`,
        type: "overdue",
        taskId: t.id,
        dueDate: t.dueDate,
        message: `${t.title} is OVERDUE`
      })
    }
    else if (diff <= twoDays) {
      list.push({
        id: `${t.id}-soon`,
        type: "dueSoon",
        taskId: t.id,
        dueDate: t.dueDate,
        message: `${t.title} is due soon`
      })
    }
    else {
      list.push({
        id: `${t.id}-pending`,
        type: "pending",
        taskId: t.id,
        dueDate: t.dueDate,
        message: `${t.title} is pending review`
      })
    }
  })
  const order = { overdue: 0, dueSoon: 1, pending: 2 }
  return list.sort((a, b) => order[a.type] - order[b.type])
}