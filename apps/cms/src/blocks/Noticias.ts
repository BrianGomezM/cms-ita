import type { Block } from 'payload'

export const NoticiasBlock: Block = {
  slug: 'noticias',
  labels: {
    singular: 'Noticias / Avisos',
    plural: 'Bloques de noticias',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Noticias y avisos',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción (opcional)',
    },
    {
      name: 'cantidad',
      type: 'select',
      label: 'Cantidad de noticias a mostrar',
      defaultValue: '3',
      options: [
        { label: '3', value: '3' },
        { label: '6', value: '6' },
        { label: '9', value: '9' },
      ],
    },
    {
      name: 'soloDestacadas',
      type: 'checkbox',
      label: 'Mostrar solo noticias destacadas',
      defaultValue: false,
    },
  ],
}
