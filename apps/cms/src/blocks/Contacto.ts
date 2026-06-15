import type { Block } from 'payload'

export const ContactoBlock: Block = {
  slug: 'contacto',
  labels: {
    singular: 'Formulario de contacto',
    plural: 'Bloques de contacto',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Contáctanos',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción (opcional)',
      defaultValue: 'Escríbenos y te responderemos a la mayor brevedad posible.',
    },
    {
      name: 'mostrarInfoContacto',
      type: 'checkbox',
      label: 'Mostrar datos de contacto de la entidad (dirección, teléfono, correo)',
      defaultValue: true,
    },
  ],
}
