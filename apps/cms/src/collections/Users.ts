import type { CollectionConfig, Tab, Where } from 'payload'
import { soloSuperAdmin, soloSuperAdminCampo } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { primerUsuarioSuperadmin } from '../hooks/primerUsuarioSuperadmin'
import { topePermisosPorRol } from '../hooks/topePermisosPorRol'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'

// Construye los checkboxes de un módulo dentro de "Permisos por módulo".
// Solo se listan las acciones que existen de verdad para ese módulo (ej.
// los mensajes de contacto no se "crean" desde el panel, llegan del sitio).
const ETIQUETAS_ACCION: Record<string, string> = {
  ver: 'Ver',
  crear: 'Crear',
  editar: 'Editar',
  eliminar: 'Eliminar',
  exportar: 'Exportar',
}

// Cada módulo es una pestaña — evita que el formulario crezca indefinidamente
// hacia abajo a medida que se agreguen más módulos con permisos.
const moduloPermiso = (
  name: string,
  label: string,
  acciones: Array<'ver' | 'crear' | 'editar' | 'eliminar' | 'exportar'>,
): Tab => ({
  name,
  label,
  fields: acciones.map((accion) => ({
    name: accion,
    type: 'checkbox' as const,
    label: ETIQUETAS_ACCION[accion],
    defaultValue: accion === 'ver',
    admin: { width: '25%' },
  })),
})

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
    // Editor/visualizador no gestionan usuarios — se excluye el módulo
    // completo de su menú y sus rutas de listado. Su propia cuenta la
    // siguen administrando desde /admin/account (vista aparte, no afectada).
    hidden: ({ user }) => {
      const u = user as any
      return u?.rol === 'editor' || u?.rol === 'visualizador'
    },
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [primerUsuarioSuperadmin, autoAssignTenant, topePermisosPorRol],
    afterChange: [auditAfterChange],   // ← agregar
    afterDelete: [auditAfterDelete],   // ← agregar
  },
  access: {
    // Solo superadmin y admin_cliente tienen acceso al módulo de Usuarios —
    // editor/visualizador ni siquiera lo ven en el panel (no gestionan
    // usuarios, así que no tiene sentido que aparezca en su menú).
    read: ({ req: { user } }): boolean | Where => {
      const u = user as any
      if (!u) return false
      if (u.rol === 'superadmin') return true
      if (u.rol === 'admin_cliente') {
        const tid = getTenantId(u)
        if (!tid) return false
        return { tenant: { equals: tid } }
      }
      // Editor/visualizador: el módulo está oculto de su menú (ver arriba),
      // pero conservan acceso a su propia cuenta vía /admin/account.
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
      if (u.rol === 'admin_cliente') {
        const tid = getTenantId(u)
        if (!tid) return false
        return { tenant: { equals: tid } }
      }
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
        // Se oculta al crear el primerísimo usuario (nadie autenticado
        // todavía): ese usuario siempre es superadmin, sin tener que elegirlo.
        condition: (_data, _siblingData, { user }) => Boolean(user),
      },
      validate: (value: unknown, { req }: { req: unknown }) => {
        const solicitante = (req as { user?: { rol?: string } | null })?.user
        // access.update ya bloquea cambiar el rol de un usuario existente si
        // no eres superadmin, pero eso no cubre la creación — así que la
        // regla "nadie más puede volverse superadmin" se exige aquí también.
        if (value === 'superadmin' && solicitante?.rol !== 'superadmin') {
          return 'Solo un Super Administrador puede asignar ese rol.'
        }
        return true
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants' as any, // ← cast necesario hasta que payload-types.ts se regenere
      label: 'Cliente (Tenant)',
      admin: {
        description: 'Obligatorio para cualquier rol distinto de Super Administrador',
        // Oculto en la creación del primerísimo usuario, cuando el rol
        // elegido es superadmin, y también para quien NO sea superadmin —
        // un admin_cliente no elige tenant: el backend siempre asigna el
        // suyo propio (ver hooks/autoAssignTenant.ts), así que mostrarle un
        // selector que en la práctica no puede usar solo generaría confusión.
        condition: (_data, siblingData, { user }) =>
          Boolean(user) &&
          (user as { rol?: string })?.rol === 'superadmin' &&
          siblingData?.rol !== 'superadmin',
      },
      validate: (value: unknown, { siblingData, req }: { siblingData?: Record<string, unknown>; req: unknown }) => {
        const s = siblingData as { rol?: string } | undefined
        const solicitante = (req as { user?: { rol?: string } | null })?.user
        // Solo se exige explícitamente cuando quien crea es superadmin — para
        // el resto, el backend fuerza el tenant sin importar el valor enviado.
        if (solicitante?.rol === 'superadmin' && s?.rol && s.rol !== 'superadmin' && !value) {
          return 'Debes asignar un cliente (tenant) — este rol no puede quedar sin uno.'
        }
        return true
      },
    },
    {
      name: 'permisos',
      type: 'group',
      label: 'Permisos por módulo',
      admin: {
        description:
          'Solo aplica a los roles Editor y Visualizador — define qué puede hacer este usuario en cada módulo, dentro del tope de su rol (Visualizador nunca crea/edita/elimina; Editor nunca elimina). Checklist ITA y Clientes son exclusivos de Super Administrador, por eso no aparecen aquí. Super Administrador y Administrador Cliente siempre tienen acceso completo dentro de su alcance.',
        condition: (_data, siblingData) =>
          siblingData?.rol === 'editor' || siblingData?.rol === 'visualizador',
      },
      fields: [
        {
          type: 'tabs',
          tabs: [
            moduloPermiso('paginas', 'Páginas', ['ver', 'crear', 'editar', 'eliminar']),
            moduloPermiso('noticias', 'Noticias y avisos', ['ver', 'crear', 'editar', 'eliminar']),
            moduloPermiso('medios', 'Archivos multimedia', ['ver', 'crear', 'editar', 'eliminar']),
            moduloPermiso('mensajesContacto', 'Mensajes de contacto', ['ver', 'editar', 'eliminar']),
          ],
        },
      ],
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto de perfil',
      admin: {
        description: 'Se mostrará como tu avatar en la parte superior del panel',
        position: 'sidebar',
        // Oculto en la creación del primerísimo usuario: sin tenant ni sesión
        // todavía, el selector de medios no tiene con qué funcionar.
        condition: (_data, _siblingData, { user }) => Boolean(user),
      },
    },
  ],
}