import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
const NavBar = () => {
  const { user, logout } = useAuth()
  const { unreadCount } = useTasks()
  const navigate = useNavigate()
  const [mobileView, setMobileView] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const currentPage = ({ isActive }) =>
    isActive
      ? 'flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md transition-all duration-200'
      : 'flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all duration-200'
  return (
    <nav className='bg-white border-b border-slate-200 sticky top-0'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <h1 className='text-xl font-bold text-indigo-600'>TaskFlow</h1>
          <div className='hidden md:flex items-center space-x-1'>
            <NavLink to='/' className={currentPage}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
              </svg>
              <span className='ml-2'>Inbox</span>
            </NavLink>
            <NavLink to='/dashboard' end className={currentPage}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
              </svg>
              <span className='ml-2'>Dashboard</span>
            </NavLink>
            <NavLink to='/notifications' className={currentPage}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
              </svg>
              <span className='ml-2'>Notifications</span>
              {unreadCount > 0 && (
                <span className='ml-1 text-white text-xs bg-red-500 px-2 py-0.5 rounded-full font-semibold'>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
          <div className='hidden md:flex items-center space-x-3'>
            <div className='relative'>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className='flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors duration-200'>
                <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-medium text-slate-600'>
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className='text-sm font-medium text-slate-700'>{user?.name}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {showProfileMenu && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setShowProfileMenu(false)} />
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-20'>
                    <NavLink
                      to='/profile'
                      onClick={() => setShowProfileMenu(false)}
                      className='block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200'>
                      <div className='flex items-center space-x-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                        <span>Profile</span>
                      </div>
                    </NavLink>
                    <div className='border-t border-slate-200 my-1' />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        handleLogout()
                      }}
                      className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200'>
                      <div className='flex items-center space-x-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                        </svg>
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setMobileView(!mobileView)}
              className='p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 relative'>
              {unreadCount > 0 && (
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              )}
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {mobileView ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileView && (
        <div className='md:hidden border-t border-slate-200 bg-white'>
          <div className='px-4 py-3 space-y-1'>
            <NavLink
              to='/'
              className={currentPage}
              onClick={() => setMobileView(false)}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
              </svg>
              <span className='ml-2'>Inbox</span>
            </NavLink>
            <NavLink
              to='/dashboard'
              end
              className={currentPage}
              onClick={() => setMobileView(false)}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
              </svg>
              <span className='ml-2'>Dashboard</span>
            </NavLink>
            <NavLink
              to='/notifications'
              className={currentPage}
              onClick={() => setMobileView(false)}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
              </svg>
              <span className='ml-2'>Notifications</span>
              {unreadCount > 0 && (
                <span className='ml-auto text-white text-xs bg-red-500 px-2 py-0.5 rounded-full font-semibold'>
                  {unreadCount}
                </span>
              )}
            </NavLink>
            <div className='border-t border-slate-200 my-2' />
            <NavLink
              to='/profile'
              className='flex items-center space-x-2 p-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all duration-200'
              onClick={() => setMobileView(false)}>
              <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                <span className='text-sm font-medium text-slate-600'>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{user?.name}</span>
            </NavLink>
            <button
              onClick={() => {
                setMobileView(false)
                handleLogout()
              }}
              className='w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-all duration-200'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
export default NavBar