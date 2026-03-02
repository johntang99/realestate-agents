/** @type {import('next').NextConfig} */
const supabaseUrls = [
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PROD_URL,
  process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL,
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PROD_URL,
  process.env.SUPABASE_STAGING_URL,
].filter(Boolean)

const supabaseHostnames = Array.from(
  new Set(
    supabaseUrls
      .map((value) => {
        try {
          return value ? new URL(value).hostname : undefined
        } catch {
          return undefined
        }
      })
      .filter(Boolean)
  )
)

const remotePatterns = []
for (const hostname of supabaseHostnames) {
  remotePatterns.push({
    protocol: 'https',
    hostname,
    pathname: '/storage/v1/object/public/**',
  })
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns,
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Enable static exports for ISR
  output: 'standalone',
}

module.exports = nextConfig
