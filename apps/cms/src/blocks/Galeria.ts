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
      name: 'columnas',
      type: 'select',
      label: 'Imágenes por fila',
      defaultValue: '3',
      admin: {
        description: 'Cantidad de columnas en pantallas grandes (aplica a Grilla y Masonry)',
        condition: (_, siblingData) => siblingData?.tipo !== 'carrusel',
      },
      options: [
        { label: '2 por fila', value: '2' },
        { label: '3 por fila', value: '3' },
        { label: '4 por fila', value: '4' },
        { label: '5 por fila', value: '5' },
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