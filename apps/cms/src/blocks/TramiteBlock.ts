import type { Block } from 'payload'

export const TramiteBlock: Block = {
  slug: 'tramite',
  labels: {
    singular: 'Trámites y servicios',
    plural: 'Bloques de trámites',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Trámites y servicios',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Trámites',
      labels: { singular: 'Trámite', plural: 'Trámites' },
      minRows: 1,
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre del trámite',
          admin: { description: 'Ej: Renovación del registro mercantil' },
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción',
        },
        {
          name: 'tipo',
          type: 'select',
          label: 'Canal',
          defaultValue: 'virtual',
          options: [
            { label: 'En línea', value: 'virtual' },
            { label: 'Presencial', value: 'presencial' },
            { label: 'Mixto (presencial y en línea)', value: 'mixto' },
          ],
        },
        {
          name: 'tiempoRespuesta',
          type: 'text',
          label: 'Tiempo de respuesta',
          admin: { description: 'Ej: 5 días hábiles' },
        },
        {
          name: 'costo',
          type: 'text',
          label: 'Costo',
          admin: { description: 'Ej: Gratuito o $ 50.000' },
        },
        {
          name: 'enlace',
          type: 'text',
          label: 'Enlace para iniciar el trámite',
        },
      ],
    },
  ],
}
