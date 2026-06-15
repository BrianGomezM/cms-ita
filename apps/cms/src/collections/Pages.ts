import type { CollectionConfig } from 'payload'
import { editorOSuperior, leerPropiaTenant } from '../access'
import { HeroBlock } from '../blocks/Hero'
import { RichTextBlock } from '../blocks/RichText'
import { CardsBlock } from '../blocks/Cards'
import { GaleriaBlock } from '../blocks/Galeria'
import { ApiExternaBlock } from '../blocks/ApiExterna'
import { AccordionFAQBlock } from '../blocks/AccordionFAQ'
import { ITABannerBlock } from '../blocks/ITABanner'
import { ContrataBlock } from '../blocks/ContrataBlock'
import { TramiteBlock } from '../blocks/TramiteBlock'
import { ParticipaBlock } from '../blocks/ParticipaBlock'
import { DatosAbiertosBlock } from '../blocks/DatosAbiertosBlock'
import { DocumentListBlock } from '../blocks/DocumentList'
import { TimelineBlock } from '../blocks/Timeline'
import { DataTableBlock } from '../blocks/DataTable'
import { EquipoBlock } from '../blocks/Equipo'
import { ContactoBlock } from '../blocks/Contacto'
import { NoticiasBlock } from '../blocks/Noticias'
import { AliadosBlock } from '../blocks/Aliados'
import { TestimoniosBlock } from '../blocks/Testimonios'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'
import { revalidatePageAfterChange, revalidatePageAfterDelete } from '../hooks/revalidateWeb'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Página',
    plural: 'Páginas',
  },

  admin: {
    useAsTitle: 'titulo',
    group: 'Mi sitio',
    defaultColumns: ['titulo', 'slug', 'estado', 'tenant', 'updatedAt'],
    description: 'Páginas del sitio web institucional',
    preview: (doc) => {
      if (!doc?.slug) return null
      const tenantId = typeof doc.tenant === 'object' ? (doc.tenant as { id?: number })?.id : doc.tenant
      return `${process.env.NEXT_PUBLIC_SITE_URL}/preview/${doc.slug}?tenant=${tenantId ?? ''}`
    },
  },
  versions: {
    drafts: true, // Borradores y publicación
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange, revalidatePageAfterChange],
    afterDelete: [auditAfterDelete, revalidatePageAfterDelete],
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
        AccordionFAQBlock,
        ITABannerBlock,
        ContrataBlock,
        TramiteBlock,
        ParticipaBlock,
        DatosAbiertosBlock,
        DocumentListBlock,
        TimelineBlock,
        DataTableBlock,
        EquipoBlock,
        ContactoBlock,
        NoticiasBlock,
        AliadosBlock,
        TestimoniosBlock,
      ],
      admin: {
        description: 'Arrastra y ordena los bloques para construir la página',
      },
    },
  ],
}