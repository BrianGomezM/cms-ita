import type { CollectionConfig } from 'payload'
import { editorOSuperior, leerPropiaTenant } from '../access'
import { HeroBlock } from '../blocks/Hero'
import { RichTextBlock } from '../blocks/RichText'
import { CardsBlock } from '../blocks/Cards'
import { GaleriaBlock } from '../blocks/Galeria'
import { ApiExternaBlock } from '../blocks/ApiExterna'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Página',
    plural: 'Páginas',
  },
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
    defaultColumns: ['titulo', 'slug', 'estado', 'tenant', 'updatedAt'],
    description: 'Páginas del sitio web institucional',
    preview: (doc) => {
      if (doc?.slug) return `${process.env.NEXT_PUBLIC_SERVER_URL}/preview/${doc.slug}`
      return null
    },
  },
  versions: {
    drafts: true, // Borradores y publicación
  },
  access: {
    // Páginas publicadas son públicas — cualquiera puede leerlas
    read: ({ req: { user } }) => {
      if (user) return true // usuarios autenticados ven todo
      // Visitantes anónimos solo ven publicadas
      return { estado: { equals: 'publicado' } }
    },
    create: editorOSuperior,
    update: editorOSuperior,
    delete: editorOSuperior,
  },
  fields: [
    // ── Información básica ──────────────────────────────
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título de la página',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug (URL)',
      admin: {
        description: 'Ej: inicio, nosotros, contratacion. Sin "/" ni espacios.',
      },
      hooks: {
        // Auto-genera el slug desde el título si está vacío
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.titulo) {
              return (data.titulo as string)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // quita tildes
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Meta descripción (SEO)',
      admin: {
        description: 'Máximo 160 caracteres. Se usa en motores de búsqueda.',
      },
    },
    // ── Tenant (sidebar) ────────────────────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants' as any,
      required: true,
      label: 'Cliente (Tenant)',
      admin: {
        position: 'sidebar',
        description: 'Entidad a la que pertenece esta página',
      },
    },
    // ── Estado (sidebar) ────────────────────────────────
    {
      name: 'estado',
      type: 'select',
      required: true,
      label: 'Estado',
      defaultValue: 'borrador',
      options: [
        { label: '📝 Borrador', value: 'borrador' },
        { label: '🔍 En revisión', value: 'revision' },
        { label: '✅ Publicado', value: 'publicado' },
        { label: '🗄️ Archivado', value: 'archivado' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // ── SEO imagen (sidebar) ────────────────────────────
    {
      name: 'imagenSeo',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen OG (redes sociales)',
      admin: {
        position: 'sidebar',
        description: 'Imagen que aparece al compartir en redes. 1200x630px recomendado.',
      },
    },
    // ── Constructor de bloques ──────────────────────────
    {
      name: 'layout',
      type: 'blocks',
      label: 'Bloques de contenido',
      blocks: [
        HeroBlock,
        RichTextBlock,
        CardsBlock,
        GaleriaBlock,
        ApiExternaBlock,
      ],
      admin: {
        description: 'Arrastra y ordena los bloques para construir la página',
      },
    },
  ],
}