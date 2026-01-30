import { useParams, useNavigate } from "react-router-dom"
import { useTasks } from "../context/TaskContext"
import { toast } from "react-toastify"
export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, refreshTasks } = useTasks()
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return <p className="text-center mt-10">Loading...</p>
  }
  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) {
        throw new Error("Failed to update task")
      }
      await res.json()
      refreshTasks()
      toast.success('task status updated')
      navigate("/")
    } catch (error) {
      console.error(error)
      toast.error("error updating task status")
    }
  }
  const today = new Date()
  const due = new Date(task.dueDate)
  const isOverdue = task.status === "pending" && due < today
  const isDone = task.status !== "pending"
  const bg = isOverdue
    ? "bg-red-50 border border-red-200"
    : isDone
      ? "bg-green-50 border border-green-200"
      : "bg-white"
  return (
    <div className="p-3 flex justify-center">
      <div className={`${bg} p-6 w-full max-w-lg rounded shadow text-center`}>
        <h2 className="text-xl font-bold mb-2">{task.title}</h2>
        <p className="mb-4">{task.description}</p>
        <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
        <p className="text-sm text-gray-500">Owner: {task.submittedBy}</p>
        <p className="text-sm text-gray-500 mb-2">
          Submission Date: {task.submittedDate}
        </p>
        <p className="mb-4 font-semibold capitalize">
          Status:{" "}
          <span
            className={`
              ${isOverdue && "text-red-600"}
              ${task.status === "pending" && "text-yellow-600"}
              ${task.status === "in_progress" && "text-blue-600"}
              ${task.status === "approved" && "text-green-600"}
              ${task.status === "rejected" && "text-red-600"}
            `}>
            {isOverdue ? "overdue" : task.status.replace("_", " ")}
          </span>
        </p>
        {!isDone && (
          <div className="flex gap-3 justify-center">
            {task.status === "pending" && (
              <button
                onClick={() => updateStatus("in_progress")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition">
                Start Review
              </button>
            )}
            <button
              onClick={() => updateStatus("approved")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition">
              Approve
            </button>
            <button
              onClick={() => updateStatus("rejected")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition">
              Reject
            </button>
          </div>
        )}
        {isDone && (
          <p className="text-gray-500 mt-3">
            Task already processed
          </p>
        )}
      </div>
    </div>
  )
}