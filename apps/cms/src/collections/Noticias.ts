import type { CollectionConfig } from 'payload'
import { editorOSuperior } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'
import { revalidateNoticiaAfterChange, revalidateNoticiaAfterDelete } from '../hooks/revalidateNoticias'

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: {
    singular: 'Noticia / Aviso',
    plural: 'Noticias y avisos',
  },
  admin: {
    useAsTitle: 'titulo',
    group: 'Mi sitio',
    defaultColumns: ['titulo', 'categoria', 'fechaPublicacion', 'estado', 'destacado'],
    description: 'Noticias, avisos y comunicados publicados en el portal',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange, revalidateNoticiaAfterChange],
    afterDelete: [auditAfterDelete, revalidateNoticiaAfterDelete],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { estado: { equals: 'publicado' } }
    },
    create: editorOSuperior,
    update: editorOSuperior,
    delete: editorOSuperior,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug (URL)',
      admin: {
        description: 'Ej: apertura-convocatoria-2026. Sin "/" ni espacios.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.titulo) {
              return (data.titulo as string)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
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
      name: 'resumen',
      type: 'textarea',
      required: true,
      label: 'Resumen breve',
      admin: {
        description: 'Se muestra en el listado de noticias. Máximo 200 caracteres.',
      },
    },
    {
      name: 'contenido',
      type: 'richText',
      label: 'Contenido completo',
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
    },
    {
      name: 'categoria',
      type: 'select',
      label: 'Categoría',
      defaultValue: 'noticia',
      options: [
        { label: 'Noticia', value: 'noticia' },
        { label: 'Aviso', value: 'aviso' },
        { label: 'Comunicado', value: 'comunicado' },
        { label: 'Evento', value: 'evento' },
      ],
    },
    {
      name: 'fechaPublicacion',
      type: 'date',
      required: true,
      label: 'Fecha de publicación',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        position: 'sidebar',
      },
    },
    {
      name: 'destacado',
      type: 'checkbox',
      label: 'Destacar en portada',
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
      label: 'Cliente (Tenant)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'estado',
      type: 'select',
      required: true,
      label: 'Estado',
      defaultValue: 'borrador',
      options: [
        { label: '📝 Borrador', value: 'borrador' },
        { label: '✅ Publicado', value: 'publicado' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Debe estar en "Publicado" para que aparezca en el sitio web.',
      },
    },
  ],
}
