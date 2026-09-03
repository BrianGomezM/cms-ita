import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

type UserConRol = {
  rol?: 'superadmin' | 'admin_cliente' | 'editor' | 'visualizador'
  tenant?: number | { id: number }
}

export default async function AccesosDirectos({ user }: AdminViewServerProps) {
  const payload = await getPayload({ config })
  const u = user as UserConRol | null | undefined

  const tenantId = u?.rol === 'superadmin'
    ? null
    : (typeof u?.tenant === 'object' ? u?.tenant?.id : u?.tenant)

  const { totalDocs: mensajesNuevos } = await payload.count({
    collection: 'mensajes-contacto',
    where: {
      ...(tenantId ? { tenant: { equals: tenantId } } : {}),
      leido: { equals: false },
    },
  }).catch(() => ({ totalDocs: 0 }))

  const accesos = [
    {
      href: '/admin/collections/pages',
      titulo: 'Páginas del sitio',
      descripcion: 'Edita el contenido de tu sitio web',
    },
    {
      href: '/admin/collections/noticias',
      titulo: 'Noticias y avisos',
      descripcion: 'Publica novedades y comunicados',
    },
    {
      href: '/admin/collections/media',
      titulo: 'Archivos multimedia',
      descripcion: 'Imágenes, logos y documentos',
    },
    {
      href: '/admin/collections/mensajes-contacto',
      titulo: 'Mensajes de contacto',
      descripcion: mensajesNuevos > 0
        ? `${mensajesNuevos} mensaje${mensajesNuevos === 1 ? '' : 's'} sin leer`
        : 'Sin mensajes nuevos',
      destacado: mensajesNuevos > 0,
    },
    {
      href: '/admin/dashboard-ita',
      titulo: 'Transparencia (ITA)',
      descripcion: 'Cumplimiento de la Resolución 1519',
    },
    ...(u?.rol === 'superadmin' || u?.rol === 'admin_cliente'
      ? [{
          href: '/admin/collections/tenants',
          titulo: 'Configuración del sitio',
          descripcion: 'Colores, logo, menú, redes sociales',
        }]
      : []),
    ...(u?.rol === 'superadmin' || u?.rol === 'admin_cliente'
      ? [{
          href: '/admin/collections/users',
          titulo: 'Usuarios',
          descripcion: 'Administra los accesos al panel',
        }]
      : []),
  ]

  return (
    <div style={{ padding: '24px 5px 0', maxWidth: '1200px' }}>
      <h2 style={{ fontSize: '18px', color: 'var(--theme-text)', marginBottom: '4px' }}>
       Accesos directos
      </h2>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-500)', fontSize: '13px' }}>
        Lo que más usarás día a día
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '8px' }}>
        {accesos.map((acceso) => (
          <Link
            key={acceso.href}
            href={acceso.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--theme-text)',
              background: 'var(--theme-elevation-50)',
              border: acceso.destacado ? '1px solid #f59e0b' : '1px solid var(--theme-elevation-100)',
              transition: 'background 0.2s',
            }}
          >
            <strong style={{ fontSize: '14px' }}>{acceso.titulo}</strong>
            <span style={{ fontSize: '12px', color: acceso.destacado ? '#f59e0b' : 'var(--theme-elevation-500)' }}>
              {acceso.descripcion}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
