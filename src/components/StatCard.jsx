import React from 'react'

const StatCard = ({title, value}) => {
  return (
    <div>
        <h3 className="text-sm font-semibold text-white dark:text-slate-100">{title}</h3>
        <p className="mt-1 text-3xl font-bold text-white dark:text-slate-100">{value}</p>
        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            All reported bugs to date
        </span>
    </div>
  )
}

export default StatCard