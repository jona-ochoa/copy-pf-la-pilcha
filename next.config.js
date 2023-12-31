/** @type {import('next').NextConfig} */
const nextConfig = {
  plugins: ['tailwindcss'],
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images:{
    domains:[
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'i.pinimg.com',
      'static.wikia.nocookie.net',
      'res.cloudinary.com',
      'fakestoreapi.com',
      'cdn.mukama.com'
    ],
  },
};

module.exports = nextConfig
