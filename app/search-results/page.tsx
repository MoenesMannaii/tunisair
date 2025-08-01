'use client'

import { Suspense } from 'react'
import CalendarResultsPage from '@/app/components/ResultsPage'

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading calendar...</div>}>
      <CalendarResultsPage />
    </Suspense>
  )
}
