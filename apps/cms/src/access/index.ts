// Funciones de acceso reutilizables para todos los roles del sistema
import type { Access, FieldAccess } from 'payload'

// Tipo extendido del usuario con campos personalizados
type UserWithRole = {
  rol?: 'superadmin' | 'admin_cliente' | 'editor' | 'visualizador'
  tenant?: number | { id: number }
}

// Extrae el ID numérico del tenant ya sea objeto o número directo
const getTenantId = (user: UserWithRole): number | null => {
  if (!user.tenant) return null
  if (typeof user.tenant === 'object') return user.tenant.id
  return user.tenant
}

// Solo superadmin tiene acceso
export const soloSuperAdmin: Access = ({ req: { user } }) => {
  return (user as UserWithRole)?.rol === 'superadmin'
}

// Superadmin ve todo; admin_cliente ve solo su tenant
export const superAdminOAdminCliente: Access = ({ req: { user } }) => {
  const u = user as UserWithRole
  if (!u) return false
  if (u.rol === 'superadmin') return true
  if (u.rol === 'admin_cliente') {
    const tid = getTenantId(u)
    if (!tid) return false
    return { tenant: { equals: tid } }
  }
  return false
}

// Puede leer quien pertenezca al mismo tenant (todos los roles)
export const leerPropiaTenant: Access = ({ req: { user } }) => {
  const u = user as UserWithRole
  if (!u) return false
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  return { tenant: { equals: tid } }
}

// Editor y superiores pueden crear/editar dentro de su tenant
export const editorOSuperior: Access = ({ req: { user } }) => {
  const u = user as UserWithRole
  if (!u) return false
  if (u.rol === 'superadmin') return true
  if (u.rol === 'admin_cliente' || u.rol === 'editor') {
    const tid = getTenantId(u)
    if (!tid) return false
    return { tenant: { equals: tid } }
  }
  return false
}

// Solo superadmin puede cambiar el campo 'rol' de un usuario
export const soloSuperAdminCampo: FieldAccess = ({ req: { user } }) => {
  return (user as UserWithRole)?.rol === 'superadmin'
}