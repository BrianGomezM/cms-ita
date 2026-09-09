import type { Block } from 'payload'
import { BLOQUES_CONTENIDO_LIBRE } from './ContenidoLibre'

const hexOpcional = (mensaje: string) => (value: unknown) => {
  if (!value) return true
  return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value)) ? true : mensaje
}

// El bloque "libre" del constructor de páginas: no impone ninguna
// estructura fija (no hay título+descripción+tarjetas soldados entre sí).
// El editor arma esta sección agregando, quitando y reordenando piezas
// pequeñas (título, párrafo, imagen, botón, grid de tarjetas, etc.) desde
// ContenidoLibre.ts. Si mañana ya no se quieren las tarjetas, se borran esa
// pieza y se agrega otra distinta — el resto del lienzo no se ve afectado.
export const LienzoBlock: Block = {
  slug: 'lienzo',
  labels: {
    singular: 'Lienzo (sección de bloques libres)',
    plural: 'Lienzos',
  },
  fields: [
    // ── Diseño del contenedor (opcional) ─────────────
    {
      type: 'collapsible',
      label: 'Diseño del lienzo (opcional)',
      admin: {
        initCollapsed: true,
        description: 'Borde y tamaño del contenedor de esta sección. Si dejas el ancho o el alto vacíos, se usa el tamaño automático.',
      },
      fields: [
        {
          name: 'bordeActivo',
          type: 'checkbox',
          label: 'Mostrar borde',
          defaultValue: false,
        },
        {
          type: 'row',
          admin: { condition: (_data, siblingData) => Boolean(siblingData?.bordeActivo) },
          fields: [
            {
              name: 'bordeAncho',
              type: 'number',
              label: 'Grosor del borde (px)',
              defaultValue: 1,
              min: 1,
              max: 20,
              admin: { width: '34%' },
            },
            {
              name: 'bordeColor',
              type: 'text',
              label: 'Color del borde (hex)',
              admin: { width: '33%', description: 'Vacío = gris institucional.' },
              validate: hexOpcional('Usa un color hexadecimal, ej: #E5E7EB'),
            },
            {
              name: 'bordeRedondeo',
              type: 'number',
              label: 'Redondeo de esquinas (px)',
              defaultValue: 0,
              min: 0,
              max: 60,
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ancho',
              type: 'number',
              label: 'Ancho (px, opcional)',
              min: 100,
              max: 3000,
              admin: { width: '50%', description: 'Vacío = ancho automático (todo el espacio disponible).' },
            },
            {
              name: 'alto',
              type: 'number',
              label: 'Alto (px, opcional)',
              min: 40,
              max: 3000,
              admin: { width: '50%', description: 'Vacío = alto automático (según el contenido).' },
            },
          ],
        },
      ],
    },
    // ── Contenido ─────────────────────────────────────
    {
      name: 'contenido',
      type: 'blocks',
      label: 'Bloques de esta sección',
      labels: { singular: 'Bloque', plural: 'Bloques' },
      minRows: 1,
      admin: {
        initCollapsed: false,
        description: 'Combina los bloques que necesites (título, párrafo, imágenes, botones, grid de tarjetas...). Agrega, quita o reordena libremente — no estás atado a una sección fija.',
      },
      blocks: BLOQUES_CONTENIDO_LIBRE,
    },
  ],
}
