'use client'

import { useRowLabel } from '@payloadcms/ui'

type Bloque = { blockType?: string }
type Columna = { children?: Bloque[] }
type SeccionData = { colorFondo?: string; columnas?: Columna[] }

// Reemplaza el "Sección 01" genérico por su color y cuántas columnas tiene,
// para identificar cada banda del footer sin tener que abrirla.
export default function FooterSeccionLabel() {
  const { data, rowNumber } = useRowLabel<SeccionData>()
  const color = data?.colorFondo || '#0378B3'
  const nColumnas = data?.columnas?.length ?? 0

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          display: 'inline-block',
          width: 12,
          height: 12,
          borderRadius: 3,
          background: color,
          border: '1px solid rgba(128,128,128,0.4)',
        }}
      />
      Sección {(rowNumber ?? 0) + 1} · {color} · {nColumnas} columna{nColumnas === 1 ? '' : 's'}
    </span>
  )
}
