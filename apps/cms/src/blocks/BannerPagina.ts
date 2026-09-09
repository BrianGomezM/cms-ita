import type { Block } from 'payload'

// Banner simple y reutilizable para el encabezado de cualquier página
// (a diferencia de "Banner principal", que es específico del inicio con
// su grid de servicios y noticias). Mismo sistema de estilo que ese, para
// que el administrador ya conozca cómo funciona.
export const BannerPaginaBlock: Block = {
  slug: 'banner-pagina',
  labels: {
    singular: 'Banner de página',
    plural: 'Banners de página',
  },
  fields: [
    {
      name: 'texto',
      type: 'text',
      required: true,
      label: 'Texto del banner',
      defaultValue: 'Título de la página',
    },
    {
      type: 'collapsible',
      label: 'Diseño del texto (opcional)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'textoTamano',
              type: 'number',
              label: 'Tamaño del texto (px)',
              defaultValue: 36,
              min: 20,
              max: 90,
              admin: { width: '50%', description: 'Entre 20 y 90.' },
            },
            {
              name: 'textoNegrita',
              type: 'checkbox',
              label: 'Texto en negrita',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'textoColor',
              type: 'text',
              label: 'Color del texto (hex)',
              admin: {
                width: '50%',
                description: 'Ej: #FFFFFF. Vacío = blanco.',
              },
              validate: (value: unknown) => {
                if (!value) return true
                return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                  ? true
                  : 'Usa un color hexadecimal, ej: #FFFFFF'
              },
            },
            {
              name: 'textoPosicion',
              type: 'select',
              label: 'Posición del texto',
              defaultValue: 'izquierda',
              options: [
                { label: 'Izquierda (recomendado)', value: 'izquierda' },
                { label: 'Centro', value: 'centro' },
                { label: 'Derecha', value: 'derecha' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'imagenFondo',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de fondo',
      admin: {
        description: 'Recomendado: 1600x400px o similar, formato horizontal.',
      },
    },
    {
      type: 'collapsible',
      label: 'Diseño de la imagen (opcional)',
      admin: {
        initCollapsed: true,
        condition: (_data, siblingData) => Boolean(siblingData?.imagenFondo),
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'imagenDesvanecido',
              type: 'select',
              label: 'Desvanecido de la imagen',
              defaultValue: 'suave',
              options: [
                { label: 'Sin desvanecido', value: 'ninguno' },
                { label: 'Suave (recomendado)', value: 'suave' },
                { label: 'Medio', value: 'medio' },
                { label: 'Fuerte', value: 'fuerte' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'imagenAjuste',
              type: 'select',
              label: 'Tamaño de la imagen',
              defaultValue: 'cubrir',
              options: [
                { label: 'Cubrir todo el espacio (recomendado)', value: 'cubrir' },
                { label: 'Ajustar sin recortar', value: 'contener' },
                { label: 'Tamaño original centrado', value: 'original' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
