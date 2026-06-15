import type { CollectionConfig, Where } from 'payload'
import { soloSuperAdmin, soloSuperAdminCampo } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'

const getTenantId = (user: any): number | null => {
  if (!user?.tenant) return null
  if (typeof user.tenant === 'object') return user.tenant.id
  return user.tenant
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  auth: {
    tokenExpiration: 60 * 60 * 2,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', // ← mayúscula
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administración',
    defaultColumns: ['email', 'nombre', 'rol', 'tenant'],
    description: 'Usuarios del panel administrativo',
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange],   // ← agregar
    afterDelete: [auditAfterDelete],   // ← agregar
  },
  access: {
    read: ({ req: { user } }): boolean | Where => {
      const u = user as any
      if (!u) return false
      if (u.rol === 'superadmin') return true
      const tid = getTenantId(u)
      if (!tid) return false
      if (u.rol === 'admin_cliente') return { tenant: { equals: tid } }
      // Editor/visualizador solo se ven a sí mismos
      return { id: { equals: u.id } }
    },
    create: ({ req: { user } }) => {
      const u = user as any
      return u?.rol === 'superadmin' || u?.rol === 'admin_cliente'
    },
    update: ({ req: { user } }): boolean | Where => {
      const u = user as any
      if (!u) return false
      if (u.rol === 'superadmin') return true
      const tid = getTenantId(u)
      if (!tid) return false
      if (u.rol === 'admin_cliente') return { tenant: { equals: tid } }
      return { id: { equals: u.id } }
    },
    delete: soloSuperAdmin,
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre completo',
    },
    {
      name: 'rol',
      type: 'select',
      required: true,
      label: 'Rol',
      defaultValue: 'editor',
      options: [
        { label: '⭐ Super Administrador', value: 'superadmin' },
        { label: '🏢 Administrador Cliente', value: 'admin_cliente' },
        { label: '✏️ Editor', value: 'editor' },
        { label: '👁️ Visualizador', value: 'visualizador' },
      ],
      access: {
        update: soloSuperAdminCampo,
      },
      admin: {
        description: 'Define qué puede hacer este usuario en el sistema',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants' as any, // ← cast necesario hasta que payload-types.ts se regenere
      label: 'Cliente (Tenant)',
      admin: {
        description: 'No aplica para Super Administradores',
        condition: (data) => data?.rol !== 'superadmin',
      },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto de perfil',
      admin: {
        description: 'Se mostrará como tu avatar en la parte superior del panel',
        position: 'sidebar',
      },
    },
  ],
}