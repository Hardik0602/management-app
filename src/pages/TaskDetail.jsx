import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  // -------------------------
  // fetch task
  // -------------------------
  useEffect(() => {
    fetch(`http://localhost:3000/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        // security: only allow assigned user
        if (data.assignedTo !== user.email) {
          navigate("/inbox")
          return
        }

        setTask(data)
        setLoading(false)
      })
  }, [id, user, navigate])

  // -------------------------
  // update status
  // -------------------------
  const updateStatus = async (newStatus) => {
    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })

    const updated = await res.json()
    setTask(updated)
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!task) return <p>Not found</p>

  // -------------------------
  // derived flags
  // -------------------------
  const today = new Date()
  const due = new Date(task.dueDate)

  const isOverdue =
    task.status === "pending" && due < today

  const isDone = task.status !== "pending"

  const bg =
    isOverdue
      ? "bg-red-50 border border-red-200"
      : isDone
      ? "bg-green-50 border border-green-200"
      : "bg-white"

  return (
    <div className="p-3 flex justify-center">
      <div className={`${bg} p-6 w-full max-w-lg rounded shadow text-center`}>

        <h2 className="text-xl font-bold mb-2">{task.title}</h2>

        <p className="mb-4">{task.description}</p>

        <p className="text-sm text-gray-500">
          Due: {task.dueDate}
        </p>
        <p className="text-sm text-gray-500">
          Owner: {task.submittedBy}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          Submission Date: {task.submittedDate}
        </p>

        {/* STATUS */}
        <p className="mb-4 font-semibold capitalize">
          Status:{" "}
          <span
            className={`
              ${isOverdue && "text-red-600"}
              ${task.status === "pending" && "text-yellow-600"}
              ${task.status === "in_progress" && "text-blue-600"}
              ${task.status === "approved" && "text-green-600"}
              ${task.status === "rejected" && "text-red-600"}
            `}
          >
            {isOverdue ? "overdue" : task.status.replace("_", " ")}
          </span>
        </p>

        {/* ACTION BUTTONS */}
        {!isDone && (
          <div className="flex gap-3 justify-center">

            {task.status === "pending" && (
              <button
                onClick={() => updateStatus("in_progress")}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition hover:-translate-y-1"
              >
                Start Review
              </button>
            )}

            <button
              onClick={() => updateStatus("approved")}
              className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-400 transition hover:-translate-y-1"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus("rejected")}
              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400 transition hover:-translate-y-1"
            >
              Reject
            </button>

          </div>
        )}

        {isDone && (
          <p className="text-gray-500 mt-3">
            ✅ Task already processed
          </p>
        )}
      </div>
    </div>
  )
}
