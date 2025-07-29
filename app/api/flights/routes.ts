// app/api/flights/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { airports } from '@/data/airports'

interface Flight {
  id: string
  cityFrom: string
  cityTo: string
  price: number
  dTime: number
  aTime: number
  airlines: string[]
  duration: number
}

function makeFakeFlights(
  origin: string,
  destination: string,
  dateFrom: string,
  dateTo?: string,
  passengers = '1',
): Flight[] {
  const originAirport = airports.find(a => a.code === origin.toUpperCase())
  const destAirport = airports.find(a => a.code === destination.toUpperCase())

  if (!originAirport || !destAirport) return []

  const basePrice = Math.floor(Math.random() * 400) + 150 // 150–549 USD
  const multiplier = Number(passengers) || 1
  const day = new Date(dateFrom.split('/').reverse().join('-'))
  const retDay = dateTo ? new Date(dateTo.split('/').reverse().join('-')) : day

  const outbound: Flight = {
    id: crypto.randomUUID(),
    cityFrom: originAirport.city,
    cityTo: destAirport.city,
    price: basePrice * multiplier,
    dTime: Math.floor(day.getTime() / 1000) + 8 * 3600, // 08:00 local
    aTime: Math.floor(day.getTime() / 1000) + 12 * 3600, // 12:00 local
    airlines: ['TU'],
    duration: 4 * 3600, // 4h
  }

  if (!dateTo) return [outbound]

  const inbound: Flight = {
    id: crypto.randomUUID(),
    cityFrom: destAirport.city,
    cityTo: originAirport.city,
    price: (basePrice - 30 + Math.floor(Math.random() * 60)) * multiplier,
    dTime: Math.floor(retDay.getTime() / 1000) + 14 * 3600,
    aTime: Math.floor(retDay.getTime() / 1000) + 18 * 3600,
    airlines: ['TU'],
    duration: 4 * 3600,
  }

  return [outbound, inbound]
}

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams
  const origin = sp.get('fly_from') || ''
  const destination = sp.get('fly_to') || ''
  const dateFrom = sp.get('date_from') || ''
  const dateTo = sp.get('date_to') || ''
  const passengers = sp.get('passengers') || '1'

  if (!origin || !destination || !dateFrom)
    return NextResponse.json({ data: [] }, { status: 400 })

  const flights = makeFakeFlights(origin, destination, dateFrom, dateTo, passengers)
  return NextResponse.json({ data: flights })
}