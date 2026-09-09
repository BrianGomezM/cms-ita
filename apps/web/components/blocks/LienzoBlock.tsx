import type { LienzoBlockType } from '@/lib/types'
import { ContenidoRenderer } from './contenido/ContenidoRenderer'

// Sección de página sin estructura fija: solo recorre las piezas que el
// editor haya combinado (título, párrafo, imágenes, tarjetas...) en el
// orden en que las dejó. Si mañana cambia el contenido, este componente no
// necesita tocarse — todo el comportamiento vive en ContenidoRenderer.
//
// El borde y el ancho/alto del contenedor son opcionales: si el editor no
// los define, no se aplica ningún estilo extra y la sección se comporta
// como cualquier otra (ancho automático del sitio, sin borde).
export default function LienzoBlock({
  bordeActivo = false,
  bordeAncho = 1,
  bordeColor,
  bordeRedondeo = 0,
  ancho,
  alto,
  contenido,
}: LienzoBlockType) {
  if (!contenido?.length) return null

  const estiloContenedor: React.CSSProperties = {}
  if (bordeActivo) {
    estiloContenedor.border = `${bordeAncho}px solid ${bordeColor || '#E5E7EB'}`
    if (bordeRedondeo) estiloContenedor.borderRadius = bordeRedondeo
  }
  if (ancho) {
    estiloContenedor.width = ancho
    estiloContenedor.maxWidth = '100%'
  }
  if (alto) {
    estiloContenedor.height = alto
    estiloContenedor.overflowY = 'auto'
  }

  return (
    <section className="py-12">
      <div
        className={`container-institucional space-y-5 ${bordeActivo ? 'p-6' : ''}`}
        style={Object.keys(estiloContenedor).length ? estiloContenedor : undefined}
      >
        {contenido.map((bloque, i) => <ContenidoRenderer key={i} bloque={bloque} />)}
      </div>
    </section>
  )
}
