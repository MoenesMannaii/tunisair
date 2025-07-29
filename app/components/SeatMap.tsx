"use client"

interface SeatMapProps {
  onSelect: (seat: string) => void
  selected: string | null
}

export default function SeatMap({ onSelect, selected }: SeatMapProps) {
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