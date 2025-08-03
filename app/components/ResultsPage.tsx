'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { format, addDays, isSameDay, isBefore } from 'date-fns'
import { airports } from '@/data/airports'
import { Separator } from '../components/ui/separator'
import { FaPlane } from 'react-icons/fa6'

export default function CalendarResultsPage() {

  const sp = useSearchParams()
  const from = sp.get('from') || ''
  const to = sp.get('to') || ''
  const depart = sp.get('depart') || ''
  const ret = sp.get('ret') || ''
  const pax = sp.get('pax') || '1A'

  // Extract passenger details from pax parameter
  const passengerDetails = useMemo(() => {
    return pax.match(/(\d+)([A-Z])/g)?.map(part => {
      const [count, type] = part.match(/(\d+)([A-Z])/)!.slice(1)
      return { count: parseInt(count), type }
    }) || [{ count: 1, type: 'A' }]
  }, [pax])

  const origin = airports.find(a => a.code === from)
  const destination = airports.find(a => a.code === to)

  const departDate = useMemo(() => {
    return new Date(depart)
  }, [depart])

  const returnDate = useMemo(() => {
    return ret ? new Date(ret) : undefined
  }, [ret])

  const [selectedDepart, setSelectedDepart] = useState<Date | null>(departDate)
  const [selectedReturn, setSelectedReturn] = useState<Date | null>(returnDate || null)

  const days = 10
  const departDays = useMemo(
    () => Array.from({ length: days }, (_, i) => addDays(departDate, i - 2)),
    [departDate]
  )

  const returnDays = useMemo(() => {
    if (!returnDate) return []
    return Array.from({ length: days }, (_, i) => addDays(returnDate, i - 2))
  }, [returnDate])

  const [showSummary, setShowSummary] = useState(false)

  const renderDateCard = (date: Date, selectedDate: Date | null, onClick: () => void, locked = false) => {
    const isSelected = selectedDate && isSameDay(date, selectedDate)
    const isPast = isBefore(date, new Date())
    const isUnavailable = locked || isPast

    return (
      <div
        key={date.toISOString()}
        onClick={!isUnavailable ? onClick : undefined}
        className={`border p-2 text-center cursor-pointer transition-all text-sm
          ${isSelected ? 'bg-red-700 text-white font-bold' : ''}
          ${isUnavailable ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'hover:shadow'}
        `}
      >
        <p className="text-xs uppercase">{format(date, 'EEEE')}</p>
        <Separator className="hidden sm:block my-1" />
        <p className="text-xl">{format(date, 'dd')}</p>
        <p className="mt-1 text-xs">{isUnavailable ? 'N/A' : 'From TND 000'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row border border-gray-200 rounded overflow-hidden relative">
      {/* Calendar Section */}
      <section className="flex-1 p-6 mt-16">
        <h1 className="flex items-center gap-4 text-2xl md:text-3xl font-bold mb-2">
          {origin?.city} <FaPlane /> {destination?.city}
        </h1>
        <p className="text-slate-500 mb-8">
          Depart {format(departDate, 'PPP')} {returnDate && `· Return ${format(returnDate, 'PPP')}`}
        </p>

        {/* Outbound Calendar */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Select your departure date</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-4">
            {departDays.map(date => renderDateCard(date, selectedDepart, () => setSelectedDepart(date)))}
          </div>
        </section>

        {/* Return Calendar */}
        {ret && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Select your return date</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-4">
              {returnDays.map(date => renderDateCard(date, selectedReturn, () => setSelectedReturn(date)))}
            </div>
          </section>
        )}
      </section>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-gray-200" />

      {/* Summary Section for medium+ screens */}
      <aside className="hidden md:block w-96 p-8 mt-16 bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Your Booking</h3>
        <Separator className="mb-4" />
        <p className="text-sm mb-2">
          Passenger{passengerDetails.reduce((acc, pd) => acc + pd.count, 0) > 1 ? 's' : ''}: <strong>{passengerDetails.map(pd => `${pd.count} ${pd.type}`).join(', ')}</strong>
        </p>
        <Separator className="mb-4" />
        <p className="text-sm mb-2">
          From: <strong>{from}</strong>
        </p>
        <p className="text-sm mb-2">
          To: <strong>{to}</strong>
        </p>
        <Separator className="mb-4" />
        <p className="text-sm mb-2">
          Departure: <strong>{selectedDepart ? format(selectedDepart, 'PPP') : '--'}</strong>
        </p>
        {ret && (
          <p className="text-sm mb-4">
            Return: <strong>{selectedReturn ? format(selectedReturn, 'PPP') : '--'}</strong>
          </p>
        )}
        <div className="mt-4">
          <button
            disabled={!selectedDepart || (!!ret && !selectedReturn)}
            className="w-full bg-red-700 text-white py-2 px-4 rounded font-bold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </aside>

      {/* Summary bar and popover for small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 z-30">
        {/* Summary header bar */}
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full px-6 py-3 text-left font-semibold text-lg flex justify-between items-center"
          aria-expanded={showSummary}
          aria-controls="summary-popover"
        >
          Your Booking
          <span className="ml-2">{showSummary ? '▼' : '▲'}</span>
        </button>

        {/* Sliding panel / popover */}
        <div
          id="summary-popover"
          className={`overflow-auto bg-gray-50 border-t border-gray-200 max-h-0 transition-all duration-300 ease-in-out ${
            showSummary ? 'max-h-[50vh] p-6' : 'p-0'
          }`}
        >
          {showSummary && (
            <>
              <p className="text-sm mb-2">
                <strong>{passengerDetails.map(pd => `${pd.count} ${pd.type}`).join(', ')}</strong> Traveller{passengerDetails.reduce((acc, pd) => acc + pd.count, 0) > 1 ? 's' : ''}
              </p>
              <Separator className="mb-4" />
              <p className="text-sm mb-2">
                From: <strong>{from}</strong>
              </p>
              <p className="text-sm mb-2">
                To: <strong>{to}</strong>
              </p>
              <Separator className="mb-4" />
              <p className="text-sm mb-2">
                Departure: <strong>{selectedDepart ? format(selectedDepart, 'PPP') : '--'}</strong>
              </p>
              {ret && (
                <p className="text-sm mb-4">
                  Return: <strong>{selectedReturn ? format(selectedReturn, 'PPP') : '--'}</strong>
                </p>
              )}
              <div className="mt-4">
                <button
                  disabled={!selectedDepart || (!!ret && !selectedReturn)}
                  className="w-full bg-red-700 text-white py-2 px-4 rounded font-bold disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}