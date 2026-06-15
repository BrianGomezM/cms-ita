import type { Block } from 'payload'

export const AliadosBlock: Block = {
  slug: 'aliados',
  labels: { singular: 'Aliados / Convenios', plural: 'Bloques de aliados' },
  fields: [
    { name: 'titulo', type: 'text', label: 'Título de la sección', defaultValue: 'Nuestros aliados y convenios' },
    { name: 'descripcion', type: 'textarea', label: 'Descripción (opcional)' },
    {
      name: 'aliados',
      type: 'array',
      label: 'Aliados',
      minRows: 1,
      labels: { singular: 'Aliado', plural: 'Aliados' },
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', required: true, label: 'Logo' },
        { name: 'nombre', type: 'text', required: true, label: 'Nombre del aliado o convenio' },
        { name: 'enlace', type: 'text', label: 'Enlace (URL)', admin: { description: 'Ej: https://www.aliado.com' } },
      ],
    },
  ],
}
