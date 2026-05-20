// Headers HTTP de seguridad
// Se aplican en next.config.ts
export const securityHeaders = [
  // Previene clickjacking
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Previene MIME sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Referrer policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Permisos de APIs del navegador
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  // XSS Protection (legacy pero útil)
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // HSTS — solo en producción
  ...(process.env.NODE_ENV === 'production'
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
]