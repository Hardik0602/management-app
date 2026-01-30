import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTasks } from "../context/TaskContext"
import { useState } from "react"
export default function Navbar() {
  const { user, logout } = useAuth()
  const { tasks } = useTasks()
  const navigate = useNavigate()
  const [mobileView, setMobileView] = useState(false)
  const unreadCount = tasks.filter(t => t.status === "pending").length
  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  const currentPage = ({ isActive }) =>
    isActive
      ? "px-3 py-2 rounded-md text-sm font-medium transition bg-indigo-100 text-indigo-700"
      : "px-3 py-2 rounded-md text-sm font-medium transition hover:-translate-y-1"
  return (
    <nav className="bg-white w-full shadow-md mb-10">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">
          TaskFlow
        </h1>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <NavLink to="/" className={currentPage}>
              Inbox
            </NavLink>
            <NavLink to="/dashboard" end className={currentPage}>
              Dashboard
            </NavLink>
            <NavLink to="/notifications" className={currentPage}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-white text-xs bg-red-500 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <NavLink
            to="/profile"
            className="text-sm text-gray-600">
            👤 {user?.name}
          </NavLink>
          <button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-400 transition">
            Logout
          </button>
          <button
            className={`md:hidden ${unreadCount > 0 ? 'bg-red-500 px-2 py-0.5 rounded-full' : ''}`}
            onClick={() => setMobileView(!mobileView)}>
            &#9776;
          </button>
        </div>
      </div>
      {mobileView && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col p-3 gap-2">
            <NavLink to="/" className={currentPage} onClick={() => setMobileView(false)}>
              Inbox
            </NavLink>
            <NavLink to="/dashboard" end className={currentPage} onClick={() => setMobileView(false)}>
              Dashboard
            </NavLink>
            <NavLink
              to="/notifications"
              className={currentPage}
              onClick={() => setMobileView(false)}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-white text-xs bg-red-500 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => {
                setMobileView(false)
                handleLogout()
              }}
              className="text-left px-3 py-2 text-red-500 font-medium">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}