'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Props = {
  fotoUrl: string | null
  inicial: string
  nombre: string
  email: string
}

// Botón del avatar en el encabezado del panel. El <Link> que Payload pone
// alrededor de este componente ya apunta a "Ver perfil" — por eso el trigger
// detiene ese click (preventDefault + stopPropagation) y en su lugar abre
// este menú, con "Ver perfil" y "Cerrar sesión" como acciones explícitas.
export default function AvatarMenu({ fotoUrl, inicial, nombre, email }: Props) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!abierto) return
    const alHacerClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', alHacerClickFuera)
    return () => document.removeEventListener('mousedown', alHacerClickFuera)
  }, [abierto])

  const ir = (e: React.MouseEvent, ruta: string) => {
    e.preventDefault()
    e.stopPropagation()
    setAbierto(false)
    router.push(ruta)
  }

  return (
    <div ref={contenedorRef} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="Cuenta"
        aria-expanded={abierto}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setAbierto((v) => !v)
        }}
        style={{
          all: 'unset',
          display: 'flex',
          cursor: 'pointer',
          width: 25,
          height: 25,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt="Foto de perfil"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--theme-elevation-200)',
              color: 'var(--theme-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {inicial}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 200,
            background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--theme-elevation-100)',
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontWeight: 600 }}>{nombre}</div>
            <div style={{ color: 'var(--theme-elevation-450)' }}>{email}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => ir(e, '/admin/account')}
            style={{
              all: 'unset',
              display: 'block',
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 14px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Ver perfil
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => ir(e, '/admin/logout')}
            style={{
              all: 'unset',
              display: 'block',
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 14px',
              fontSize: 13,
              cursor: 'pointer',
              color: 'var(--theme-error-500)',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
