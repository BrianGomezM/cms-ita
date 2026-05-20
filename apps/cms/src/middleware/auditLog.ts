// Log de auditoría — registra operaciones críticas
// quién, qué, cuándo, desde dónde
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type AuditAction = 'crear' | 'actualizar' | 'eliminar' | 'publicar'

type AuditEntry = {
  timestamp: string
  usuario: string
  usuarioId: number
  accion: AuditAction
  coleccion: string
  documentoId: string | number
  tenantId?: number
  ip?: string
  cambios?: Record<string, any>
}

// En producción esto iría a una tabla de BD o servicio externo
// Por ahora lo escribimos en el log de Pino (consola estructurada)
function registrarAuditoria(entrada: AuditEntry) {
  // Payload ya usa Pino internamente — este log aparece en consola
  console.log(JSON.stringify({
    level: 'audit',
    ...entrada,
  }))
}

// Hook afterChange — registra creaciones y actualizaciones
export const auditAfterChange: CollectionAfterChangeHook = ({
  doc,
  req,
  operation,
  collection,
  previousDoc,
}) => {
  const user = req.user as any
  if (!user) return doc

  const accion: AuditAction = operation === 'create' ? 'crear' : 'actualizar'

  // Detectar cambio de estado a "publicado"
  const esPublicacion =
    operation === 'update' &&
    previousDoc?.estado !== 'publicado' &&
    doc?.estado === 'publicado'

  registrarAuditoria({
    timestamp: new Date().toISOString(),
    usuario: user.email,
    usuarioId: user.id,
    accion: esPublicacion ? 'publicar' : accion,
    coleccion: collection.slug,
    documentoId: doc.id,
    tenantId: typeof user.tenant === 'object' ? user.tenant?.id : user.tenant,
    ip: req.headers?.get?.('x-forwarded-for') ?? 'desconocida',
  })

  return doc
}

// Hook afterDelete — registra eliminaciones
export const auditAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req,
  collection,
}) => {
  const user = req.user as any
  if (!user) return doc

  registrarAuditoria({
    timestamp: new Date().toISOString(),
    usuario: user.email,
    usuarioId: user.id,
    accion: 'eliminar',
    coleccion: collection.slug,
    documentoId: doc.id,
    tenantId: typeof user.tenant === 'object' ? user.tenant?.id : user.tenant,
    ip: req.headers?.get?.('x-forwarded-for') ?? 'desconocida',
  })

  return doc
}