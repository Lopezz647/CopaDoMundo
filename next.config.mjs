// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // ✅ HABILITADO - vai falhar se houver erros
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig