"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

type Deal = {
  id: string;
  title: string;
  image: string;
  price: number;
  lastDate: string;
};

function generateDeals(): Deal[] {
  const destinations = [
    {
      city: "France",
      code: "CDG",
      image: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg",
    },
    {
      city: "Italy",
      code: "FCO",
      image: "https://images.pexels.com/photos/1796736/pexels-photo-1796736.jpeg",
    },
    {
      city: "Germany",
      code: "FRA",
      image: "https://images.pexels.com/photos/23106809/pexels-photo-23106809.jpeg",
    },
    {
      city: "Spain",
      code: "MAD",
      image: "https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg",
    },
  ];

  const year = new Date().getFullYear();
  const lastDay = 30;
  const lastMonth = "August";

  return destinations.map((dest, i) => ({
    id: `deal-${i}`,
    title: `Tunis → ${dest.city}`,
    image: dest.image,
    price: 129 + Math.floor(Math.random() * 250),
    lastDate: `${lastDay} ${lastMonth} ${year}`,
  }));
}

export default function DealsSection() {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const generated = generateDeals();
    setDeals(generated);
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Discover our best deals
        </h2>

        {deals.length === 0 ? (
          <p className="text-center text-gray-500">Loading deals...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {deal.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Round-trip starting from{" "}
                    <span className="font-semibold text-red-700">
                      ${deal.price}
                    </span>
                  </p>
                  <p className="my-2.5 text-xs text-gray-500">
                    Book before{" "}
                    <span className="font-bold">{deal.lastDate}</span>
                  </p>

                  <Link
                    href={{
                      pathname: `/deals/${deal.id}`,
                      query: {
                        title: deal.title,
                        image: deal.image,
                        price: deal.price,
                        last: deal.lastDate,
                      },
                    }}
                  >
                    <Button className="w-full bg-red-700 hover:bg-red-800 text-white">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="relative w-full h-[550px] my-6 col-span-1 sm:col-span-2 lg:col-span-4 overflow-hidden border-8 border-white">
          <Image
            src="https://i.pinimg.com/1200x/1f/25/57/1f2557abb315e35ddc8b4b9ed09fdfd0.jpg"
            alt="Special Offer"
            fill
            className="object-cover w-full h-full object-top"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute w-22 h-22 sm:w-44 sm:h-44 top-0 right-6 sm:right-12">
            <Image
              src="https://www.tunisair.com/sites/default/files/inline-images/Group%201455%20%281%29.png"
              alt="Special Offer"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <div className="absolute top-4 left-4 max-w-md p-2">
            <span className="uppercase text-white font-semibold">Fidelys</span>
          </div>
          <div className="absolute bottom-12 left-4 text-white p-4 max-w-lg space-y-4">
            <h3 className="text-lg sm:text-3xl font-bold">Your satisfaction is our priority</h3>
            <Link href="/" className="text-xs sm:text-sm mt-1 w-full hover:underline">
              <span className="text-base text-red-600">ᯓ✈︎</span> WELCOME TO A WORLD OF BENEFITS
            </Link>
          </div>
        </div>
      </div>
      {/* Full-width image banner after the cards */}
    </section>
  );
}