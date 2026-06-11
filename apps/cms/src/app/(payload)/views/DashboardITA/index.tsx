import type { AdminViewProps } from 'payload'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ResumenGeneral } from './components/ResumenGeneral'
import { CategoriaCard } from './components/CategoriaCard'
import { CATEGORIAS_ITA } from '../../../../collections/ITAChecklist'

export default async function DashboardITAView({ initPageResult }: AdminViewProps) {
  const payload = await getPayload({ config })
  const user = initPageResult?.req?.user as any

  const tenantId = user?.rol === 'superadmin'
    ? null
    : (typeof user?.tenant === 'object' ? user?.tenant?.id : user?.tenant)

  let nombreTenant = 'Todos los tenants'
  if (tenantId) {
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    }).catch(() => null)
    nombreTenant = (tenant as any)?.nombre ?? 'Mi organización'
  }

  const { docs: items } = await payload.find({
    collection: 'ita-checklist',
    where: tenantId ? { tenant: { equals: tenantId } } : undefined,
    limit: 500,
    depth: 0,
  })

  const resumen = {
    total: items.length,
    cumple: items.filter((i: any) => i.cumplimiento === 'si').length,
    noCumple: items.filter((i: any) => i.cumplimiento === 'no').length,
    pendiente: items.filter((i: any) => i.cumplimiento === 'pendiente').length,
    noAplica: items.filter((i: any) => i.cumplimiento === 'na').length,
  }

  const porCategoria = CATEGORIAS_ITA.map((cat) => {
    const catItems = items.filter((i: any) => i.categoria === cat.value)
    return {
      value: cat.value,
      nombre: cat.label,
      total: catItems.length,
      cumple: catItems.filter((i: any) => i.cumplimiento === 'si').length,
      noCumple: catItems.filter((i: any) => i.cumplimiento === 'no').length,
      pendiente: catItems.filter((i: any) => i.cumplimiento === 'pendiente').length,
      noAplica: catItems.filter((i: any) => i.cumplimiento === 'na').length,
    }
  }).filter((cat) => cat.total > 0)

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--theme-text)', fontWeight: 700 }}>
          📊 Dashboard de Cumplimiento ITA
        </h1>
        <p style={{ margin: '8px 0 0', color: 'var(--theme-elevation-500)', fontSize: '14px' }}>
          Resolución MinTIC 1519 — Índice de Transparencia y Acceso a la Información
        </p>
      </div>

      <ResumenGeneral {...resumen} nombreTenant={nombreTenant} />

      {tenantId && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <a href={`/api/ita-checklist/export/excel?tenant=${tenantId}`}
            style={{ padding: '8px 16px', background: '#15803d', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            📊 Descargar reporte Excel
          </a>
          <a href={`/api/ita-checklist/export/pdf?tenant=${tenantId}`}
            style={{ padding: '8px 16px', background: '#b91c1c', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            📄 Descargar reporte PDF
          </a>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <a href={`/admin/collections/ita-checklist?where[cumplimiento][equals]=no`}
          style={{ padding: '8px 16px', background: '#ef4444', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ❌ No cumplen ({resumen.noCumple})
        </a>
        <a href={`/admin/collections/ita-checklist?where[cumplimiento][equals]=pendiente`}
          style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ⏳ Pendientes ({resumen.pendiente})
        </a>
        <Link href="/admin/collections/ita-checklist"
          style={{ padding: '8px 16px', background: 'var(--theme-elevation-150)', color: 'var(--theme-text)', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          📋 Todos ({resumen.total})
        </Link>
      </div>

      <h2 style={{ fontSize: '16px', color: 'var(--theme-text)', marginBottom: '16px' }}>
        Cumplimiento por categoría
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {porCategoria.map((cat) => (
          <CategoriaCard key={cat.value} {...cat} />
        ))}
      </div>

      {resumen.total === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--theme-elevation-500)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p>No hay ítems ITA cargados aún.</p>
        </div>
      )}
    </div>
  )
}