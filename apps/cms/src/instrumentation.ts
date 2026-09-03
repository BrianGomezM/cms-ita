// Se ejecuta una sola vez al arrancar el servidor (antes de servir peticiones).
// Verifica que Postgres esté alcanzable y, si no, imprime un mensaje claro y
// accionable en vez de dejar que el primer request explote con un stack
// trace crudo de "ECONNREFUSED" enterrado en el bundle de Payload.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { verificarConexionPostgres } = await import('./lib/verificarConexionPostgres')
  await verificarConexionPostgres()
}
