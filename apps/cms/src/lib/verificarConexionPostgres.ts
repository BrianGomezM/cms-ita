import { connect } from 'node:net'

// Prueba una conexión TCP simple al host:puerto de DATABASE_URI (sin hablar
// el protocolo de Postgres) solo para detectar "el puerto ni siquiera
// responde" — el caso típico cuando Docker/Postgres no está corriendo.
export async function verificarConexionPostgres(): Promise<void> {
  const uri = process.env.DATABASE_URI
  if (!uri) return

  let host: string
  let port: number
  try {
    const url = new URL(uri)
    host = url.hostname
    port = Number(url.port) || 5432
  } catch {
    return
  }

  const alcanzable = await new Promise<boolean>((resolve) => {
    const socket = connect({ host, port, timeout: 3000 })
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('error', () => {
      resolve(false)
    })
  })

  if (!alcanzable) {
    console.error(
      [
        '',
        '⚠️  No se pudo conectar a Postgres en ' + host + ':' + port + '.',
        '   El CMS va a arrancar, pero cualquier página que necesite la base de datos va a fallar hasta que esto se resuelva.',
        '',
        '   Posibles causas:',
        '     • Docker Desktop no está corriendo',
        '     • El contenedor de Postgres está apagado (docker compose up -d postgres)',
        '     • DATABASE_URI en tu .env apunta a un host/puerto distinto al configurado en docker-compose.yml',
        '',
      ].join('\n'),
    )
  }
}
