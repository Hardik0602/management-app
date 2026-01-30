import { useTasks } from "../context/TaskContext"
export default function Dashboard() {
  const { tasks } = useTasks()
  const today = new Date()
  const total = tasks.length
  const overdue = tasks.filter(t =>
    t.status === "pending" && new Date(t.dueDate) < today
  ).length
  const pending = tasks.filter(t =>
    t.status === "pending" && new Date(t.dueDate) >= today
  ).length
  const completed = tasks.filter(t =>
    t.status !== "pending"
  ).length
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">
        <Stat title="Total" value={total} />
        <Stat title="Pending" value={pending} />
        <Stat title="Overdue" value={overdue} />
        <Stat title="Completed" value={completed} />
      </div>
    </div>
  )
}
const Stat = ({ title, value }) => (
  <div className="bg-white w-80 p-6 rounded shadow text-center hover:-translate-y-1 transition">
    <h2 className="text-2xl font-bold mb-5">{title}</h2>
    <p className="text-2xl font-medium">{value}</p>
  </div>
)