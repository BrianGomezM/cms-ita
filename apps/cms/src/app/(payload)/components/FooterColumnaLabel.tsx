'use client'

import { useRowLabel } from '@payloadcms/ui'

type BloqueResumen = { blockType?: string }
type ColumnaData = { ancho?: string; children?: BloqueResumen[] }

const NOMBRES_BLOQUE: Record<string, string> = {
  texto: 'Texto',
  titulo: 'Título',
  imagen: 'Imagen',
  enlace: 'Enlace',
  'lista-enlaces': 'Lista de enlaces',
  logos: 'Logos',
  'redes-sociales': 'Redes sociales',
  separador: 'Separador',
  espaciador: 'Espaciador',
  html: 'HTML',
}

const NOMBRES_ANCHO: Record<string, string> = {
  pequena: 'Pequeña',
  mediana: 'Mediana',
  grande: 'Grande',
  completa: 'Completa',
}

// Reemplaza el "Columna 01" genérico por su ancho y un resumen de qué
// bloques contiene, para no tener que abrirla solo para saber qué hay adentro.
export default function FooterColumnaLabel() {
  const { data, rowNumber } = useRowLabel<ColumnaData>()
  const ancho = NOMBRES_ANCHO[data?.ancho ?? 'mediana'] ?? data?.ancho
  const bloques = data?.children ?? []
  const resumen = bloques.length
    ? bloques.map((b) => NOMBRES_BLOQUE[b?.blockType ?? ''] ?? b?.blockType ?? '?').join(', ')
    : 'vacía'

  return (
    <span>
      Columna {(rowNumber ?? 0) + 1} · {ancho} · {resumen}
    </span>
  )
}
