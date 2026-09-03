// Funciones de acceso reutilizables para todos los roles del sistema
import type { Access, FieldAccess, Where } from 'payload'

// Módulos y acciones configurables en el campo `permisos` de Users. Solo se
// listan las acciones que corresponden a algo real en cada módulo (ej.
// "eliminar" no existe para mensajes de contacto, que solo llegan del sitio).
export type Modulo = 'paginas' | 'noticias' | 'medios' | 'itaChecklist' | 'mensajesContacto'
export type AccionPermiso = 'ver' | 'crear' | 'editar' | 'eliminar' | 'exportar'

// Tipo extendido del usuario con campos personalizados
type UserWithRole = {
  rol?: 'superadmin' | 'admin_cliente' | 'editor' | 'visualizador'
  tenant?: number | { id: number }
  permisos?: Partial<Record<Modulo, Partial<Record<AccionPermiso, boolean | null>>>> | null
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

// Lectura pública para visitantes anónimos (el sitio web la necesita sin
// login) — pero un usuario YA autenticado que no sea superadmin solo ve
// su propio tenant, no los de otros clientes. Para colecciones donde el
// propio documento ES el tenant (ej: Tenants).
export const publicoOPropioTenant: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return true
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  return { id: { equals: tid } }
}

// Igual de público para visitantes anónimos, pero ni siquiera admin_cliente
// ve nada dentro del panel — Clientes (Tenants) y Checklist ITA son
// exclusivos de superadmin, sin excepción.
export const publicoOSoloSuperAdmin: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return true
  return u.rol === 'superadmin'
}

// Igual que publicoOPropioTenant, pero para colecciones con un campo
// `tenant` propio (ej: Media).
export const publicoOMismoTenant: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return true
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  return { tenant: { equals: tid } }
}

// Público solo lo publicado (el sitio web anónimo no debe ver borradores);
// un usuario autenticado ve todo lo de SU propio tenant (borradores
// incluidos); superadmin ve todo de todos los tenants. Para colecciones
// con estado de publicación y un campo `tenant` propio (ej: Pages, Noticias).
export const publicoPublicadoOMismoTenant: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return { estado: { equals: 'publicado' } } as Where
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  return { tenant: { equals: tid } } as Where
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

// ── Permisos granulares por módulo (solo para roles 'editor'/'visualizador') ──
// superadmin y admin_cliente conservan su acceso total de siempre dentro de
// su alcance (todo / su propio tenant); editor y visualizador solo pueden
// hacer, módulo por módulo, lo que se les marcó explícitamente en
// Users.permisos (ver hooks/Users.ts). Función plana reutilizable también
// fuera de un `Access` (ej. dentro de un endpoint custom).
export const tienePermiso = (
  user: UserWithRole | null | undefined,
  modulo: Modulo,
  accion: AccionPermiso,
): boolean => {
  if (!user) return false
  if (user.rol === 'superadmin' || user.rol === 'admin_cliente') return true
  return Boolean(user.permisos?.[modulo]?.[accion])
}

// Access genérico para crear/editar/eliminar/exportar un módulo con permisos
// granulares — acota siempre al propio tenant.
export const permisoModulo = (modulo: Modulo, accion: AccionPermiso): Access => ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return false
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  if (u.rol === 'admin_cliente') return { tenant: { equals: tid } } as Where
  if (!tienePermiso(u, modulo, accion)) return false
  return { tenant: { equals: tid } } as Where
}

// Lectura con permiso "ver" granular, pero pública (sin estado de
// publicación) para visitantes anónimos — ej. Media.
export const permisoLecturaPublica = (modulo: Modulo): Access => ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return true
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  if (u.rol === 'admin_cliente') return { tenant: { equals: tid } } as Where
  if (!tienePermiso(u, modulo, 'ver')) return false
  return { tenant: { equals: tid } } as Where
}

// Lectura con permiso "ver" granular y estado de publicación para
// visitantes anónimos — ej. Pages, Noticias.
export const permisoLecturaConEstado = (modulo: Modulo): Access => ({ req: { user } }) => {
  const u = user as UserWithRole | undefined
  if (!u) return { estado: { equals: 'publicado' } } as Where
  if (u.rol === 'superadmin') return true
  const tid = getTenantId(u)
  if (!tid) return false
  if (u.rol === 'admin_cliente') return { tenant: { equals: tid } } as Where
  if (!tienePermiso(u, modulo, 'ver')) return false
  return { tenant: { equals: tid } } as Where
}