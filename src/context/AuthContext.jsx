import { createContext, useContext, useState } from "react"
import { users } from "../data/users"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const login = (email, password) => {
    const found = users.find(
      u => u.email === email && u.password === password
    )

    if (!found) return false

    localStorage.setItem("user", JSON.stringify(found))
    setUser(found)
    return true
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
