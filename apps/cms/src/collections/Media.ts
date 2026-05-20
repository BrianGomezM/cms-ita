import type { CollectionConfig } from 'payload'
import { leerPropiaTenant } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo multimedia',
    plural: 'Archivos multimedia',
  },
  admin: {
    group: 'Contenido',
    description: 'Imágenes, documentos y archivos subidos al CMS',
  },
   hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
  },
  access: {
    read: () => true, // Los medios son públicos (logos, imágenes de páginas)
    create: leerPropiaTenant,
    update: leerPropiaTenant,
    delete: leerPropiaTenant,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 200, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto alternativo (accesibilidad)',
      admin: {
        description: 'Descripción de la imagen para lectores de pantalla (WCAG)',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants' as any,
      label: 'Cliente',
      admin: {
        description: 'Tenant al que pertenece este archivo',
        position: 'sidebar',
      },
    },
  ],
}