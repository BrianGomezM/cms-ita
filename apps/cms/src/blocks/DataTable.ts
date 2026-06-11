import type { Block } from 'payload'

export const DataTableBlock: Block = {
  slug: 'data-table',
  labels: {
    singular: 'Tabla de datos',
    plural: 'Bloques de tabla de datos',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      admin: { description: 'Ej: Presupuesto por vigencia, Indicadores de gestión' },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'columnas',
      type: 'array',
      label: 'Columnas',
      labels: { singular: 'Columna', plural: 'Columnas' },
      minRows: 1,
      fields: [
        {
          name: 'etiqueta',
          type: 'text',
          required: true,
          label: 'Encabezado de columna',
        },
      ],
    },
    {
      name: 'filas',
      type: 'array',
      label: 'Filas',
      labels: { singular: 'Fila', plural: 'Filas' },
      minRows: 1,
      admin: {
        description: 'Agrega una celda por cada columna definida arriba, en el mismo orden.',
      },
      fields: [
        {
          name: 'celdas',
          type: 'array',
          label: 'Celdas',
          labels: { singular: 'Celda', plural: 'Celdas' },
          minRows: 1,
          fields: [
            {
              name: 'valor',
              type: 'text',
              label: 'Valor',
            },
          ],
        },
      ],
    },
  ],
}
