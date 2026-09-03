import type { Block } from 'payload'

export const TestimoniosBlock: Block = {
  slug: 'testimonios',
  labels: { singular: 'Opiniones de usuarios', plural: 'Bloques de opiniones' },
  fields: [
    { name: 'titulo', type: 'text', label: 'Título de la sección', defaultValue: 'Lo que dicen nuestros usuarios' },
    { name: 'descripcion', type: 'textarea', label: 'Descripción (opcional)' },
    {
      name: 'testimonios',
      type: 'array',
      label: 'Testimonios',
      minRows: 1,
      labels: { singular: 'Testimonio', plural: 'Testimonios' },
      fields: [
        { name: 'foto', type: 'upload', relationTo: 'media', label: 'Foto (opcional)' },
        { name: 'nombre', type: 'text', required: true, label: 'Nombre' },
        { name: 'cargo', type: 'text', label: 'Cargo o empresa' },
        { name: 'testimonio', type: 'textarea', required: true, label: 'Testimonio' },
        {
          name: 'calificacion',
          type: 'select',
          label: 'Calificación',
          defaultValue: '5',
          options: [
            { label: '⭐⭐⭐⭐⭐ (5)', value: '5' },
            { label: '⭐⭐⭐⭐ (4)', value: '4' },
            { label: '⭐⭐⭐ (3)', value: '3' },
          ],
        },
      ],
    },
  ],
}
