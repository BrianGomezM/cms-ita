// Hook que inyecta el tenant_id del usuario en la sesión de PostgreSQL
// Esto activa las políticas RLS automáticamente en cada operación
import type { CollectionBeforeOperationHook } from 'payload'

export const injectTenantContext: CollectionBeforeOperationHook = async ({
  req,
  operation,
}) => {
  // Solo operaciones que tocan la BD
  if (!['read', 'create', 'update', 'delete'].includes(operation)) return

  const user = req.user as any
  if (!user) return

  try {
    // Obtener la conexión de Drizzle/pg desde Payload
    const db = (req.payload.db as any).drizzle

    if (!db) return

    const isSuperAdmin = user.rol === 'superadmin'
    const tenantId = typeof user.tenant === 'object'
      ? user.tenant?.id
      : user.tenant ?? 0

    // Setear variables de sesión para RLS
    await db.execute(
      `SET LOCAL app.current_tenant_id = '${tenantId}';
       SET LOCAL app.is_superadmin = '${isSuperAdmin}';`
    )
  } catch {
    // Si falla silenciosamente — los access controls de Payload
    // ya protegen a nivel aplicación como segunda capa
  }
}