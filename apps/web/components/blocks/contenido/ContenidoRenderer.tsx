'use client'

import type { ContenidoPestana, ContenidoTarjetasIconosType, ContenidoTarjetasImagenType, ContenidoCompartirRedesType, Media, RedCompartir, TarjetaImagenItem } from '@/lib/types'
import { DynamicIcon } from 'lucide-react/dynamic'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FacebookIcon, XIcon, LinkedinIcon, WhatsappIcon } from '@/components/icons/SocialIcons'

// Piezas pequeñas y combinables (título, párrafo, imagen, tarjetas...) que
// arman el contenido tanto del bloque "Lienzo" (una sección de página)
// como de cada pestaña de "Menú con contenido" — un solo renderizador
// compartido para que ambos se vean y se comporten igual.

function esUrlExterna(enlace: string) {
  if (!enlace) return false
  return /^https?:\/\//.test(enlace) || enlace.startsWith('tel:') || enlace.startsWith('mailto:')
}

function EnlaceInteligente({
  href,
  className,
  style,
  children,
}: {
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return esUrlExterna(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  )
}

// Soporta **negrita** dentro de un párrafo sin exponer HTML crudo. Devuelve
// null con texto vacío/indefinido — pasa mientras el editor recién agregó
// el bloque y aún no ha escrito nada (la vista previa en vivo envía el
// formulario tal como va, antes de que se cumplan los campos "required").
function renderConNegritas(texto: string | undefined) {
  if (!texto) return null
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return partes.map((parte, i) => (i % 2 === 1 ? <strong key={i}>{parte}</strong> : parte))
}

const ANCHO_IMAGEN: Record<'pequena' | 'mediana' | 'grande' | 'completa', string> = {
  pequena: '33%',
  mediana: '50%',
  grande: '75%',
  completa: '100%',
}

const ESTILO_BOTON: Record<'primario' | 'secundario' | 'outline', string> = {
  primario: 'bg-primary text-white hover:opacity-90',
  secundario: 'bg-secondary text-white hover:opacity-90',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
}

const REDONDEO_CLASES: Record<'ninguno' | 'suave' | 'completo', string> = {
  ninguno: 'rounded-none',
  suave: 'rounded-lg',
  completo: 'rounded-full',
}

export const ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'justify-start',
  centro: 'justify-center',
  derecha: 'justify-end',
}

export const TEXTO_ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'text-left',
  centro: 'text-center',
  derecha: 'text-right',
}

export const ITEMS_ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'items-start',
  centro: 'items-center',
  derecha: 'items-end',
}

// El párrafo admite "justificado" además de las tres alineaciones de texto
// que usan el resto de las piezas (título, subtítulo, etc.).
const PARRAFO_ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha' | 'justificado', string> = {
  izquierda: 'text-left',
  centro: 'text-center',
  derecha: 'text-right',
  justificado: 'text-justify',
}

const COLUMNAS_CLASES: Record<'2' | '3' | '4' | '5' | '6', string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-2 sm:grid-cols-3',
  '4': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  '5': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  '6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
}

