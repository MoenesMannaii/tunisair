'use client'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { Separator } from '@/app/components/ui/separator'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Ticket, Calendar } from 'lucide-react'

/* ---------- SEAT MAP ---------- */
function SeatGrid({ selected, onSelect }: { selected: string | null; onSelect: (s: string) => void }) {
  const seats = Array.from({ length: 30 }, (_, i) => `A${i + 1}`)
  return (
    <div className="grid grid-cols-6 gap-2">
      {seats.map(seat => (
        <motion.button
          key={seat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(seat)}
          className={`w-12 h-12 rounded-lg text-sm font-bold transition
            ${selected === seat
              ? 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-xl'
              : 'bg-white/20 hover:bg-white/30 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 border border-slate-300 dark:border-slate-600'}`}
        >
          {seat}
        </motion.button>
      ))}
    </div>
  )
}

/* ---------- MAIN PAGE ---------- */
export default function DealBookingPage() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'Deal'
  const image = searchParams.get('image') || ''
  const price = Number(searchParams.get('price') || 0)
  const last = searchParams.get('last') || ''

  const [seat, setSeat] = useState<string | null>(null)
  const [passengers, setPassengers] = useState([{ firstName: '', lastName: '', dob: '' }])
  const [done, setDone] = useState(false)

  const addPassenger = () =>
    setPassengers([...passengers, { firstName: '', lastName: '', dob: '' }])

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (passengers.some(p => !p.firstName || !p.lastName || !p.dob)) return
    setDone(true)
  }

  const pnr = useMemo(() => Math.random().toString(36).substr(2, 8).toUpperCase(), [])

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-20 px-4 sm:px-6 lg:px-8">
      {done ? (
  <>
  <Transition show={done} as={Fragment}>
    <Dialog as="div" className="fixed inset-0 z-50" onClose={() => {}}>
      {/* Overlay */}
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </Transition.Child>

      {/* Modal content */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col bg-white">
        
        {/* 🔼 Top Banner */}
     <div className="relative w-full h-80 sm:h-[620px]">
          <div
            className="bg-gray-100 h-full"
          />
         {/*  <div className="absolute inset-0 bg-black/30" /> */}
        </div>

        {/* 🔽 Booking Confirmation Content */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-6"
        >
          <div className="w-full px-6 py-12 sm:px-8 sm:py-16">
            <div className="max-w-2xl mx-auto bg-white border rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col items-center text-center space-y-6">
              
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg animate-pulse">
                <Plane size={32} />
              </div>

              <Dialog.Title as="h3" className="text-3xl sm:text-4xl font-bold text-slate-900">
                Booking Confirmed
              </Dialog.Title>
              <p className="text-md sm:text-lg text-slate-600">
                Your reservation has been successfully secured.
              </p>

              <Separator />

              {/* Booking Details */}
              <div className="grid sm:grid-cols-2 gap-6 w-full text-left">
                <div className="flex items-center gap-3">
                  <Ticket className="text-red-500" />
                  <div>
                    <p className="text-sm text-slate-500">PNR</p>
                    <p className="text-lg font-mono font-bold text-slate-900">{pnr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-red-500" />
                  <div>
                    <p className="text-sm text-slate-500">Seat</p>
                    <p className="text-lg font-semibold text-slate-900">{seat}</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full mt-6 bg-red-700 hover:bg-red-800 rounded text-white text-md font-semibold"
                onClick={() => window.location.replace('/')}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
</>



      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full"
        >
          {/* Left: Hero / Info */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-full overflow-hidden shadow-2xl">
              <Image src={image} alt={title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-lg mt-1">
                  Round-trip from <span className="font-bold text-red-400">${price}</span>
                </p>
                <div className="mt-3">
                  <span className="px-3 py-1 bg-red-600/80 rounded-full text-sm">
                    Book before {last}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Seat selection */}
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <MdOutlineAirlineSeatReclineExtra size={24} /> Select your seat
              </h2>
              <Separator className="my-3" />
              <SeatGrid selected={seat} onSelect={setSeat} />
            </div>

            {/* Passenger details */}
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaPersonWalkingLuggage size={24} /> Passenger details
              </h2>
              <Separator className="my-3" />
              <form onSubmit={submitBooking} className="space-y-4">
                {passengers.map((p, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="First name" value={p.firstName} onChange={e => {
                      const copy = [...passengers]
                      copy[i].firstName = e.target.value
                      setPassengers(copy)
                    }} />
                    <Input placeholder="Last name" value={p.lastName} onChange={e => {
                      const copy = [...passengers]
                      copy[i].lastName = e.target.value
                      setPassengers(copy)
                    }} />
                    <Input type="date" value={p.dob} onChange={e => {
                      const copy = [...passengers]
                      copy[i].dob = e.target.value
                      setPassengers(copy)
                    }} />
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={addPassenger}>
                    Add Passenger
                  </Button>
                  <Button onClick={submitBooking} disabled={!seat} size="lg" className="px-4">
                    Finish Booking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  )
}