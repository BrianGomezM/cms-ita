import type { Block } from 'payload'

export const DatosAbiertosBlock: Block = {
  slug: 'datos-abiertos',
  labels: {
    singular: 'Datos abiertos',
    plural: 'Bloques de datos abiertos',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Datos abiertos',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Conjuntos de datos',
      labels: { singular: 'Conjunto de datos', plural: 'Conjuntos de datos' },
      minRows: 1,
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre del conjunto de datos',
          admin: { description: 'Ej: Empresas registradas por sector 2025' },
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción',
        },
        {
          name: 'formato',
          type: 'select',
          label: 'Formato',
          defaultValue: 'csv',
          options: [
            { label: 'CSV', value: 'csv' },
            { label: 'Excel (XLSX)', value: 'xlsx' },
            { label: 'JSON', value: 'json' },
            { label: 'XML', value: 'xml' },
            { label: 'PDF', value: 'pdf' },
          ],
        },
        {
          name: 'fechaActualizacion',
          type: 'date',
          label: 'Fecha de actualización',
          admin: { date: { displayFormat: 'dd/MM/yyyy' } },
        },
        {
          name: 'enlaceDescarga',
          type: 'text',
          required: true,
          label: 'Enlace de descarga',
        },
        {
          name: 'enlaceCatalogo',
          type: 'text',
          label: 'Enlace en datos.gov.co (opcional)',
        },
      ],
    },
  ],
}
