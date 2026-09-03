import type { Block } from 'payload'

export const EquipoBlock: Block = {
  slug: 'equipo',
  labels: {
    singular: 'Nuestro equipo',
    plural: 'Bloques de equipo',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Nuestro equipo',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción (opcional)',
    },
    {
      name: 'columnas',
      type: 'select',
      label: 'Columnas por fila',
      defaultValue: '4',
      options: [
        { label: '2 columnas', value: '2' },
        { label: '3 columnas', value: '3' },
        { label: '4 columnas', value: '4' },
      ],
    },
    {
      name: 'integrantes',
      type: 'array',
      label: 'Integrantes',
      minRows: 1,
      labels: {
        singular: 'Integrante',
        plural: 'Integrantes',
      },
      fields: [
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto',
        },
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre completo',
        },
        {
          name: 'cargo',
          type: 'text',
          required: true,
          label: 'Cargo',
        },
        {
          name: 'dependencia',
          type: 'text',
          label: 'Área o dependencia',
        },
        {
          name: 'correo',
          type: 'email',
          label: 'Correo de contacto',
        },
        {
          name: 'telefono',
          type: 'text',
          label: 'Teléfono / extensión',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción breve (opcional)',
        },
      ],
    },
  ],
}
