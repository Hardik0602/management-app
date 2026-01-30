import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handle = (e) => {
    e.preventDefault()
    if (login(email, password)) navigate("/")
    else alert("Invalid credentials")
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handle}
        className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-center text-2xl mb-5 font-bold">Login</h2>
        <input
          type="email"
          className="border p-2 w-full mb-2"
          placeholder="Email"
          required
          onChange={e => setEmail(e.target.value)} />
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          required
          onChange={e => setPassword(e.target.value)} />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-400 transition-colors text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}
