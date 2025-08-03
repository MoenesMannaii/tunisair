// AdvancedDealsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "./FitlerBar";
import { DealCard } from "@/app/components/DealCard";

// 👇 import a *stable* list instead of regenerating it
import { staticDeals } from "@/utils/staticDeals";

export default function AdvancedDealsSection() {
  const [filters, setFilters] = useState({
    type: "Round-Trip",
    month: "August",
    region: "All",
    sort: "Top Deal",
  });

  const filtered = useMemo(() => {
    let out = staticDeals;

    if (filters.type !== "All")
      out = out.filter((d) => d.type === filters.type);
    if (filters.month !== "All")
      out = out.filter((d) => d.month === filters.month);
    if (filters.region !== "All")
      out = out.filter((d) => d.region === filters.region);

    if (filters.sort === "Price")
      out.sort((a, b) => a.price - b.price);
    if (filters.sort === "Alphabet")
      out.sort((a, b) => a.title.localeCompare(b.title));

    return out;
  }, [filters]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Find your next trip
        </h2>
        <FilterBar value={filters} onChange={setFilters} />

        {filtered.length === 0 ? (
            <div className="h-44 flex items-center justify-center bg-white border">

                <p className="text-center text-lg text-gray-500">No flight matches your criteria.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}