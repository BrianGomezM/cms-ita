'use client'

type Props = {
  total: number
  cumple: number
  noCumple: number
  pendiente: number
  noAplica: number
  nombreTenant: string
}

export function ResumenGeneral({ total, cumple, noCumple, pendiente, noAplica, nombreTenant }: Props) {
  const efectivos = total - noAplica
  const porcentaje = efectivos > 0 ? Math.round((cumple / efectivos) * 100) : 0

  const color =
    porcentaje >= 80 ? '#22c55e' :
    porcentaje >= 50 ? '#f59e0b' :
    '#ef4444'

  return (
    <div style={{
      background: 'var(--theme-elevation-50)',
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--theme-text)', fontWeight: 700 }}>
            {nombreTenant}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--theme-elevation-500)' }}>
            Resolución MinTIC 1519 — Índice de Transparencia y Acceso
          </p>
        </div>

        {/* Porcentaje grande */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color, lineHeight: 1 }}>
            {porcentaje}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '4px' }}>
            cumplimiento general
          </div>
        </div>
      </div>

      {/* Barra general */}
      <div style={{
        height: '12px',
        background: 'var(--theme-elevation-150)',
        borderRadius: '6px',
        overflow: 'hidden',
        margin: '20px 0 16px',
      }}>
        <div style={{
          width: `${porcentaje}%`,
          height: '100%',
          background: color,
          borderRadius: '6px',
        }} />
      </div>

      {/* Contadores */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>{cumple}</div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>Cumplen</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{noCumple}</div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>No cumplen</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{pendiente}</div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>Pendientes</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--theme-elevation-500)' }}>{noAplica}</div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>No aplica</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--theme-text)' }}>{total}</div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>Total ítems</div>
        </div>
      </div>
    </div>
  )
}