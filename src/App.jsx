import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Inbox from "./pages/Inbox"
import TaskDetail from "./pages/TaskDetail"
import Notifications from "./pages/Notifications"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import { TaskProvider } from "./context/TaskContext"
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
        <Route index element={<Inbox />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="task/:id" element={<TaskDetail />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </>
  )
)
export default function App() {
  return <TaskProvider><RouterProvider router={router} /></TaskProvider>
}