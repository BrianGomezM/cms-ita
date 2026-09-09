import type { CollectionConfig, Where } from 'payload'
import { permisoModulo, permisoLecturaConEstado } from '../access'
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
import { BannerPaginaBlock } from '../blocks/BannerPagina'
import { MenuConContenidoBlock } from '../blocks/MenuConContenido'
import { LienzoBlock } from '../blocks/Lienzo'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'
import { revalidatePageAfterChange, revalidatePageAfterDelete } from '../hooks/revalidateWeb'
import { publicarVariasPaginas } from '../endpoints/publicarPaginas'

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
    components: {
      // Botón "Publicar N páginas seleccionadas" arriba de la tabla del
      // listado — publica de una sola vez varias páginas editadas, en vez
      // de tener que entrar una por una a darle "Publicar".
      beforeListTable: ['/app/(payload)/components/PublicarVariasButton#default'],
    },
  },
  versions: {
    drafts: true, // Borradores y publicación
  },
  endpoints: [publicarVariasPaginas],
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange, revalidatePageAfterChange],
    afterDelete: [auditAfterDelete, revalidatePageAfterDelete],
  },
  access: {
    // Páginas publicadas son públicas para visitantes anónimos; un usuario
    // autenticado ve las de su propio tenant (incluidos borradores) si tiene
    // permiso "ver"; superadmin/admin_cliente ven las de su alcance siempre.
    read: permisoLecturaConEstado('paginas'),
    create: permisoModulo('paginas', 'crear'),
    update: permisoModulo('paginas', 'editar'),
    delete: permisoModulo('paginas', 'eliminar'),
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
    // ── Jerarquía / migas de pan (sidebar) ───────────────
    {
      name: 'paginaPadre',
      type: 'relationship',
      relationTo: 'pages' as any,
      label: 'Página padre',
      admin: {
        position: 'sidebar',
        description: 'Si esta página vive "dentro" de otra (ej: el detalle de una tarjeta de Competitividad Regional), selecciónala aquí. Las migajas de pan del sitio mostrarán la ruta completa: Inicio › Página padre › esta página.',
      },
      filterOptions: ({ data }: { data?: { tenant?: unknown; id?: unknown } }) => {
        const where: Where = {}
        if (data?.tenant) where.tenant = { equals: data.tenant }
        if (data?.id) where.id = { not_equals: data.id }
        return Object.keys(where).length ? where : true
      },
    },
    // ── Constructor de bloques ──────────────────────────
    {
      name: 'layout',
      type: 'blocks',
      label: 'Bloques de contenido',
      labels: {
        singular: 'Contenido',
        plural: 'Bloques de contenido',
      },
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
        BannerPaginaBlock,
        MenuConContenidoBlock,
        LienzoBlock,
      ],
      admin: {
        description: 'Arrastra y ordena los bloques para construir la página',
      },
    },
  ],
}