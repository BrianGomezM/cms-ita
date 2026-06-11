import type { Block } from 'payload'

export const AccordionFAQBlock: Block = {
  slug: 'accordion-faq',
  labels: {
    singular: 'Preguntas frecuentes',
    plural: 'Bloques de preguntas frecuentes',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      admin: {
        description: 'Ej: Preguntas frecuentes',
      },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Preguntas',
      labels: { singular: 'Pregunta', plural: 'Preguntas' },
      minRows: 1,
      fields: [
        {
          name: 'pregunta',
          type: 'text',
          required: true,
          label: 'Pregunta',
        },
        {
          name: 'respuesta',
          type: 'textarea',
          required: true,
          label: 'Respuesta',
          admin: {
            description: 'Texto de la respuesta. Se mostrará al hacer clic en la pregunta.',
          },
        },
      ],
    },
  ],
}
