import type { CollectionConfig } from 'payload'
import { permisoModulo } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'

export const ContactMessages: CollectionConfig = {
  slug: 'mensajes-contacto',
  labels: {
    singular: 'Mensaje de contacto',
    plural: 'Mensajes de contacto',
  },
  admin: {
    group: 'Mi sitio',
    useAsTitle: 'asunto',
    defaultColumns: ['nombre', 'asunto', 'correo', 'leido', 'createdAt'],
    description: 'Mensajes enviados desde el formulario de contacto del sitio web',
  },
  hooks: {
    beforeOperation: [injectTenantContext],
  },
  access: {
    // Cualquier visitante del sitio puede enviar un mensaje de contacto
    create: () => true,
    read: permisoModulo('mensajesContacto', 'ver'),
    update: permisoModulo('mensajesContacto', 'editar'),
    delete: permisoModulo('mensajesContacto', 'eliminar'),
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'correo',
      type: 'email',
      required: true,
      label: 'Correo electrónico',
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'asunto',
      type: 'text',
      required: true,
      label: 'Asunto',
    },
    {
      name: 'mensaje',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
    },
    {
      name: 'leido',
      type: 'checkbox',
      label: 'Leído',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Entidad',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
