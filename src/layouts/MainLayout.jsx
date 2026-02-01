import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
const MainLayout = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />
      <Outlet />
    </div>
  )
}
export default MainLayout