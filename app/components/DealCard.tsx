import { formatPrice } from "@/utils/price";
import { Button } from "./ui/button";
import Image from "next/image";
import { Deal } from "@/utils/dealGenerator";
import Link from "next/link";


interface Props {
  deal: Deal;
}


export function DealCard({ deal }: Props) {
  return (
    <div className="bg-white border overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-[22rem]">
      {/* IMAGE: fixed height */}
      <div className="relative w-full h-40">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover"
          sizes="25vw"
        />
      </div>

      {/* CONTENT: fills remaining space */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{deal.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Round-trip from{" "}
            <span className="font-semibold text-red-700">
              {formatPrice(deal.price)} TND
            </span>
          </p>
          <p className="my-2.5 text-xs text-gray-500">
            Book before <span className="font-bold">{deal.lastDate}</span>
          </p>
        </div>

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
          className="mt-auto"
        >
          <Button className="w-full bg-red-700 hover:bg-red-800">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}