function TarjetasIconosGrid({ bloque }: { bloque: ContenidoTarjetasIconosType }) {
  const tarjetas = bloque.tarjetas ?? []
  if (!tarjetas.length) return null

  const columnas = bloque.columnas ?? '5'
  const tarjetaTituloTamano = bloque.tarjetaTituloTamano ?? 15
  const tarjetaTituloNegrita = bloque.tarjetaTituloNegrita ?? true
  const tarjetaTituloAlineacion = bloque.tarjetaTituloAlineacion ?? 'centro'
  const graficoAncho = bloque.graficoAncho ?? 64
  const graficoAlto = bloque.graficoAlto ?? 64
  const graficoAlineacion = bloque.graficoAlineacion ?? 'centro'

  return (
    <div className={`grid gap-4 ${COLUMNAS_CLASES[columnas]}`}>
      {tarjetas.map((tarjeta, i) => {
        const grafico =
          tarjeta.tipo === 'icono' && tarjeta.icono ? (
            <DynamicIcon
              name={tarjeta.icono as never}
              size={Math.min(graficoAncho, graficoAlto)}
              color={bloque.graficoColor || undefined}
              className={bloque.graficoColor ? undefined : 'text-primary'}
            />
          ) : tarjeta.imagen?.url ? (
            <div className="relative shrink-0" style={{ width: graficoAncho, height: graficoAlto }}>
              <Image src={tarjeta.imagen.url} alt={tarjeta.imagen.alt ?? tarjeta.titulo} fill className="object-contain" />
            </div>
          ) : null

        const contenido = (
          <div
            className={`card flex h-full flex-col gap-3 p-5 ${ITEMS_ALINEACION_CLASES[graficoAlineacion]} ${
              tarjeta.enlace ? 'transition-shadow hover:shadow-md' : ''
            }`}
          >
            {grafico}
            <span
              className={`${TEXTO_ALINEACION_CLASES[tarjetaTituloAlineacion]} ${bloque.tarjetaTituloColor ? '' : 'text-primary'}`}
              style={{
                fontSize: tarjetaTituloTamano,
                fontWeight: tarjetaTituloNegrita ? 700 : 400,
                color: bloque.tarjetaTituloColor || undefined,
              }}
            >
              {tarjeta.titulo}
            </span>
          </div>
        )

        return tarjeta.enlace ? (
          <a key={i} href={tarjeta.enlace} className="block h-full">
            {contenido}
          </a>
        ) : (
          <div key={i} className="h-full">
            {contenido}
          </div>
        )
      })}
    </div>
  )
}

const ICONOS_COMPARTIR: Record<RedCompartir, React.ComponentType<{ size?: number; className?: string }>> = {
  facebook: FacebookIcon,
  x: XIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
}

const COLOR_MARCA_COMPARTIR: Record<RedCompartir, string> = {
  facebook: '#1877F2',
  x: '#000000',
  linkedin: '#0A66C2',
  whatsapp: '#25D366',
}

// Arma la URL de compartir de cada red a partir de la página que se está
// viendo (no de un enlace que el editor tenga que escribir a mano).
function urlCompartir(red: RedCompartir, pageUrl: string, titulo: string) {
  const u = encodeURIComponent(pageUrl)
  const t = encodeURIComponent(titulo)
  switch (red) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`
    case 'x':
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
    case 'whatsapp':
      return `https://wa.me/?text=${t}%20${u}`
  }
}

