import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handle = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/')
      } else {
        toast.error('Invalid credentials')
        setIsLoading(false)
      }
    }, 800)
  }
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 p-8'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-slate-900 mb-2'>Sign In</h1>
            <p className='text-slate-600 text-sm'>Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handle} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Email Address
              </label>
              <input
                type='email'
                className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400'
                placeholder='name@company.com'
                value={email}
                required
                onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='block text-sm font-medium text-slate-700'>
                  Password
                </label>
                {/* <a href='#' className='text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200'>
                  Forgot password?
                </a> */}
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400 pr-11'
                  placeholder='Enter your password'
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)} />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200'>
                  {showPassword ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* <div className='flex items-center'>
              <input
                type='checkbox'
                id='remember'
                className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500'
              />
              <label htmlFor='remember' className='ml-2 text-sm text-slate-700 cursor-pointer'>
                Keep me signed in
              </label>
            </div> */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full cursor-pointer py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
              {isLoading ? (
                <span className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login