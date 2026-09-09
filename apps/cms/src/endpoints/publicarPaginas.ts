import type { Endpoint } from 'payload'
import { tienePermiso } from '../access'

type UserWithRole = {
  id: number
  rol?: 'superadmin' | 'admin_cliente' | 'editor' | 'visualizador'
  tenant?: number | { id: number }
}

const getTenantId = (user: UserWithRole): number | null => {
  if (!user.tenant) return null
  return typeof user.tenant === 'object' ? user.tenant.id : user.tenant
}

// Publica varias páginas de una sola llamada — cada una se guarda como
// documento independiente (misma acción que el botón "Publicar" de una
// página, repetida por cada id recibido). No mezcla contenido entre
// páginas: solo evita tener que entrar una por una cuando se editaron
// varias a la vez. Respeta el mismo alcance por tenant/permiso que ya
// aplica la colección "pages" — un editor nunca puede publicar páginas
// fuera de su propio tenant, aunque mande el id a mano.
export const publicarVariasPaginas: Endpoint = {
  path: '/publicar-varias',
  method: 'post',
  handler: async (req) => {
    const user = req.user as UserWithRole | null
    if (!user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const puedeEditar =
      user.rol === 'superadmin' || user.rol === 'admin_cliente' || tienePermiso(user, 'paginas', 'editar')
    if (!puedeEditar) {
      return Response.json({ error: 'No tienes permiso para publicar páginas' }, { status: 403 })
    }

    const body = req.json ? await req.json() : {}
    const ids: number[] = Array.isArray(body?.ids)
      ? body.ids.map(Number).filter((n: number) => Number.isFinite(n))
      : []
    if (!ids.length) {
      return Response.json({ error: 'No se indicaron páginas' }, { status: 400 })
    }

    const tenantId = getTenantId(user)
    const publicadas: number[] = []
    const fallidas: number[] = []

    for (const id of ids) {
      try {
        const pagina = await req.payload.findByID({
          collection: 'pages',
          id,
          depth: 0,
          overrideAccess: true,
        })
        const tenantPagina = typeof pagina?.tenant === 'object' ? pagina.tenant?.id : pagina?.tenant
        const autorizada = Boolean(pagina) && (user.rol === 'superadmin' || (tenantId != null && tenantPagina === tenantId))

        if (!autorizada) {
          fallidas.push(id)
          continue
        }

        await req.payload.update({
          collection: 'pages',
          id,
          data: { estado: 'publicado' },
          draft: false,
          overrideAccess: true,
        })
        publicadas.push(id)
      } catch {
        fallidas.push(id)
      }
    }

    return Response.json({ publicadas, fallidas })
  },
}
