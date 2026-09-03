import type { Block } from 'payload'

export const CardsBlock: Block = {
  slug: 'cards',
  labels: {
    singular: 'Tarjetas',
    plural: 'Bloques de tarjetas',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
    },
    {
      name: 'columnas',
      type: 'select',
      label: 'Columnas por fila',
      defaultValue: '3',
      options: [
        { label: '2 columnas', value: '2' },
        { label: '3 columnas', value: '3' },
        { label: '4 columnas', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Tarjetas',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'titulo',
          type: 'text',
          required: true,
          label: 'Título',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción',
        },
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
        },
        {
          name: 'enlace',
          type: 'text',
          label: 'URL del enlace',
        },
        {
          name: 'icono',
          type: 'text',
          label: 'Icono (clase CSS o emoji)',
          admin: {
            description: 'Ej: 📋 o fa-file-alt',
          },
        },
      ],
    },
  ],
}