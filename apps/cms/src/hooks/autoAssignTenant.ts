// Auto-asigna el tenant del usuario al documento al crearlo
// Evita que un editor cree contenido en otro tenant
import type { CollectionBeforeChangeHook } from 'payload'

export const autoAssignTenant: CollectionBeforeChangeHook = ({
  data,
  req,
  operation,
}) => {
  if (operation !== 'create') return data

  const user = req.user as any
  if (!user) return data

  // Superadmin puede asignar cualquier tenant manualmente
  if (user.rol === 'superadmin') return data

  // Para el resto, forzar el tenant del usuario
  const tenantId = typeof user.tenant === 'object'
    ? user.tenant?.id
    : user.tenant

  if (tenantId && !data.tenant) {
    return { ...data, tenant: tenantId }
  }

  return data
}