// Rate limiting para proteger la API de abusos
// Usa memoria en desarrollo, Redis en producción
import { RateLimiterMemory } from 'rate-limiter-flexible'

// Límite general de API: 100 requests por 15 minutos por IP
const limiterAPI = new RateLimiterMemory({
  points: 100,
  duration: 60 * 15,
  blockDuration: 60 * 5, // bloquear 5 min si supera el límite
})

// Límite estricto para login: 5 intentos por 15 minutos por IP
const limiterLogin = new RateLimiterMemory({
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 30, // bloquear 30 min si falla login
})

export async function checkRateLimit(
  ip: string,
  tipo: 'api' | 'login' = 'api'
): Promise<{ permitido: boolean; reintentoEn?: number }> {
  const limiter = tipo === 'login' ? limiterLogin : limiterAPI

  try {
    await limiter.consume(ip)
    return { permitido: true }
  } catch (err: any) {
    const reintentoEn = Math.ceil(err.msBeforeNext / 1000)
    return { permitido: false, reintentoEn }
  }
}