'use client'

import { Suspense } from 'react'
import CalendarResultsPage from '@/app/components/ResultsPage'

function CalendarFallback() {

  
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row border border-gray-200 rounded overflow-hidden mt-16 animate-pulse">
      <div className="flex-1 p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />

        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-1/3" />
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 border rounded" />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-1/3" />
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 border rounded" />
            ))}
          </div>
        </div>
      </div>

      <aside className="hidden md:block w-96 p-8 bg-gray-50 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/2" />
        <div className="h-px bg-gray-200" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
        ))}
        <div className="h-px bg-gray-200" />
        <div className="h-10 bg-red-300 rounded w-full mt-4" />
      </aside>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<CalendarFallback />}>
      <CalendarResultsPage />
    </Suspense>
  )
}
