import type { CollectionBeforeChangeHook } from 'payload'

// Los módulos configurables en Users.permisos (debe coincidir con las
// pestañas definidas en collections/Users.ts)
const MODULOS = ['paginas', 'noticias', 'medios', 'mensajesContacto'] as const

// Impone el techo de cada rol sobre `permisos`, sin importar qué haya
// marcado quien creó/editó al usuario — un admin_cliente puede restringir
// más allá del techo (ej. quitarle "ver" a un editor en un módulo), pero
// nunca por encima de él:
//   - Visualizador: solo puede "ver". Nunca crear/editar/eliminar/exportar.
//   - Editor: puede ver/crear/editar. Nunca eliminar.
// superadmin y admin_cliente no usan `permisos` en absoluto (acceso
// completo dentro de su alcance), así que este hook no les aplica.
export const topePermisosPorRol: CollectionBeforeChangeHook = ({ data }) => {
  const rol = data?.rol as string | undefined
  if (rol !== 'editor' && rol !== 'visualizador') return data

  const permisos = { ...(data?.permisos as Record<string, Record<string, boolean>> | undefined) }

  for (const modulo of MODULOS) {
    const actual = permisos[modulo] || {}
    if (rol === 'visualizador') {
      permisos[modulo] = { ...actual, crear: false, editar: false, eliminar: false }
    } else {
      permisos[modulo] = { ...actual, eliminar: false }
    }
  }

  return { ...data, permisos }
}
