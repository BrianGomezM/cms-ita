'use client'

import type { ContenidoPestana, ContenidoTarjetasImagenType, Media, MenuConContenidoBlockType, TarjetaImagenItem } from '@/lib/types'
import { DynamicIcon } from 'lucide-react/dynamic'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function esUrlExterna(enlace: string) {
  return /^https?:\/\//.test(enlace) || enlace.startsWith('tel:') || enlace.startsWith('mailto:')
}

type TextoPosicion = 'izquierda' | 'centro' | 'derecha'
type ImagenDesvanecido = 'ninguno' | 'suave' | 'medio' | 'fuerte'
type ImagenAjuste = 'cubrir' | 'contener' | 'original'

const TEXTO_POSICION_CLASES: Record<TextoPosicion, string> = {
  izquierda: 'justify-start text-left',
  centro: 'justify-center text-center',
  derecha: 'justify-end text-right',
}

const IMAGEN_DESVANECIDO_CLASES: Record<ImagenDesvanecido, string> = {
  ninguno: 'opacity-100',
  suave: 'opacity-90',
  medio: 'opacity-70',
  fuerte: 'opacity-50',
}

const IMAGEN_AJUSTE_CLASES: Record<ImagenAjuste, string> = {
  cubrir: 'object-cover',
  contener: 'object-contain',
  original: 'object-none',
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

// Soporta **negrita** dentro de un párrafo sin exponer HTML crudo.
function renderConNegritas(texto: string) {
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

const ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'justify-start',
  centro: 'justify-center',
  derecha: 'justify-end',
}

const TEXTO_ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'text-left',
  centro: 'text-center',
  derecha: 'text-right',
}

const ITEMS_ALINEACION_CLASES: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'items-start',
  centro: 'items-center',
  derecha: 'items-end',
}

function ContenidoRenderer({ bloque }: { bloque: ContenidoPestana }) {
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
      return <p className="leading-relaxed whitespace-pre-line text-gray-700">{renderConNegritas(bloque.texto)}</p>

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

    case 'icono-texto':
      return (
        <div className="flex items-center gap-3 text-gray-700">
          <DynamicIcon name={bloque.icono as never} className="h-5 w-5 shrink-0 text-primary" />
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

export default function MenuConContenidoBlock({
  textoTamano = 32,
  textoNegrita = true,
  textoColor,
  textoPosicion = 'izquierda',
  imagenDesvanecido = 'suave',
  imagenAjuste = 'cubrir',
  items,
}: MenuConContenidoBlockType) {
  const [activo, setActivo] = useState(0)
  if (!items?.length) return null
  const pestanaActiva = items[activo] ?? items[0]
  const bannerTexto = pestanaActiva.bannerTexto || pestanaActiva.etiqueta

  return (
    <>
      {(pestanaActiva.bannerImagen?.url || bannerTexto) && (
        <section className="relative min-h-45 w-full overflow-hidden bg-primary">
          {pestanaActiva.bannerImagen?.url && (
            <div className="absolute inset-0">
              <Image
                src={pestanaActiva.bannerImagen.url}
                alt=""
                fill
                className={`${IMAGEN_AJUSTE_CLASES[imagenAjuste]} ${IMAGEN_DESVANECIDO_CLASES[imagenDesvanecido]}`}
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
            </div>
          )}
          <div
            className={`relative z-10 mx-auto flex min-h-45 max-w-6xl items-end px-4 py-6 ${TEXTO_POSICION_CLASES[textoPosicion]}`}
          >
            <h2
              style={{
                fontSize: textoTamano,
                color: textoColor || '#FFFFFF',
                fontWeight: textoNegrita ? 700 : 400,
              }}
            >
              {bannerTexto}
            </h2>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          <nav className="h-fit overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {items.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                onClick={() => setActivo(i)}
                className={`block w-full border-b border-gray-100 px-4 py-3 text-left text-sm transition-colors last:border-b-0 ${
                  i === activo ? 'bg-primary font-semibold text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.etiqueta}
              </button>
            ))}
          </nav>

          <div className="min-w-0 space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            {pestanaActiva.contenido?.map((bloque, i) => <ContenidoRenderer key={i} bloque={bloque} />)}
          </div>
        </div>
      </section>
    </>
  )
}
