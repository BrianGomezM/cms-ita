'use client'

import { useWatchForm } from '@payloadcms/ui'

type Bloque = { blockType?: string }
type Columna = { ancho?: string; children?: Bloque[] }

// Cuántas columnas de una grilla interna de 12 ocupa cada ancho con nombre.
// El editor nunca ve estos números — solo elige "Pequeña/Mediana/Grande/Completa"
// y el motor (aquí y en el sitio web) las acomoda solas con CSS Grid.
const SPAN: Record<string, number> = {
  pequena: 3,
  mediana: 4,
  grande: 6,
  completa: 12,
}

const NOMBRE_ANCHO: Record<string, string> = {
  pequena: 'Pequeña',
  mediana: 'Mediana',
  grande: 'Grande',
  completa: 'Completa',
}

// Mini-mapa visual (no editable) del constructor: lee el estado del
// formulario en vivo (aunque no se haya guardado) y dibuja cajas
// proporcionales al ancho real de cada columna, tal como se acomodarán
// solas en el sitio — sin que el usuario tenga que imaginarlo.
export default function FooterLayoutPreview() {
  const { getDataByPath } = useWatchForm()
  const columnas = (getDataByPath('footer.layout.columnas') as Columna[] | undefined) ?? []
  const colorFondo = (getDataByPath('footer.colorFondo') as string | undefined) || '#0378B3'

  if (columnas.length === 0) {
    return (
      <div
        style={{
          padding: 16,
          border: '1px dashed var(--theme-elevation-200)',
          borderRadius: 6,
          color: 'var(--theme-elevation-450)',
          fontSize: 13,
        }}
      >
        Agrega una columna abajo (sección &quot;Columnas del footer&quot;) para ver aquí un mapa visual del layout.
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: colorFondo,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 6,
      }}
    >
      {columnas.map((columna, i) => {
        const ancho = columna.ancho || 'mediana'
        const span = SPAN[ancho] ?? SPAN.mediana
        const nBloques = columna.children?.length ?? 0
        return (
          <div
            key={i}
            style={{
              gridColumn: `span ${span}`,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 4,
              padding: '8px 6px',
              color: '#fff',
              fontSize: 11,
              textAlign: 'center',
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {NOMBRE_ANCHO[ancho] ?? ancho}
            {nBloques > 0 ? ` · ${nBloques} bloque${nBloques === 1 ? '' : 's'}` : ' · vacía'}
          </div>
        )
      })}
    </div>
  )
}
