import type { CollectionBeforeChangeHook } from 'payload'

// El primerísimo usuario del sistema (creado desde la pantalla de
// "crear primer usuario", sin nadie autenticado todavía) siempre es el
// super administrador raíz — sin tenant asignado, sin importar qué se haya
// enviado en el formulario. De ahí en adelante, cada usuario nuevo lo crea
// un admin ya logueado, quien sí elige el rol y el tenant correspondiente.
export const primerUsuarioSuperadmin: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation !== 'create') return data
  if (req.user) return data

  const { totalDocs } = await req.payload.count({ collection: 'users' })
  if (totalDocs > 0) return data

  return { ...data, rol: 'superadmin', tenant: null }
}
