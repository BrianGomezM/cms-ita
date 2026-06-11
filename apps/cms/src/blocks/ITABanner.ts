import type { Block } from 'payload'

export const ITABannerBlock: Block = {
  slug: 'ita-banner',
  labels: {
    singular: 'Banner Índice de Transparencia (ITA)',
    plural: 'Banners ITA',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título',
      defaultValue: 'Índice de Transparencia y Acceso a la Información Pública',
      admin: {
        description: 'El porcentaje de cumplimiento se calcula automáticamente, no se edita aquí.',
      },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto descriptivo (opcional)',
      defaultValue: 'Conoce el avance de esta entidad frente a los requisitos de la Resolución MinTIC 1519.',
    },
    {
      name: 'enlace',
      type: 'text',
      label: 'Enlace al detalle de transparencia',
      defaultValue: '/transparencia',
      admin: {
        description: 'Página a donde lleva el botón "Ver más"',
      },
    },
  ],
}
