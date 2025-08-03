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
import { MdFlightClass, MdFlightLand, MdFlightTakeoff, MdOutlineAirplaneTicket, MdOutlineCalendarMonth } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { PiUsersThree } from "react-icons/pi";



type FormState = {
  origin: string
  destination: string
  departingDate: Date | null
  returnDate: Date | null
  passengers: { adults: number; youths: number; children: number; infants: number }
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

/* ---------- PASSENGERS MODAL ---------- */
interface PassengersModalProps {
  isOpen: boolean
  onClose: () => void
  passengers: FormState['passengers']
  onConfirm: (passengers: FormState['passengers']) => void
}

function PassengersModal({
  isOpen,
  onClose,
  passengers,
  onConfirm,
}: PassengersModalProps) {
  const [localPassengers, setLocalPassengers] = useState(passengers)

  const handlePassengerChange = (type: keyof FormState['passengers'], delta: number) => {
    const newCount = Math.max(0, localPassengers[type] + delta)
    setLocalPassengers({ ...localPassengers, [type]: newCount })
  }

  const handleConfirm = () => {
    onConfirm(localPassengers)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white p-6 w-lg rounded-3xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Choose Passengers</h3>
              <button onClick={onClose} className="text-xl cursor-pointer text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePassengerChange('adults', -1)}
                    disabled={localPassengers.adults <= 1}
                    className="border px-2 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{localPassengers.adults}</span>
                  <button
                    onClick={() => handlePassengerChange('adults', 1)}
                    className="border px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Youths</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePassengerChange('youths', -1)}
                    disabled={localPassengers.youths <= 0}
                    className="border px-2 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{localPassengers.youths}</span>
                  <button
                    onClick={() => handlePassengerChange('youths', 1)}
                    className="border px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Children</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePassengerChange('children', -1)}
                    disabled={localPassengers.children <= 0}
                    className="border px-2 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{localPassengers.children}</span>
                  <button
                    onClick={() => handlePassengerChange('children', 1)}
                    className="border px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Infants</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePassengerChange('infants', -1)}
                    disabled={localPassengers.infants <= 0}
                    className="border px-2 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{localPassengers.infants}</span>
                  <button
                    onClick={() => handlePassengerChange('infants', 1)}
                    className="border px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={onClose} className="mr-2 cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleConfirm} className='cursor-pointer'>
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
    passengers: { adults: 1, youths: 0, children: 0, infants: 0 },
    class: 'Economy',
    isReturn: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isPassengersModalOpen, setPassengersModalOpen] = useState(false)

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

  const handlePassengerChange = (passengers: FormState['passengers']) => {
    handleChange('passengers', passengers)
  }

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
/*   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const vError = validate()
    if (vError) {
      setError(vError)
      return
    }
    setLoading(true)
    setError(null)

    const from = airports.find(a => a.code === form.origin)
    const to = airports.find(a => a.code === form.destination)
    if (!from || !to) {
      setError('Unknown airport')
      setLoading(false)
      return
    }

    setLoading(false)
  } */

  const router = useRouter();
const handleSearch = () => {
  const { origin, destination, departingDate, returnDate, passengers } = form;
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    depart: departingDate ? format(departingDate, 'yyyy-MM-dd') : '',
    ret: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
    pax: `${passengers.adults}A${passengers.youths}Y${passengers.children}C${passengers.infants}I`,
  });
  router.push(`/search-results?${params.toString()}`);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const vError = validate();
  if (vError) {
    setError(vError);
    return;
  }

  setError(null);
  setLoading(true);

  const { origin, destination, departingDate, returnDate, passengers } = form;

  const params = new URLSearchParams({
    from: origin,
    to: destination,
    depart: departingDate ? format(departingDate, 'yyyy-MM-dd') : '',
    ret: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
    pax: `${passengers.adults}A${passengers.youths}Y${passengers.children}C${passengers.infants}I`,
  });

  router.push(`/search-results?${params.toString()}`);
  setLoading(false);
};


  return (
    <div className="w-full flex justify-center py-24 px-2 sm:px-6 lg:px-8 -mt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl  rounded-b-2xl p-4 sm:p-8"
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
    <label className="flex items-center space-x-1">
      <MdFlightTakeoff className="text-lg text-red-700" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>From</span>
    </label>
    <AirportAutocompleteInput label="" value={form.origin} onChange={v => handleChange('origin', v)} placeholder="TUN" />
  </div>
  <div className="col-span-1">
    <label className="flex items-center space-x-1">
      <MdFlightLand className="text-lg text-red-700" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>Arriving at</span>
    </label>
    <AirportAutocompleteInput label="" value={form.destination} onChange={v => handleChange('destination', v)} placeholder="PAR" />
  </div>

  <div className="col-span-1">
    <label className="flex items-center space-x-1">
      <MdOutlineCalendarMonth className="text-lg text-red-700 mb-0.5" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>Departing Date</span>
    </label>
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
    <label className="flex items-center space-x-1">
      <MdOutlineCalendarMonth className="text-lg text-red-700 mb-0.5" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>Return Date</span>
    </label>
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
    <label className="flex items-center space-x-1">
      <MdOutlineAirplaneTicket className="text-lg text-red-700" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>Flight Options</span>
    </label>
    <Select value={form.isReturn ? 'Return' : 'One Way'} onValueChange={v => handleChange('isReturn', v === 'Return')}>
      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Return">Return</SelectItem>
        <SelectItem value="One Way">One Way</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="col-span-1 sm:col-span-2 lg:col-span-1">
    <label className="flex items-center space-x-1">
      <PiUsersThree className="text-lg text-red-700" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>Passengers</span>
    </label>
    <Button
      type="button" // Add this attribute to prevent form submission
      variant="outline"
      onClick={() => setPassengersModalOpen(true)}
      className="w-full justify-start text-left font-normal"
    >
      {form.passengers.adults > 0 ||
      form.passengers.youths > 0 ||
      form.passengers.children > 0 ||
      form.passengers.infants > 0
        ? `${form.passengers.adults} Adults, ${form.passengers.youths} Youths, ${form.passengers.children} Children, ${form.passengers.infants} Infants`
        : 'Choose Passengers'}
    </Button>
  </div>

  <div className="col-span-1 sm:col-span-2 lg:col-span-1">
    <label className="flex items-center space-x-1">
      <MdFlightClass className="text-lg text-red-700" />
      <span className='block text-xs font-semibold text-gray-700 uppercase tracking-wide'>Class</span>
    </label>
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
    <div className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-0.5 py-2" />
    <Button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white">
      {loading ? (
        <span className="flex items-center gap-2"><FiRefreshCw className="animate-spin" /> Searching...</span>
      ) : (
        <span className="flex items-center gap-2"><FiArrowRight /> Check Flights</span>
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

      {/* PASSENGERS MODAL */}
      <PassengersModal
        isOpen={isPassengersModalOpen}
        onClose={() => setPassengersModalOpen(false)}
        passengers={form.passengers}
        onConfirm={(passengers) => {
          handlePassengerChange(passengers)
          setPassengersModalOpen(false)
        }}
      />
    </motion.div>
  </div>
)
}