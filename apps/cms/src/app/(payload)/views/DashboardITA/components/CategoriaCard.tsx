'use client'

type Props = {
  nombre: string
  total: number
  cumple: number
  noCumple: number
  pendiente: number
  noAplica: number
}

export function CategoriaCard({ nombre, total, cumple, noCumple, pendiente, noAplica }: Props) {
  const porcentaje = total > 0 ? Math.round((cumple / (total - noAplica)) * 100) : 0
  const efectivos = total - noAplica

  const color =
    porcentaje >= 80 ? '#22c55e' :
    porcentaje >= 50 ? '#f59e0b' :
    '#ef4444'

  return (
    <div style={{
      background: 'var(--theme-elevation-50)',
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {/* Nombre categoría */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--theme-text)' }}>
        {nombre}
      </div>

      {/* Barra de progreso */}
      <div style={{
        height: '8px',
        background: 'var(--theme-elevation-150)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${porcentaje}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span style={{ color, fontWeight: 700 }}>{porcentaje}%</span>
        <span style={{ color: 'var(--theme-elevation-500)' }}>
          {cumple}/{efectivos} ítems
        </span>
      </div>

      {/* Detalle */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '11px', flexWrap: 'wrap' }}>
        <span style={{ color: '#22c55e' }}>✅ {cumple} cumplen</span>
        <span style={{ color: '#ef4444' }}>❌ {noCumple} no cumplen</span>
        <span style={{ color: '#f59e0b' }}>⏳ {pendiente} pendientes</span>
        {noAplica > 0 && <span style={{ color: 'var(--theme-elevation-500)' }}>➖ {noAplica} N/A</span>}
      </div>
    </div>
  )
}