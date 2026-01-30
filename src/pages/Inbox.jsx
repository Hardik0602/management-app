import { useTasks } from "../context/TaskContext"
import TaskCard from "../components/TaskCard"

export default function Inbox() {
  const { tasks, refreshTasks } = useTasks() // ⭐ global tasks

  // -------------------------
  // overdue detection
  // -------------------------
  const today = new Date()

  const markOverdue = (data) =>
    data.map(t => ({
      ...t,
      overdue: t.status === "pending" && new Date(t.dueDate) < today
    }))

  // -------------------------
  // sorting
  // -------------------------
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

  const sortTasks = (data) =>
    [...data].sort((a, b) => {
      const aStatus = a.overdue ? "overdue" : a.status
      const bStatus = b.overdue ? "overdue" : b.status

      const s = statusOrder[aStatus] - statusOrder[bStatus]
      if (s !== 0) return s

      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

  const processed = sortTasks(markOverdue(tasks))

  // -------------------------
  // group by category
  // -------------------------
  const grouped = processed.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = []
    acc[task.category].push(task)
    return acc
  }, {})

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-8 p-3">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Inbox</h1>

          {/* now refresh just reloads context */}
          <button
            onClick={refreshTasks}
            className="bg-indigo-600 text-white px-2 py-1 rounded text-md hover:bg-indigo-500 transition"
          >
            Refresh
          </button>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="font-semibold text-gray-600 mb-3">
              {category}
            </h2>

            <div className="space-y-4">
              {items.map(t => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No tasks assigned
          </p>
        )}
      </div>
    </div>
  )
}
