import type { Payload } from 'payload'

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

  if (url) {
    return (
      <div
        style={{
          width: 25,
          height: 25,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Foto de perfil"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  const inicial = (user.nombre || user.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div
      style={{
        width: 25,
        height: 25,
        borderRadius: '50%',
        background: 'var(--theme-elevation-200)',
        color: 'var(--theme-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      {inicial}
    </div>
  )
}
