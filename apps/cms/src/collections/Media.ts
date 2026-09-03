import type { CollectionConfig } from 'payload'
import { permisoModulo, permisoLecturaPublica } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { setUploadPrefix } from '../hooks/setUploadPrefix'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo multimedia',
    plural: 'Archivos multimedia',
  },
  admin: {
    group: 'Mi sitio',
    description: 'Imágenes, documentos y archivos subidos al CMS',
    defaultColumns: ['filename', 'carpeta', 'alt', 'tenant'],
  },
   hooks: {
    beforeOperation: [injectTenantContext, setUploadPrefix],
    beforeChange: [autoAssignTenant],
  },
  access: {
    // Públicos para visitantes anónimos (logos, imágenes de páginas); un
    // usuario ya autenticado que no sea superadmin solo ve los de su tenant,
    // y editor/visualizador necesitan el permiso "ver" explícito.
    read: permisoLecturaPublica('medios'),
    create: permisoModulo('medios', 'crear'),
    update: permisoModulo('medios', 'editar'),
    delete: permisoModulo('medios', 'eliminar'),
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
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
      { name: 'card',      width: 768, height: 512, position: 'centre' },
      { name: 'hero',      width: 1920,             position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'carpeta',
      type: 'select',
      required: true,
      defaultValue: 'general',
      label: 'Carpeta / componente',
      admin: {
        description:
          'Dónde se guarda físicamente el archivo (ej: media/hero/, media/galeria/). No se puede cambiar después de subir el archivo.',
        position: 'sidebar',
      },
      options: [
        { label: 'Hero (portada)', value: 'hero' },
        { label: 'Cards', value: 'cards' },
        { label: 'Galería', value: 'galeria' },
        { label: 'Equipo', value: 'equipo' },
        { label: 'Aliados', value: 'aliados' },
        { label: 'Testimonios', value: 'testimonios' },
        { label: 'Noticias', value: 'noticias' },
        { label: 'Documentos', value: 'documentos' },
        { label: 'Logos de tenant', value: 'tenants' },
        { label: 'SEO / OG de páginas', value: 'paginas' },
        { label: 'Avatares de usuario', value: 'usuarios' },
        { label: 'General / otros', value: 'general' },
      ],
    },
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