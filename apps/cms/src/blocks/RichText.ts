import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: {
    singular: 'Texto libre',
    plural: 'Bloques de texto',
  },
  fields: [
    {
      name: 'contenido',
      type: 'richText',
      required: true,
      label: 'Contenido',
      editor: lexicalEditor(),
    },
    {
      name: 'ancho',
      type: 'select',
      label: 'Ancho del contenedor',
      defaultValue: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Amplio', value: 'amplio' },
        { label: 'Completo', value: 'completo' },
      ],
    },
  ],
}