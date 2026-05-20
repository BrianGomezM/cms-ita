import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero / Banner principal',
    plural: 'Heros / Banners',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título principal',
    },
    {
      name: 'subtitulo',
      type: 'text',
      label: 'Subtítulo',
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de fondo',
    },
    {
      name: 'alineacion',
      type: 'select',
      label: 'Alineación del texto',
      defaultValue: 'centro',
      options: [
        { label: 'Izquierda', value: 'izquierda' },
        { label: 'Centro', value: 'centro' },
        { label: 'Derecha', value: 'derecha' },
      ],
    },
    {
      name: 'boton',
      type: 'group',
      label: 'Botón de acción (opcional)',
      fields: [
        {
          name: 'texto',
          type: 'text',
          label: 'Texto del botón',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL destino',
        },
        {
          name: 'estilo',
          type: 'select',
          label: 'Estilo',
          defaultValue: 'primario',
          options: [
            { label: 'Primario', value: 'primario' },
            { label: 'Secundario', value: 'secundario' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
  ],
}