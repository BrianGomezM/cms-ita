import type { PayloadServerReactComponent, AdminViewProps } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ResumenGeneral } from './components/ResumenGeneral'
import { CategoriaCard } from './components/CategoriaCard'
import { CATEGORIAS_ITA } from '../../collections/ITAChecklist'

const DashboardITAView: PayloadServerReactComponent<AdminViewProps> = async ({ initPageResult }) => {
  const payload = await getPayload({ config })
  const user = initPageResult?.req?.user as any

  // Obtener el tenant del usuario
  const tenantId = user?.rol === 'superadmin'
    ? null
    : (typeof user?.tenant === 'object' ? user?.tenant?.id : user?.tenant)

  // Obtener nombre del tenant
  let nombreTenant = 'Todos los tenants'
  if (tenantId) {
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    }).catch(() => null)
    nombreTenant = (tenant as any)?.nombre ?? 'Mi organización'
  }

  // Obtener todos los ítems ITA del tenant
  const query = tenantId
    ? { tenant: { equals: tenantId } }
    : undefined

  const { docs: items } = await payload.find({
    collection: 'ita-checklist',
    where: query,
    limit: 500,
    depth: 0,
  })

  // Calcular estadísticas generales
  const resumen = {
    total: items.length,
    cumple: items.filter((i: any) => i.cumplimiento === 'si').length,
    noCumple: items.filter((i: any) => i.cumplimiento === 'no').length,
    pendiente: items.filter((i: any) => i.cumplimiento === 'pendiente').length,
    noAplica: items.filter((i: any) => i.cumplimiento === 'na').length,
  }

  // Calcular estadísticas por categoría
  const porCategoria = CATEGORIAS_ITA.map((cat: { value: any; label: any }) => {
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
  }).filter((cat: { total: number }) => cat.total > 0) // solo categorías con ítems

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>
      {/* Título */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--theme-text)', fontWeight: 700 }}>
          📊 Dashboard de Cumplimiento ITA
        </h1>
        <p style={{ margin: '8px 0 0', color: 'var(--theme-elevation-500)', fontSize: '14px' }}>
          Resolución MinTIC 1519 — Índice de Transparencia y Acceso a la Información
        </p>
      </div>

      {/* Resumen general */}
      <ResumenGeneral {...resumen} nombreTenant={nombreTenant} />

      {/* Acciones rápidas */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <a
          href="/admin/collections/ita-checklist?where[cumplimiento][equals]=no"
          style={{
            padding: '8px 16px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          ❌ Ver ítems que no cumplen ({resumen.noCumple})
        </a>
        <a
          href="/admin/collections/ita-checklist?where[cumplimiento][equals]=pendiente"
          style={{
            padding: '8px 16px',
            background: '#f59e0b',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          ⏳ Ver pendientes ({resumen.pendiente})
        </a>
        <a
          href="/admin/collections/ita-checklist"
          style={{
            padding: '8px 16px',
            background: 'var(--theme-elevation-150)',
            color: 'var(--theme-text)',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          📋 Ver todos los ítems ({resumen.total})
        </a>
      </div>

      {/* Grid de categorías */}
      <h2 style={{ fontSize: '16px', color: 'var(--theme-text)', marginBottom: '16px' }}>
        Cumplimiento por categoría
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {porCategoria.map((cat: { value: string; nombre: string; total: number; cumple: number; noCumple: number; pendiente: number; noAplica: number }) => (
          <CategoriaCard key={cat.value} {...cat} />
        ))}
      </div>

      {resumen.total === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: 'var(--theme-elevation-500)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p>No hay ítems ITA cargados aún.</p>
          <a
            href="/admin/collections/ita-checklist/create"
            style={{ color: 'var(--theme-success-500)', textDecoration: 'underline' }}
          >
            Agregar primer ítem
          </a>
        </div>
      )}
    </div>
  )
} 

export default DashboardITAView
