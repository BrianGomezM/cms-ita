import type { CollectionConfig } from 'payload'
import { leerPropiaTenant, editorOSuperior } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'
import { itaExportExcel, itaExportPdf } from '../endpoints/itaExport'


// Categorías reales de la Resolución MinTIC 1519
export const CATEGORIAS_ITA = [
  { label: '1. Accesibilidad Web', value: '1-accesibilidad' },
  { label: '2. Identidad Visual y GOV.CO', value: '2-identidad-visual' },
  { label: '3. Información de la Entidad', value: '3-informacion-entidad' },
  { label: '4. Normativa', value: '4-normativa' },
  { label: '5. Contratación', value: '5-contratacion' },
  { label: '6. Planeación', value: '6-planeacion' },
  { label: '7. Trámites', value: '7-tramites' },
  { label: '8. Participa', value: '8-participa' },
  { label: '9. Datos Abiertos', value: '9-datos-abiertos' },
  { label: '10. Grupos de Interés', value: '10-grupos-interes' },
  { label: '11. Reporte de Información', value: '11-reporte' },
  { label: '12. Información Tributaria', value: '12-tributaria' },
  { label: '13. Atención y Servicios', value: '13-atencion-servicios' },
  { label: '14. Sección de Noticias', value: '14-noticias' },
  { label: '15. Condiciones Técnicas', value: '15-condiciones-tecnicas' },
]

export const ITAChecklist: CollectionConfig = {
  slug: 'ita-checklist',
  labels: {
    singular: 'Ítem ITA',
    plural: 'Checklist ITA',
  },
  admin: {
    useAsTitle: 'pregunta',
    group: 'Transparencia',
    defaultColumns: ['idPregunta', 'categoria', 'cumplimiento', 'tenant', 'fechaVerificacion'],
    description: 'Ítems de auditoría Resolución MinTIC 1519',
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange],   // ← agregar
    afterDelete: [auditAfterDelete],   // ← agregar
  },
  access: {
    read: leerPropiaTenant,
    create: editorOSuperior,
    update: editorOSuperior,
    delete: ({ req: { user } }) => (user as any)?.rol === 'superadmin',
  },
  // Endpoint público: solo expone el porcentaje de cumplimiento del Índice de
  // Transparencia, sin observaciones ni evidencias (esos datos siguen privados).
  endpoints: [
    {
      path: '/resumen',
      method: 'get',
      handler: async (req) => {
        const tenantParam = req.query?.tenant
        const tenantId = Array.isArray(tenantParam) ? tenantParam[0] : tenantParam

        if (!tenantId) {
          return Response.json({ error: 'Falta el parámetro "tenant"' }, { status: 400 })
        }

        const { docs } = await req.payload.find({
          collection: 'ita-checklist',
          where: { tenant: { equals: tenantId } },
          limit: 500,
          depth: 0,
          overrideAccess: true,
        })

        const total = docs.length
        const cumple = docs.filter((i: any) => i.cumplimiento === 'si').length
        const noAplica = docs.filter((i: any) => i.cumplimiento === 'na').length
        const aplicables = total - noAplica
        const porcentaje = aplicables > 0 ? Math.round((cumple / aplicables) * 100) : 0

        return Response.json({ total, cumple, noAplica, aplicables, porcentaje })
      },
    },
    itaExportExcel,
    itaExportPdf,
  ],
  fields: [
    // ── Identificación ──────────────────────────────────
    {
      name: 'idPregunta',
      type: 'number',
      required: true,
      label: 'ID Pregunta (MinTIC)',
      admin: {
        description: 'Número oficial del ítem en la resolución',
        position: 'sidebar',
      },
    },
    {
      name: 'categoria',
      type: 'select',
      required: true,
      label: 'Categoría',
      options: CATEGORIAS_ITA,
      admin: { position: 'sidebar' },
    },
    {
      name: 'subcategoria',
      type: 'text',
      label: 'Subcategoría',
      admin: { position: 'sidebar' },
    },
    // ── Contenido del ítem ──────────────────────────────
    {
      name: 'pregunta',
      type: 'textarea',
      required: true,
      label: 'Pregunta / Requisito',
    },
    {
      name: 'explicacion',
      type: 'textarea',
      label: 'Explicación / Normatividad',
      admin: {
        description: 'Instrucciones oficiales del MinTIC para cumplir este ítem',
      },
    },
    // ── Estado de cumplimiento ──────────────────────────
    {
      name: 'cumplimiento',
      type: 'select',
      required: true,
      label: 'Estado de cumplimiento',
      defaultValue: 'pendiente',
      options: [
        { label: '✅ Sí cumple', value: 'si' },
        { label: '❌ No cumple', value: 'no' },
        { label: '➖ No aplica', value: 'na' },
        { label: '⏳ Pendiente', value: 'pendiente' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'observacion',
      type: 'textarea',
      label: 'Observación / Justificación',
      admin: {
        description: 'Justificación del estado o descripción de la evidencia',
      },
    },
    {
      name: 'urlEvidencia',
      type: 'text',
      label: 'URL de evidencia',
      admin: {
        description: 'Enlace donde se puede verificar el cumplimiento',
      },
    },
    {
      name: 'fechaVerificacion',
      type: 'date',
      label: 'Fecha de verificación',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd/MM/yyyy' },
      },
    },
    // ── Vínculo con página del CMS ──────────────────────
    {
      name: 'paginaRelacionada',
      type: 'relationship',
      relationTo: 'pages' as any,
      label: 'Página del CMS donde se cumple',
      admin: {
        description: 'Página del sitio donde se implementa este requisito',
      },
    },
    // ── Tenant ──────────────────────────────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants' as any,
      required: true,
      label: 'Cliente',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}