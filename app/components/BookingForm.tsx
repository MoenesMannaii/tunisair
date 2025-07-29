"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { FiArrowRight, FiRefreshCw, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { airports } from '@/data/airports'
import { Calendar } from '@/app/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/app/components/ui/command'
import { cn } from '@/lib/utils'
import { format, isBefore } from 'date-fns'

/* ---------- TYPES ---------- */
type Flight = {
  id: string
  cityFrom: string
  cityTo: string
  price: number
  dTime: number
  aTime: number
  airlines: string[]
  duration: number
}

type FormState = {
  origin: string
  destination: string
  departingDate: Date | null
  returnDate: Date | null
  passengers: { adults: number; children: number }
  class: string
  isReturn: boolean
}

/* ---------- SUB-COMPONENTS ---------- */
interface AirportAutocompleteInputProps {
  label: string
  value: string
  onChange: (code: string) => void
  placeholder?: string
}

function AirportAutocompleteInput({
  label,
  value,
  onChange,
  placeholder,
}: AirportAutocompleteInputProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return airports
    return airports.filter(
      ({ code, city, country, name }) =>
        code.toLowerCase().startsWith(q) ||
        city.toLowerCase().startsWith(q) ||
        country.toLowerCase().startsWith(q) ||
        name.toLowerCase().includes(q),
    )
  }, [query])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleSelect = (code: string) => {
    onChange(code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {label}
            </label>
            <Input
              value={value}
              onChange={(e) => {
                const v = e.target.value.toUpperCase()
                setQuery(v)
                onChange(v)
                setOpen(true)
              }}
              placeholder={placeholder}
              maxLength={3}
              className="w-full text-sm"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Type city or code…" className="h-9" />
            <CommandEmpty>No airports found.</CommandEmpty>
            <CommandGroup className="max-h-48 overflow-y-auto">
              {filtered.map(({ code, city, country }) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={() => handleSelect(code)}
                >
                  <strong>{code}</strong> — {city}, {country}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ---------- SEAT MAP ---------- */
interface SeatMapProps {
  selected: string | null
  onSelect: (seat: string) => void
}

function SeatMap({ selected, onSelect }: SeatMapProps) {
  const seats = Array.from({ length: 30 }, (_, i) => `A${i + 1}`)
  return (
    <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 rounded">
      {seats.map(seat => (
        <button
          key={seat}
          onClick={() => onSelect(seat)}
          className={`w-10 h-10 rounded text-xs font-semibold transition 
            ${selected === seat ? 'bg-red-700 text-white' : 'bg-white hover:ring'}`}
        >
          {seat}
        </button>
      ))}
    </div>
  )
}

/* ---------- MAIN FORM ---------- */
export default function BookingForm() {
  /* ------------- STATE ------------- */
  const [form, setForm] = useState<FormState>({
    origin: '',
    destination: '',
    departingDate: null,
    returnDate: null,
    passengers: { adults: 1, children: 0 },
    class: 'Economy',
    isReturn: true,
  })

  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ---------- BOOKING FLOW ---------- */
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [step, setStep] = useState<'list' | 'seat' | 'details' | 'done'>('list')
  const [seat, setSeat] = useState<string | null>(null)
  const [passengers, setPassengers] = useState([{ firstName: '', lastName: '', dob: '' }])

  const resultsRef = useRef<HTMLDivElement>(null)

  /* ------------- HELPERS ------------- */
  const handleChange = useCallback(
    <K extends keyof FormState>(name: K, value: FormState[K]) => {
      setForm(prev => {
        if (name === 'isReturn') {
          return { ...prev, [name]: value, returnDate: value ? prev.returnDate : null }
        }
        return { ...prev, [name]: value }
      })
    },
    [],
  )
  const handlePassengerChange = (adults: number, children: number) =>
    handleChange('passengers', { adults, children })

  /* ------------- VALIDATION ------------- */
  const validate = () => {
    const isValidOrigin = airports.some(a => a.code === form.origin)
    const isValidDestination = airports.some(a => a.code === form.destination)
    if (!form.origin || !isValidOrigin) return 'Please enter a valid origin code.'
    if (!form.destination || !isValidDestination) return 'Please enter a valid destination code.'
    if (!form.departingDate) return 'Please select a departing date.'
    if (form.isReturn && (!form.returnDate || isBefore(form.returnDate, form.departingDate)))
      return 'Return date must be after departure.'
    return null
  }

  /* ------------- SEARCH (HARDCODED) ------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const vError = validate()
    if (vError) {
      setError(vError)
      return
    }
    setLoading(true)
    setError(null)
    setFlights([])
    setStep('list')

    const from = airports.find(a => a.code === form.origin)
    const to = airports.find(a => a.code === form.destination)
    if (!from || !to) {
      setError('Unknown airport')
      setLoading(false)
      return
    }

    const base = 180 + Math.floor(Math.random() * 350)
    const mult = form.passengers.adults + form.passengers.children
    const depEpoch = (form.departingDate?.getTime() ?? Date.now()) / 1000
    const retEpoch = (form.returnDate?.getTime() ?? depEpoch + 86400) / 1000

    const outbound: Flight = {
      id: `out-${Date.now()}`,
      cityFrom: from.city,
      cityTo: to.city,
      price: base * mult,
      dTime: depEpoch + 8 * 3600,
      aTime: depEpoch + 12 * 3600,
      airlines: ['TU'],
      duration: 4 * 3600,
    }
    const flightsToShow: Flight[] = [outbound]
    if (form.isReturn && form.returnDate) {
      const inbound: Flight = {
        id: `in-${Date.now()}`,
        cityFrom: to.city,
        cityTo: from.city,
        price: (base - 20 + Math.floor(Math.random() * 50)) * mult,
        dTime: retEpoch + 14 * 3600,
        aTime: retEpoch + 18 * 3600,
        airlines: ['TU'],
        duration: 4 * 3600,
      }
      flightsToShow.push(inbound)
    }

    setFlights(flightsToShow)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300)
    setLoading(false)
  }

  /* ---------- SEAT / BOOKING LOGIC ---------- */
  const handleBook = (flight: Flight) => {
    setSelectedFlight(flight)
    setStep('seat')
  }
  const handleSeatNext = () => {
    if (!seat) return
    setStep('details')
  }
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (passengers.some(p => !p.firstName || !p.lastName || !p.dob)) return
    setStep('done')
  }
  const addPassenger = () =>
    setPassengers([...passengers, { firstName: '', lastName: '', dob: '' }])

 

  return (
    <div className="w-full flex justify-center py-8 px-2 sm:px-6 lg:px-8 -mt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-gradient-to-t from-gray-50 to-transparent rounded-b-2xl p-4 sm:p-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
          Plan Your Journey with Tunisair
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Book your flights effortlessly
        </p>

        {/* SEARCH FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1">
            <AirportAutocompleteInput label="From" value={form.origin} onChange={v => handleChange('origin', v)} placeholder="TUN" />
          </div>
          <div className="col-span-1">
            <AirportAutocompleteInput label="To" value={form.destination} onChange={v => handleChange('destination', v)} placeholder="PAR" />
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Departing</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !form.departingDate && 'text-gray-500')}>
                  {form.departingDate ? format(form.departingDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={form.departingDate || undefined} onSelect={d => handleChange('departingDate', d ?? null)} disabled={{ before: new Date() }} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Return</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={!form.isReturn} className={cn('w-full justify-start text-left font-normal', !form.returnDate && 'text-gray-500', !form.isReturn && 'opacity-50 cursor-not-allowed')}>
                  {form.returnDate ? format(form.returnDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={form.returnDate || undefined} onSelect={d => handleChange('returnDate', d ?? null)} disabled={{ before: form.departingDate ?? new Date() }} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Flight Options</label>
            <Select value={form.isReturn ? 'Return' : 'One Way'} onValueChange={v => handleChange('isReturn', v === 'Return')}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Return">Return</SelectItem>
                <SelectItem value="One Way">One Way</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Passengers</label>
            <Select
              value={`${form.passengers.adults} Adult${form.passengers.adults !== 1 ? 's' : ''}, ${form.passengers.children} Child${form.passengers.children !== 1 ? 'ren' : ''}`}
              onValueChange={v => {
                const [a, c] = v.split(',').map(x => parseInt(x.split(' ')[0]))
                handlePassengerChange(a, c)
              }}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['1 Adult, 0 Children', '2 Adults, 0 Children', '2 Adults, 1 Child', '3 Adults, 0 Children'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Class</label>
            <Select value={form.class} onValueChange={v => handleChange('class', v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="First">First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1 py-2" />
            <Button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white">
              {loading ? (
                <span className="flex items-center gap-2"><FiRefreshCw className="animate-spin" /> Searching...</span>
              ) : (
                <span className="flex items-center gap-2"><FiArrowRight /> Continue</span>
              )}
            </Button>
          </div>
        </form>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex items-center justify-center gap-2 text-red-700 text-sm font-semibold"
            >
              <span>{error}</span>
              <FiX className="cursor-pointer" onClick={() => setError(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOW STEPS */}
        {step === 'list' && (
          <AnimatePresence>
            {flights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 max-h-96 overflow-y-auto space-y-4 pr-2"
              >
                {flights.map(flight => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {flight.cityFrom} <FiArrowRight className="inline mx-1 text-red-700" /> {flight.cityTo}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(flight.dTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                          {new Date(flight.aTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {Math.floor(flight.duration / 3600)}h {Math.floor((flight.duration % 3600) / 60)}m
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-red-700">${flight.price}</p>
                        <Button onClick={() => handleBook(flight)}>Book</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {step === 'seat' && selectedFlight && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <h3 className="text-xl font-bold mb-4">Select Your Seat</h3>
            <SeatMap selected={seat} onSelect={setSeat} />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSeatNext} disabled={!seat}>Next</Button>
            </div>
          </motion.div>
        )}

        {step === 'details' && selectedFlight && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <h3 className="text-xl font-bold mb-4">Passenger Details</h3>
            {passengers.map((p, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="First Name"
                  value={p.firstName}
                  onChange={e => {
                    const copy = [...passengers]
                    copy[i].firstName = e.target.value
                    setPassengers(copy)
                  }}
                />
                <Input
                  placeholder="Last Name"
                  value={p.lastName}
                  onChange={e => {
                    const copy = [...passengers]
                    copy[i].lastName = e.target.value
                    setPassengers(copy)
                  }}
                />
                <Input
                  type="date"
                  value={p.dob}
                  onChange={e => {
                    const copy = [...passengers]
                    copy[i].dob = e.target.value
                    setPassengers(copy)
                  }}
                />
              </div>
            ))}
            <form onSubmit={handleSubmitBooking} className="flex items-center gap-4">
  <Button onClick={addPassenger} variant="outline" type="button">
    Add Passenger
  </Button>
  <Button type="submit">Finish Booking</Button>
</form>
          </motion.div>
        )}

        {step === 'done' && selectedFlight && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-green-50 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-green-800">Booking Confirmed!</h3>
            <p className="mt-2 text-green-700">
              Your PNR: <span className="font-mono">{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </p>
            <p className="text-sm mt-2">Seat: {seat}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}