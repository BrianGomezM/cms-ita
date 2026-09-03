// Fuerza el tenant del documento al crearlo, para quien no sea superadmin —
// sin importar qué haya enviado el formulario o la API. Evita que un
// admin_cliente/editor cree (o reasigne) contenido en OTRO tenant distinto
// al suyo, incluso manipulando la petición directamente.
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

  // Para el resto, el tenant SIEMPRE es el propio — no es una sugerencia
  // por defecto, es el único valor permitido.
  const tenantId = typeof user.tenant === 'object'
    ? user.tenant?.id
    : user.tenant

  if (!tenantId) return data

  return { ...data, tenant: tenantId }
}