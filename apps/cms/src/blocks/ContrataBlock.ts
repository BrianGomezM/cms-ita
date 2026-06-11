import type { Block } from 'payload'

export const ContrataBlock: Block = {
  slug: 'contrata',
  labels: {
    singular: 'Procesos de contratación',
    plural: 'Bloques de contratación',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Procesos de contratación',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Procesos',
      labels: { singular: 'Proceso', plural: 'Procesos' },
      minRows: 1,
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Objeto del contrato',
          admin: { description: 'Ej: Suministro de equipos de cómputo' },
        },
        {
          name: 'modalidad',
          type: 'select',
          label: 'Modalidad',
          options: [
            { label: 'Licitación pública', value: 'licitacion' },
            { label: 'Contratación directa', value: 'directa' },
            { label: 'Mínima cuantía', value: 'minima-cuantia' },
            { label: 'Selección abreviada', value: 'seleccion-abreviada' },
            { label: 'Concurso de méritos', value: 'concurso-meritos' },
          ],
        },
        {
          name: 'estado',
          type: 'select',
          required: true,
          label: 'Estado',
          defaultValue: 'abierto',
          options: [
            { label: 'Abierto', value: 'abierto' },
            { label: 'En evaluación', value: 'evaluacion' },
            { label: 'Adjudicado', value: 'adjudicado' },
            { label: 'Cerrado', value: 'cerrado' },
          ],
        },
        {
          name: 'fechaPublicacion',
          type: 'date',
          label: 'Fecha de publicación',
          admin: { date: { displayFormat: 'dd/MM/yyyy' } },
        },
        {
          name: 'valor',
          type: 'text',
          label: 'Valor estimado',
          admin: { description: 'Ej: $ 50.000.000' },
        },
        {
          name: 'enlaceSecop',
          type: 'text',
          label: 'Enlace en SECOP',
          admin: { description: 'URL del proceso en SECOP I o SECOP II' },
        },
      ],
    },
  ],
}
