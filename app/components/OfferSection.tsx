import Link from "next/link";
import { Button } from "./ui/button";

// components/OffersSection.tsx
export default function OffersSection() {
  return (
       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl text-center font-black text-slate-900">
          Plan your next flight from Tunisia
        </h2>
        <p className="mt-2 text-center text-slate-600">
          No offers for your country — discover alternatives below.
        </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/special-offers">
          <Button className="bg-red-700 text-white px-4 py-2 text-sm sm:text-sm font-bold rounded shadow hover:bg-red-800 transition">
            View other Offers
          </Button>

       </Link>
        </div>
      </div>
    </section>
  );
}