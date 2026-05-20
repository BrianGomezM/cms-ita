import type { CollectionConfig } from 'payload'
import { soloSuperAdmin } from '../access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Cliente (Tenant)',
    plural: 'Clientes (Tenants)',
  },
  admin: {
    useAsTitle: 'nombre',
    group: 'Administración',
    defaultColumns: ['nombre', 'nit', 'slug', 'activo'],
    description: 'Entidades públicas cliente del CMS',
  },
  // Solo superadmin gestiona tenants
  access: {
    read: soloSuperAdmin,
    create: soloSuperAdmin,
    update: soloSuperAdmin,
    delete: soloSuperAdmin,
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre de la entidad',
    },
    {
      name: 'nit',
      type: 'text',
      required: true,
      label: 'NIT',
      unique: true,
      admin: {
        description: 'Ej: 900316215-1',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (identificador URL)',
      admin: {
        description: 'Solo minúsculas, números y guiones. Ej: alcaldia-bogota',
      },
    },
    {
      name: 'dominio',
      type: 'text',
      label: 'Dominio personalizado',
      admin: {
        description: 'Dominio propio si aplica. Ej: www.alcaldiabogota.gov.co',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo institucional',
    },
    {
      name: 'configuracion',
      type: 'group',
      label: 'Configuración visual',
      fields: [
        {
          name: 'colorPrimario',
          type: 'text',
          label: 'Color primario (hex)',
          defaultValue: '#003366',
          admin: { description: 'Ej: #003366' },
        },
        {
          name: 'colorSecundario',
          type: 'text',
          label: 'Color secundario (hex)',
          defaultValue: '#0066CC',
        },
        {
          name: 'fuente',
          type: 'select',
          label: 'Fuente principal',
          defaultValue: 'inter',
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'open-sans' },
          ],
        },
      ],
    },
    {
      name: 'activo',
      type: 'checkbox',
      label: 'Tenant activo',
      defaultValue: true,
    },
  ],
  timestamps: true,
}