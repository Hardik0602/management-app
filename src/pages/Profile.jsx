import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="p-3">
      <div className="bg-white w-full md:w-lg p-6 rounded shadow text-center mx-auto">
        <h2 className="font-bold text-xl mb-5">{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  )
}
