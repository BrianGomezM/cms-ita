import type { Payload } from 'payload'
import AvatarMenu from './AvatarMenu'

type FotoPoblada = {
  url?: string | null
  sizes?: {
    thumbnail?: { url?: string | null } | null
  } | null
}

type AvatarUser = {
  id: number
  email?: string
  nombre?: string
  foto?: number | FotoPoblada | null
} | null

// Avatar del usuario en el encabezado del panel: muestra la foto de perfil
// (campo `foto` de Users) o, si no hay foto, las iniciales del nombre.
// Al hacer clic despliega un menú rápido con "Ver perfil" y "Cerrar sesión"
// (ver AvatarMenu.tsx — componente cliente que maneja la interacción).
export default async function CustomAvatar({
  user,
  payload,
}: {
  user?: AvatarUser
  payload: Payload
}) {
  if (!user) return null

  let foto = user.foto

  if (foto && typeof foto !== 'object') {
    try {
      foto = (await payload.findByID({
        collection: 'media',
        id: foto,
        depth: 0,
      })) as unknown as FotoPoblada
    } catch {
      foto = null
    }
  }

  const url =
    foto && typeof foto === 'object' ? (foto.sizes?.thumbnail?.url ?? foto.url) : null

  const inicial = (user.nombre || user.email || '?').trim().charAt(0).toUpperCase()

  return (
    <AvatarMenu
      fotoUrl={url ?? null}
      inicial={inicial}
      nombre={user.nombre || 'Sin nombre'}
      email={user.email || ''}
    />
  )
}
