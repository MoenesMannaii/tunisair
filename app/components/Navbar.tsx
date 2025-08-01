'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as images from '@/assets/image'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    'Home',
    'Flights',
    'Destinations',
    'Special Offers',
    'Travel Info',
    'Contact',
    'Support',
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow  z-[1000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-0 h-16">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Image
            src={images.Tunisair.src}
            alt="AirPortPro Logo"
            width={150}
            height={90}
            className="object-contain"
            priority
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex flex-1 justify-center space-x-10 text-gray-900 font-semibold tracking-wide text-sm">
          {links.map((link) => (
            <li
              key={link}
              className="hover:text-red-700 uppercase cursor-pointer transition-colors duration-300"
            >
              {link}
            </li>
          ))}
        </ul>

        {/* Right: CTAs & Mobile Menu Button */}
        <div className="flex items-center">
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="bg-red-700 text-white px-6 py-2 rounded shadow-lg hover:bg-red-800 transition-colors duration-300 font-semibold">
              Book a Flight
            </button>
            <button className="text-red-700 border border-red-700 px-5 py-2 rounded hover:bg-red-50 transition-colors duration-300 font-semibold">
              Login
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          >
            <span
              className={`block h-0.5 w-8 bg-gray-900 rounded transform transition duration-300 ease-in-out ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-gray-900 rounded transition duration-300 ease-in-out ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-gray-900 rounded transform transition duration-300 ease-in-out ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 shadow-md transition-max-height duration-500 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-full' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-6 py-4 space-y-3 text-gray-900 font-semibold tracking-wide text-lg">
          {links.map((link) => (
            <li
              key={link}
              className="hover:text-red-700 cursor-pointer transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </li>
          ))}

          {/* Mobile CTAs */}
        <div className="flex w-full flex-row justify-start space-x-4">
  <li>
    <button className="w-full bg-red-700 text-white px-4 py-2 shadow-lg hover:bg-red-800 transition-colors duration-300 font-semibold">
      Book a Flight
    </button>
  </li>
  <li>
    <button className="w-full text-red-700 border border-red-700 px-4 py-2 hover:bg-red-50 transition-colors duration-300 font-semibold">
      Login
    </button>
  </li>
</div>

        </ul>
      </div>
    </nav>
  )
}
