// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tunisair.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tunisair.tn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jetphotos.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tunisair.com.tn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tunisair.com.tn',
        pathname: '/**',
      },
      {        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.tunisair.com',
        pathname: '/**',
      },
      
    ],
  },
}

export default nextConfig
