import React from 'react'

export default function BugCard({ bug, onClick }) {
  return (
    <div
      className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-indigo-600 transition cursor-pointer"
      onClick={() => onClick?.(bug)}   
    >
      <h3 className="text-lg font-semibold text-white truncate">{bug.title}</h3>
      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{bug.description || 'No description'}</p>
      <div className="mt-4 flex gap-3 text-xs">
        <span className={`px-2 py-1 rounded-full ${
          bug.severity === 'critical' ? 'bg-red-900 text-red-300' :
          bug.severity === 'high' ? 'bg-orange-900 text-orange-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {bug.severity.toUpperCase()}
        </span>
        <span className="px-2 py-1 rounded-full bg-blue-900 text-blue-300">
          {bug.status}
        </span>
      </div>
    </div>
  );
}
