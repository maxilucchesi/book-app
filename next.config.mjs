/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Desactivar la caché de datos para asegurar que siempre se obtengan datos frescos
    workerThreads: false,
    cpus: 1
  }
}

export default nextConfig
