import React from 'react'
const Stats = ({ title, value, icon, color, subtitle, trend }) => {
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      valuText: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      valuText: 'text-green-600',
      border: 'border-green-200'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      valuText: 'text-red-600',
      border: 'border-red-200'
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valuText: 'text-amber-600',
      border: 'border-amber-200'
    }
  }
  const colors = colorConfig[color] || colorConfig.blue
  return (
    <div className={`${colors.bg} rounded-lg border ${colors.border} p-6 transition-all duration-200 hover:shadow-md`}>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-slate-600 mb-3'>{title}</p>
          <p className={`text-3xl font-bold ${colors.valuText}`}>{value}</p>
          {subtitle && (
            <p className='text-xs text-slate-500 mt-2'>{subtitle}</p>
          )}
          {trend && (
            <div className='flex items-center gap-1 mt-2'>
              {trend > 0 ? (
                <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M12 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 11-2 0V8.414l-3.293 3.293a1 1 0 01-1.414 0L9 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0L12 9.586 14.586 7H13a1 1 0 01-1-1z' clipRule='evenodd' />
                </svg>
              ) : (
                <svg className='w-4 h-4 text-red-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M12 13a1 1 0 011 1v4a1 1 0 11-2 0v-2.586l-3.293 3.293a1 1 0 01-1.414 0L9 15.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0L12 16.586 14.586 14H13a1 1 0 01-1-1z' clipRule='evenodd' />
                </svg>
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${colors.iconBg} ${colors.iconText} p-3 rounded-lg`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
export default Stats