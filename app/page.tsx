import Hero from "./components/Hero"
import BookingForm from "./components/BookingForm"
import DealsSection from "./components/DealsSection"
import OffersSection from "./components/OfferSection"

export default function Home() {
  return (
    <main>
      <Hero />
      <BookingForm />
      <DealsSection />
      <OffersSection />
    </main>
  )
}
