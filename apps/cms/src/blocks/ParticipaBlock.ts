import type { Block } from 'payload'

export const ParticipaBlock: Block = {
  slug: 'participa',
  labels: {
    singular: 'Participación ciudadana',
    plural: 'Bloques de participación',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Participa',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Texto introductorio (opcional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Mecanismos de participación',
      labels: { singular: 'Mecanismo', plural: 'Mecanismos' },
      minRows: 1,
      fields: [
        {
          name: 'titulo',
          type: 'text',
          required: true,
          label: 'Título',
          admin: { description: 'Ej: Encuesta de percepción ciudadana' },
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripción',
        },
        {
          name: 'tipoMecanismo',
          type: 'select',
          label: 'Tipo',
          defaultValue: 'pqrsd',
          options: [
            { label: 'PQRSD (Peticiones, quejas, reclamos)', value: 'pqrsd' },
            { label: 'Encuesta', value: 'encuesta' },
            { label: 'Rendición de cuentas', value: 'rendicion-cuentas' },
            { label: 'Consulta ciudadana', value: 'consulta' },
            { label: 'Foro / espacio de diálogo', value: 'foro' },
          ],
        },
        {
          name: 'enlace',
          type: 'text',
          required: true,
          label: 'Enlace',
        },
        {
          name: 'fechaLimite',
          type: 'date',
          label: 'Fecha límite (opcional)',
          admin: { date: { displayFormat: 'dd/MM/yyyy' } },
        },
      ],
    },
  ],
}
