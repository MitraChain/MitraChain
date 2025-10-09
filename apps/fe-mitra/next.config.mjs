// apps/fe-mitra/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['lucid-cardano'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'lucid-cardano': 'lucid-cardano',
        'node-fetch': 'commonjs node-fetch',
        '@peculiar/webcrypto': 'commonjs @peculiar/webcrypto',
      })
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
      fs: false,
      net: false,
      tls: false,
    }

    return config
  },
  transpilePackages: ['@workspace/ui'],
}
export default nextConfig