export function CompartirRedes({ bloque }: { bloque: ContenidoCompartirRedesType }) {
  const redes = bloque.redes ?? []
  if (!redes.length) return null

  const tamanoIcono = bloque.iconoTamano ?? 18
  const forma = bloque.iconoForma ?? 'circular'
  const separacion = bloque.iconoSeparacion ?? 10
  const usarColorMarca = (bloque.iconoColores ?? 'marca') === 'marca'
  const tamanoBoton = Math.round(tamanoIcono * 1.8)

  const compartir = (red: RedCompartir) => {
    if (typeof window === 'undefined') return
    window.open(
      urlCompartir(red, window.location.href, document.title),
      '_blank',
      'noopener,noreferrer,width=600,height=500',
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${ALINEACION_CLASES[bloque.alineacion ?? 'izquierda']}`}>
      {bloque.texto && (
        <span
          style={{
            fontSize: bloque.tamano ?? 16,
            fontWeight: bloque.negrita ? 700 : 400,
            color: bloque.color || undefined,
          }}
          className={bloque.color ? undefined : 'text-primary'}
        >
          {bloque.texto}
        </span>
      )}
      <div className="flex items-center" style={{ gap: separacion }}>
        {redes.map((item, i) => {
          const Icono = ICONOS_COMPARTIR[item.red]
          if (!Icono) return null
          const fondo = usarColorMarca ? COLOR_MARCA_COMPARTIR[item.red] : bloque.iconoColorFondo || '#374151'
          const colorIcono = usarColorMarca ? '#FFFFFF' : bloque.iconoColorIcono || '#FFFFFF'
          const estiloBoton = {
            width: tamanoBoton,
            height: tamanoBoton,
            backgroundColor: fondo,
            color: colorIcono,
            borderRadius: forma === 'circular' ? '9999px' : '8px',
          }
          const clase = 'flex shrink-0 items-center justify-center transition-opacity hover:opacity-85'
          const etiqueta = `${item.enlace ? 'Ir a' : 'Compartir en'} ${item.red}`

          // Con enlace propio, va directo ahí (ej: tu página de Facebook).
          // Sin enlace, comparte automáticamente la página actual.
          if (item.enlace) {
            return esUrlExterna(item.enlace) ? (
              <a key={i} href={item.enlace} target="_blank" rel="noopener noreferrer" aria-label={etiqueta} style={estiloBoton} className={clase}>
                <Icono size={tamanoIcono} />
              </a>
            ) : (
              <Link key={i} href={item.enlace} aria-label={etiqueta} style={estiloBoton} className={clase}>
                <Icono size={tamanoIcono} />
              </Link>
            )
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => compartir(item.red)}
              aria-label={etiqueta}
              style={estiloBoton}
              className={clase}
            >
              <Icono size={tamanoIcono} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ContenidoRenderer({ bloque }: { bloque: ContenidoPestana }) {
  switch (bloque.blockType) {
    case 'titulo':
      return (
        <h2
          className={`font-bold text-primary ${TEXTO_ALINEACION_CLASES[bloque.alineacion ?? 'izquierda']}`}
          style={{ fontSize: bloque.tamano ?? 24, color: bloque.color || undefined }}
        >
          {bloque.texto}
        </h2>
      )

    case 'subtitulo':
      return (
        <h3
          className={`font-semibold text-secondary ${TEXTO_ALINEACION_CLASES[bloque.alineacion ?? 'izquierda']}`}
          style={{ fontSize: bloque.tamano ?? 18, color: bloque.color || undefined }}
        >
          {bloque.texto}
        </h3>
      )

    case 'parrafo':
      return (
        <p
          className={`leading-relaxed whitespace-pre-line ${PARRAFO_ALINEACION_CLASES[bloque.alineacion ?? 'izquierda']} ${bloque.color ? '' : 'text-gray-700'}`}
          style={{
            fontSize: bloque.tamano ?? 16,
            fontWeight: bloque.negrita ? 700 : 400,
            color: bloque.color || undefined,
            textIndent: bloque.sangria ? `${bloque.sangria}px` : undefined,
          }}
        >
          {renderConNegritas(bloque.texto)}
        </p>
      )

    case 'vinetas':
      return (
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          {bloque.items?.map((item, i) => <li key={i}>{renderConNegritas(item.texto)}</li>)}
        </ul>
      )

    case 'boton': {
      const href = bloque.documento?.url || bloque.enlace
      if (!href) return null
      const estilo = bloque.estilo ?? 'primario'
      const redondeo = bloque.redondeo ?? 'suave'
      const estiloInline: React.CSSProperties | undefined = bloque.color
        ? estilo === 'outline'
          ? { borderColor: bloque.color, color: bloque.color, backgroundColor: 'transparent' }
          : { backgroundColor: bloque.color, color: '#FFFFFF' }
        : undefined
      return (
        <div className={`flex ${ALINEACION_CLASES[bloque.alineacion ?? 'izquierda']}`}>
          <EnlaceInteligente
            href={href}
            style={estiloInline}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors ${REDONDEO_CLASES[redondeo]} ${bloque.color ? 'hover:opacity-90' : ESTILO_BOTON[estilo]}`}
          >
            {bloque.icono && <DynamicIcon name={bloque.icono as never} className="h-4 w-4" />}
            {bloque.texto}
          </EnlaceInteligente>
        </div>
      )
    }

    case 'imagen': {
      if (!bloque.imagen?.url) return null
      const img = (
        <Image
          src={bloque.imagen.url}
          alt={bloque.imagen.alt || ''}
          width={bloque.imagen.width || 800}
          height={bloque.imagen.height || 600}
          style={{ width: ANCHO_IMAGEN[bloque.ancho ?? 'completa'], height: 'auto' }}
          className="rounded-lg"
        />
      )
      return bloque.enlace ? <EnlaceInteligente href={bloque.enlace}>{img}</EnlaceInteligente> : img
    }

    case 'enlace':
      if (!bloque.enlace) return null
      return (
        <EnlaceInteligente href={bloque.enlace} className="text-primary underline hover:text-secondary">
          {bloque.etiqueta}
        </EnlaceInteligente>
      )

    case 'enlace-imagen': {
      if (!bloque.archivo?.url) return null
      return (
        <a
          href={bloque.archivo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {bloque.imagen?.url && (
            <Image
              src={bloque.imagen.url}
              alt={bloque.imagen.alt || ''}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded object-contain"
            />
          )}
          <span
            style={{
              fontSize: bloque.tamano ?? 15,
              fontWeight: bloque.negrita ? 700 : 400,
              color: bloque.color || undefined,
            }}
            className={bloque.color ? undefined : 'text-primary'}
          >
            {bloque.texto}
          </span>
        </a>
      )
    }

    case 'tarjetas-imagen':
      return <TarjetasImagenBlock bloque={bloque} />

    case 'tarjetas-iconos':
      return <TarjetasIconosGrid bloque={bloque} />

    case 'compartir-redes':
      return <CompartirRedes bloque={bloque} />

    case 'icono-texto':
      return (
        <div className="flex items-center gap-3 text-gray-700">
          {bloque.icono && <DynamicIcon name={bloque.icono as never} className="h-5 w-5 shrink-0 text-primary" />}
          <span>{bloque.texto}</span>
        </div>
      )

    case 'galeria':
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {bloque.imagenes?.map((item, i) => {
            if (!item.imagen?.url) return null
            const img = (
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={item.imagen.url} alt={item.imagen.alt || ''} fill className="object-cover" />
              </div>
            )
            return (
              <div key={i}>
                {item.enlace ? <EnlaceInteligente href={item.enlace}>{img}</EnlaceInteligente> : img}
              </div>
            )
          })}
        </div>
      )

    case 'galeria-documentos': {
      const estiloTitulo: React.CSSProperties = {
        fontSize: bloque.tituloTamano ?? 16,
        fontWeight: (bloque.tituloNegrita ?? true) ? 700 : 400,
        color: bloque.tituloColor || undefined,
      }
      const estiloTexto: React.CSSProperties = {
        fontSize: bloque.tamano ?? 15,
        fontWeight: (bloque.negrita ?? true) ? 700 : 400,
        color: bloque.color || undefined,
      }
      const tamanoImagen = bloque.imagenTamano ?? 120
      const alineacionImagen = bloque.imagenAlineacion ?? 'centro'

      return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {bloque.elementos?.map((item, i) => {
            if (!item.imagen?.url) return null
            const href = item.archivo?.url || item.enlace
            const clase = `flex flex-col gap-2 ${ITEMS_ALINEACION_CLASES[alineacionImagen]} ${href ? 'transition-opacity hover:opacity-80' : ''}`
            const contenido = (
              <>
                {item.titulo && (
                  <span
                    style={estiloTitulo}
                    className={`${TEXTO_ALINEACION_CLASES[bloque.tituloAlineacion ?? 'centro']} ${bloque.tituloColor ? '' : 'text-primary'}`}
                  >
                    {item.titulo}
                  </span>
                )}
                <div className="relative shrink-0" style={{ width: tamanoImagen, height: tamanoImagen }}>
                  <Image src={item.imagen.url} alt={item.imagen.alt || ''} fill className="object-contain" />
                </div>
                {item.texto && (
                  <span
                    style={estiloTexto}
                    className={`${TEXTO_ALINEACION_CLASES[bloque.alineacion ?? 'centro']} ${bloque.color ? '' : 'text-primary'}`}
                  >
                    {item.texto}
                  </span>
                )}
              </>
            )
            return href ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={clase}>
                {contenido}
              </a>
            ) : (
              <div key={i} className={clase}>
                {contenido}
              </div>
            )
          })}
        </div>
      )
    }

    default:
      return null
  }
}

