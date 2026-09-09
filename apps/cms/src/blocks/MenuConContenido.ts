import type { Block } from 'payload'
import { BLOQUES_CONTENIDO_LIBRE, camposCompartirRedes } from './ContenidoLibre'

// Menú lateral de pestañas + contenido a la derecha (como en "Nuestra
// Cámara"): cada pestaña arma su propio contenido combinando los bloques
// libres de ContenidoLibre.ts, sin necesidad de crear una página nueva por
// cada una.
export const MenuConContenidoBlock: Block = {
  slug: 'menu-con-contenido',
  labels: {
    singular: 'Menú con contenido (pestañas)',
    plural: 'Bloques de menú con contenido',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Diseño del banner (aplica a todas las pestañas)',
      admin: {
        initCollapsed: true,
        description: 'Cada pestaña trae su propia imagen y texto de banner, pero todas comparten este mismo estilo — así se ven consistentes al pasar de una a otra.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'textoTamano',
              type: 'number',
              label: 'Tamaño del texto (px)',
              defaultValue: 32,
              min: 20,
              max: 90,
              admin: { width: '50%' },
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
              admin: { width: '50%', description: 'Ej: #FFFFFF. Vacío = blanco.' },
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
    {
      type: 'collapsible',
      label: 'Compartir en redes sociales (opcional, debajo del banner)',
      admin: {
        initCollapsed: true,
        description: 'Aparece una sola vez, entre el banner y el menú de pestañas — no se repite por cada pestaña.',
      },
      fields: [
        {
          name: 'compartir',
          type: 'group',
          label: '',
          fields: camposCompartirRedes(),
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Pestañas',
      labels: { singular: 'Pestaña', plural: 'Pestañas' },
      minRows: 1,
      admin: {
        description: 'Cada pestaña aparece como un ítem del menú lateral, con su propio banner arriba. La primera se muestra de entrada.',
      },
      fields: [
        {
          name: 'etiqueta',
          type: 'text',
          required: true,
          label: 'Nombre en el menú',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'bannerImagen',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen del banner de esta pestaña',
              admin: { width: '50%' },
            },
            {
              name: 'bannerTexto',
              type: 'text',
              label: 'Texto del banner de esta pestaña',
              admin: {
                width: '50%',
                description: 'Si se deja vacío, se usa el "Nombre en el menú".',
              },
            },
          ],
        },
        {
          name: 'contenido',
          type: 'blocks',
          label: 'Contenido de esta pestaña',
          labels: { singular: 'Bloque', plural: 'Bloques' },
          admin: { initCollapsed: false },
          blocks: BLOQUES_CONTENIDO_LIBRE,
        },
      ],
    },
  ],
}
