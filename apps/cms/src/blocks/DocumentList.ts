import type { Block } from 'payload'

export const DocumentListBlock: Block = {
  slug: 'document-list',
  labels: {
    singular: 'Lista de documentos',
    plural: 'Bloques de documentos',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Normativa y documentos',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Documentos',
      labels: { singular: 'Documento', plural: 'Documentos' },
      minRows: 1,
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre del documento',
          admin: { description: 'Ej: Resolución 1519 de 2020' },
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción (opcional)',
        },
        {
          name: 'categoria',
          type: 'text',
          label: 'Categoría (opcional)',
          admin: { description: 'Ej: Normativa, Informes, Manuales' },
        },
        {
          name: 'archivo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Archivo',
        },
        {
          name: 'fecha',
          type: 'date',
          label: 'Fecha del documento',
          admin: { date: { displayFormat: 'dd/MM/yyyy' } },
        },
      ],
    },
  ],
}
