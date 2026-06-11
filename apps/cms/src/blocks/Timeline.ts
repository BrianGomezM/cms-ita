import type { Block } from 'payload'

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Línea de tiempo',
    plural: 'Bloques de línea de tiempo',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      admin: { description: 'Ej: Nuestra historia, Hitos del plan de desarrollo' },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Hitos',
      labels: { singular: 'Hito', plural: 'Hitos' },
      minRows: 1,
      fields: [
        {
          name: 'fecha',
          type: 'text',
          required: true,
          label: 'Fecha o periodo',
          admin: { description: 'Ej: 2024 o Marzo de 2025' },
        },
        {
          name: 'titulo',
          type: 'text',
          required: true,
          label: 'Título',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción (opcional)',
        },
      ],
    },
  ],
}
