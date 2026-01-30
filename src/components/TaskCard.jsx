import { useNavigate } from "react-router-dom"
export default function TaskCard({ task }) {
  const navigate = useNavigate()
  const bg = task.overdue
    ? "bg-red-50 border border-red-200"
    : task.status !== "pending"
      ? "bg-green-50 border border-green-200"
      : "bg-white"
  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className={`${bg} p-4 rounded shadow cursor-pointer hover:-translate-y-1 transition`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{task.title}</h3>
        {task.overdue && (
          <span className="text-xs text-red-600 font-bold">
            Overdue
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 my-1">{task.category}</p>
      <p className="text-xs text-gray-400">Status: {task.status}</p>
      <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
      <p className="text-xs text-gray-400">Owner: {task.submittedBy}</p>
      <p className="text-xs text-gray-400">Submission Date: {task.submittedDate}</p>
    </div>
  )
}