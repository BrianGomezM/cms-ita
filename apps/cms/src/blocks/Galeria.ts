import type { Block } from 'payload'

export const GaleriaBlock: Block = {
  slug: 'galeria',
  labels: {
    singular: 'Galería de imágenes',
    plural: 'Galerías',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la galería',
    },
    {
      name: 'tipo',
      type: 'select',
      label: 'Tipo de visualización',
      defaultValue: 'grid',
      options: [
        { label: 'Grilla', value: 'grid' },
        { label: 'Carrusel', value: 'carrusel' },
        { label: 'Masonry', value: 'masonry' },
      ],
    },
    {
      name: 'imagenes',
      type: 'array',
      label: 'Imágenes',
      minRows: 1,
      fields: [
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Descripción / pie de foto',
        },
      ],
    },
  ],
}