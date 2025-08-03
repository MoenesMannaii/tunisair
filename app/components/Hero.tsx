import * as images from "../../assets/image";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-t from-[#ffffff] to-[#cae6ff] flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center min-h-screen">
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">
        <span className="uppercase  text-xs md:text-sm font-semibold text-red-700 tracking-widest">
          Tunisair Exclusive
        </span>
        <h1 className="mt-2 text-5xl text-left md:text-center sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
          Discover the World with Confidence
        </h1>
        <p className="mt-3 max-w-lg text-left md:text-center mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
          Fly to over 80 destinations worldwide with award‑winning service and
          unmatched comfort. Let Tunisair elevate your travel experience.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button className="bg-red-700 text-white px-4 py-2 text-sm sm:text-sm font-bold rounded shadow hover:bg-red-800 transition">
            View Destinations
          </Button>
          {/*  <button className="border border-red-700 text-red-700 px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-50 transition">
        View Destinations
      </button> */}
        </div>
      </div>

      <div className="mt-4 w-full flex justify-center z-50">
        <Image
          src={images.AirbusXXX}
          alt="Airplane"
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-5xl object-contain hidden md:block"
          priority
          quality={90}
        />
      </div>
    </section>
  );
}