type EstiloTexto = {
  tamano: number
  negrita: boolean
  alineacion: 'izquierda' | 'centro' | 'derecha'
  color?: string
}

type EstiloBotonTarjeta = EstiloTexto & { icono?: string }

function TarjetaImagenCard({
  tarjeta,
  index,
  tituloEstilo,
  botonEstilo,
  onAbrirModal,
}: {
  tarjeta: TarjetaImagenItem
  index: number
  tituloEstilo: EstiloTexto
  botonEstilo: EstiloBotonTarjeta
  onAbrirModal: (index: number) => void
}) {
  const botonContenido = (
    <span
      className={`inline-flex items-center gap-1.5 transition-opacity hover:opacity-80 ${botonEstilo.color ? '' : 'text-primary'}`}
      style={{
        fontSize: botonEstilo.tamano,
        fontWeight: botonEstilo.negrita ? 700 : 400,
        color: botonEstilo.color || undefined,
      }}
    >
      {tarjeta.textoBoton || 'Ver más'}
      {botonEstilo.icono && <DynamicIcon name={botonEstilo.icono as never} className="h-4 w-4" />}
    </span>
  )

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {tarjeta.imagen?.url && (
        <div className="relative h-36 w-full">
          <Image src={tarjeta.imagen.url} alt={tarjeta.imagen.alt || ''} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <h4
          className={`mb-3 ${TEXTO_ALINEACION_CLASES[tituloEstilo.alineacion]} ${tituloEstilo.color ? '' : 'text-primary'}`}
          style={{
            fontSize: tituloEstilo.tamano,
            fontWeight: tituloEstilo.negrita ? 700 : 400,
            color: tituloEstilo.color || undefined,
          }}
        >
          {tarjeta.titulo}
        </h4>
        <div className={`flex ${ALINEACION_CLASES[botonEstilo.alineacion]}`}>
          {tarjeta.accion === 'modal' ? (
            <button type="button" onClick={() => onAbrirModal(index)}>
              {botonContenido}
            </button>
          ) : tarjeta.enlace ? (
            <EnlaceInteligente href={tarjeta.enlace}>{botonContenido}</EnlaceInteligente>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function PanelModal({
  titulo,
  imagen,
  contenido,
  onCerrar,
}: {
  titulo?: string
  imagen?: Media
  contenido?: ContenidoPestana[]
  onCerrar: () => void
}) {
  useEffect(() => {
    const alPresionarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.body.style.overflow = ''
    }
  }, [onCerrar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {imagen?.url && (
            <div className="relative h-56 w-full">
              <Image src={imagen.url} alt={imagen.alt || ''} fill className="rounded-t-xl object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          {titulo && <h2 className="text-xl font-bold text-primary">{titulo}</h2>}
          {contenido?.map((bloque, i) => <ContenidoRenderer key={i} bloque={bloque} />)}
        </div>
      </div>
    </div>
  )
}

function TarjetasImagenBlock({ bloque }: { bloque: ContenidoTarjetasImagenType }) {
  const [modalAbierto, setModalAbierto] = useState<number | null>(null)
  const tarjetas = bloque.tarjetas ?? []
  const tarjetaModal = modalAbierto !== null ? tarjetas[modalAbierto] : undefined

  const tituloEstilo: EstiloTexto = {
    tamano: bloque.tituloTamano ?? 18,
    negrita: bloque.tituloNegrita ?? true,
    alineacion: bloque.tituloAlineacion ?? 'izquierda',
    color: bloque.tituloColor,
  }
  const botonEstilo: EstiloBotonTarjeta = {
    tamano: bloque.botonTamano ?? 15,
    negrita: bloque.botonNegrita ?? true,
    alineacion: bloque.botonAlineacion ?? 'izquierda',
    color: bloque.botonColor,
    icono: bloque.botonIcono,
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {tarjetas.map((tarjeta, i) => (
          <TarjetaImagenCard
            key={i}
            tarjeta={tarjeta}
            index={i}
            tituloEstilo={tituloEstilo}
            botonEstilo={botonEstilo}
            onAbrirModal={setModalAbierto}
          />
        ))}
      </div>

      {tarjetaModal && (
        <PanelModal
          titulo={tarjetaModal.modalTitulo || tarjetaModal.titulo}
          imagen={tarjetaModal.modalImagen || tarjetaModal.imagen}
          contenido={tarjetaModal.modalContenido}
          onCerrar={() => setModalAbierto(null)}
        />
      )}
    </>
  )
}
