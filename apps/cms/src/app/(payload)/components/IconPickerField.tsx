'use client'

import { useMemo, useState } from 'react'
import type { TextFieldClientComponent } from 'payload'
import { DynamicIcon, iconNames } from 'lucide-react/dynamic'
import { FieldError, FieldLabel, useField, withCondition } from '@payloadcms/ui'

// Íconos que se muestran de una vez, sin necesidad de buscar. El resto de
// la librería (+1900 íconos) aparece al escribir en el buscador.
const POPULARES = [
  'refresh-cw', 'monitor', 'download', 'lightbulb', 'user', 'megaphone', 'search', 'award',
  'clipboard-list', 'bar-chart-3', 'file-text', 'clipboard-check', 'calendar', 'map-pin', 'phone',
  'mail', 'globe', 'shield', 'building-2', 'users', 'book-open', 'landmark', 'scale', 'handshake',
  'trending-up', 'briefcase', 'credit-card', 'receipt', 'pie-chart', 'settings', 'help-circle',
  'info', 'check-circle', 'star', 'message-square', 'link', 'external-link', 'upload',
  'folder-open', 'clock', 'user-check', 'user-plus', 'wallet', 'file-check', 'archive',
  'calendar-check', 'store', 'package', 'truck', 'flag',
]

// Diccionario básico para que buscar en español encuentre íconos, aunque
// sus nombres en la librería están en inglés (ej. escribir "calendario"
// también busca "calendar").
const TRADUCCIONES: Record<string, string> = {
  calendario: 'calendar', telefono: 'phone', teléfono: 'phone', correo: 'mail', email: 'mail',
  mapa: 'map', ubicacion: 'map-pin', ubicación: 'map-pin', dinero: 'wallet', pago: 'credit-card',
  documento: 'file', documentos: 'file-text', carpeta: 'folder', casa: 'home', edificio: 'building',
  persona: 'user', personas: 'users', candado: 'lock', seguridad: 'shield', escudo: 'shield',
  balanza: 'scale', maletin: 'briefcase', maletín: 'briefcase', camion: 'truck', camión: 'truck',
  tienda: 'store', calculadora: 'calculator', grafica: 'chart', gráfica: 'chart', grafico: 'chart',
  gráfico: 'chart', reloj: 'clock', tiempo: 'clock', alerta: 'alert', estrella: 'star',
  corazon: 'heart', corazón: 'heart', descarga: 'download', subir: 'upload', buscar: 'search',
  lupa: 'search', configuracion: 'settings', configuración: 'settings', ajustes: 'settings',
  ayuda: 'help', pregunta: 'help-circle', informacion: 'info', información: 'info',
  mensaje: 'message', chat: 'message-square', video: 'video', camara: 'camera', cámara: 'camera',
  foto: 'image', imagen: 'image', enlace: 'link', flecha: 'arrow', usuario: 'user',
  usuarios: 'users', contrato: 'file-check', factura: 'receipt', recibo: 'receipt', bandera: 'flag',
  libro: 'book', megafono: 'megaphone', megáfono: 'megaphone', anuncio: 'megaphone',
  trofeo: 'award', premio: 'award', bombillo: 'lightbulb', idea: 'lightbulb', foco: 'lightbulb',
  computador: 'monitor', pantalla: 'monitor', llave: 'key', globo: 'globe', mundo: 'globe',
  entidad: 'landmark', gobierno: 'landmark', banco: 'landmark', manos: 'handshake',
  acuerdo: 'handshake', reunion: 'users', reunión: 'users',
}

const LIMITE_RESULTADOS = 120

const humanizar = (nombreKebab: string) =>
  nombreKebab
    .split('-')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ')

function IconTile({
  name,
  selected,
  readOnly,
  onSelect,
}: {
  name: string
  selected: boolean
  readOnly?: boolean
  onSelect: (name: string) => void
}) {
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={() => onSelect(name)}
      title={humanizar(name)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 4px',
        borderRadius: '6px',
        cursor: readOnly ? 'not-allowed' : 'pointer',
        border: selected ? '2px solid var(--theme-success-500)' : '1px solid var(--theme-elevation-150)',
        background: selected ? 'var(--theme-success-100)' : 'var(--theme-elevation-50)',
        opacity: readOnly ? 0.6 : 1,
      }}
    >
      <DynamicIcon name={name as never} size={20} strokeWidth={1.75} />
      <span style={{ fontSize: '10px', textAlign: 'center', lineHeight: 1.2 }}>
        {humanizar(name)}
      </span>
    </button>
  )
}

const IconPickerComponent: TextFieldClientComponent = (props) => {
  const { field, path: pathFromProps, readOnly: readOnlyFromProps } = props
  const { label, required } = field

  const { value, setValue, showError, errorMessage, path, disabled } = useField<string>({
    potentiallyStalePath: pathFromProps,
  })

  const [busqueda, setBusqueda] = useState('')
  const readOnly = readOnlyFromProps || disabled

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return POPULARES

    const alias = TRADUCCIONES[termino]
    const encontrados = iconNames.filter(
      (nombre) => nombre.includes(termino) || (alias && nombre.includes(alias)),
    )
    return encontrados.slice(0, LIMITE_RESULTADOS)
  }, [busqueda])

  const totalCoincidencias = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return POPULARES.length
    const alias = TRADUCCIONES[termino]
    return iconNames.filter(
      (nombre) => nombre.includes(termino) || (alias && nombre.includes(alias)),
    ).length
  }, [busqueda])

  return (
    <div className="field-type">
      <FieldLabel label={label} path={path} required={required} />

      {value && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'var(--theme-elevation-50)',
            width: 'fit-content',
          }}
        >
          <DynamicIcon name={value as never} size={18} strokeWidth={1.75} />
          <span style={{ fontSize: '12px' }}>Seleccionado: {humanizar(value)}</span>
        </div>
      )}

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar entre más de 1900 íconos (ej: calendario, teléfono, mapa)..."
        disabled={readOnly}
        style={{
          width: '100%',
          padding: '8px 10px',
          marginBottom: '8px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
          gap: '8px',
          maxHeight: '360px',
          overflowY: 'auto',
          padding: '2px',
        }}
      >
        {resultados.map((nombre) => (
          <IconTile
            key={nombre}
            name={nombre}
            selected={value === nombre}
            readOnly={readOnly}
            onSelect={setValue}
          />
        ))}
      </div>

      {resultados.length === 0 && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '6px' }}>
          No se encontró ningún ícono con esa palabra. Intenta con otro término (funciona mejor en inglés).
        </p>
      )}

      {totalCoincidencias > resultados.length && (
        <p style={{ fontSize: '11px', color: 'var(--theme-elevation-500)', marginTop: '6px' }}>
          Mostrando {resultados.length} de {totalCoincidencias} resultados. Sigue escribiendo para afinar la búsqueda.
        </p>
      )}

      <FieldError path={path} showError={showError} message={errorMessage} />
    </div>
  )
}

export default withCondition(IconPickerComponent)
