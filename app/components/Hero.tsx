import * as images from "../../assets/image";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center min-h-screen">
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">
        <span className="uppercase text-xs md:text-sm font-semibold text-red-700 tracking-widest">
          Tunisair Exclusive
        </span>
        <h1 className="mt-2 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
          Discover the World with Confidence
        </h1>
        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
          Fly to over 80 destinations worldwide with award‑winning service and
          unmatched comfort. Let Tunisair elevate your travel experience.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button className="bg-red-700 text-white px-4 py-2 text-sm sm:text-base font-bold rounded shadow hover:bg-red-800 transition">
            View Destinations
          </button>
          {/*  <button className="border border-red-700 text-red-700 px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-50 transition">
        View Destinations
      </button> */}
        </div>
      </div>

      <div className="mt-8 w-full flex justify-center z-50 mix-blend-multiply">
        <Image
          src={images.AirbusXX}
          alt="Airplane"
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl object-contain"
          priority
          quality={90}
        />
      </div>
    </section>
  );
}
