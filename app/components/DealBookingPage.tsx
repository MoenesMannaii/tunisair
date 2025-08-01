// 🧼 Cleaned: Removed generateDeals()

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { motion } from 'framer-motion';
import { Plane, User } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import SeatGrid from '@/app/components/SeatMap';
import Image from 'next/image';

export default function DealBookingPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || 'Deal';
  const image = searchParams.get('image') || '';
  const price = Number(searchParams.get('price') || 0);
  const last = searchParams.get('last') || '';

  const [seat, setSeat] = useState<string | null>(null);
  const [passengers, setPassengers] = useState([{ firstName: '', lastName: '', dob: '' }]);
  const [done, setDone] = useState(false);

  const addPassenger = () =>
    setPassengers([...passengers, { firstName: '', lastName: '', dob: '' }]);

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (passengers.some(p => !p.firstName || !p.lastName || !p.dob)) return;
    setDone(true);
  };

  const pnr = useMemo(() => Math.random().toString(36).substr(2, 8).toUpperCase(), []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-12 px-4 sm:px-6 lg:px-8">
      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-lg p-10 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-2xl text-center">
            <Plane size={56} className="mx-auto mb-4" />
            <h2 className="text-4xl font-bold">Booking Confirmed!</h2>
            <p className="mt-3 text-xl">PNR: <span className="font-mono">{pnr}</span></p>
            <p className="mt-1 text-lg">Seat: {seat}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full"
        >
          {/* Left: Hero / Info */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-56 rounded-lg overflow-hidden shadow-2xl">
              <Image src={image} alt={title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-lg mt-1">
                  Round-trip from <span className="font-bold text-red-400">${price}</span>
                </p>
                <Badge variant="outline" className="mt-1">
                  Book before {last}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Seat selection */}
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Badge /> Select your seat
              </h2>
              <Separator className="my-3" />
              <SeatGrid selected={seat} onSelect={setSeat} />
            </div>

            {/* Passenger details */}
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg border p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <User size={24} /> Passenger details
              </h2>
              <Separator className="my-3" />
              <form onSubmit={submitBooking} className="space-y-4">
                {passengers.map((p, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input placeholder="First name" value={p.firstName} onChange={e => {
                      const copy = [...passengers];
                      copy[i].firstName = e.target.value;
                      setPassengers(copy);
                    }} />
                    <Input placeholder="Last name" value={p.lastName} onChange={e => {
                      const copy = [...passengers];
                      copy[i].lastName = e.target.value;
                      setPassengers(copy);
                    }} />
                    <Input type="date" value={p.dob} onChange={e => {
                      const copy = [...passengers];
                      copy[i].dob = e.target.value;
                      setPassengers(copy);
                    }} />
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={addPassenger}>
                    Add Passenger
                  </Button>
                  <Button onClick={submitBooking} disabled={!seat} size="lg">
                    Finish Booking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
