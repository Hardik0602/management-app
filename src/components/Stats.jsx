import React from 'react'
const Stats = ({ title, value }) => {
    return (
        <div className="bg-white w-80 p-6 rounded shadow text-center hover:-translate-y-1 transition">
            <h2 className="text-2xl font-bold mb-5">{title}</h2>
            <p className="text-2xl font-semibold text-gray-500">{value}</p>
        </div>
    )
}
export default Stats