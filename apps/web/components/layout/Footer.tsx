import type { Tenant, FooterBlock, FooterColumn, FooterSeccion, ImagenSliderItem } from '@/lib/types'
import { Globe } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import OverflowSlider from '@/components/ui/OverflowSlider'
import {
  FacebookIcon,
  XIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  WhatsappIcon,
  TiktokIcon,
} from '@/components/icons/SocialIcons'

const ICONOS_REDES = {
  facebook: FacebookIcon,
  x: XIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  tiktok: TiktokIcon,
}

function esUrlExterna(enlace: string) {
  return /^https?:\/\//.test(enlace) || enlace.startsWith('tel:') || enlace.startsWith('mailto:')
}

// Cada sección elige si su fondo es claro u oscuro, así que los textos y
// bordes genéricos (no las tarjetas propias, que ya traen su propio fondo
// blanco) cambian de paleta para seguir siendo legibles en cualquier caso.
// Tailwind necesita ver cada clase completa como texto literal en el código
// para generarla — por eso cada variante trae sus clases ya armadas (nada
// de concatenar "hover:" + una variable en tiempo de ejecución).
type TemaTexto = {
  texto: string
  textoFuerte: string
  textoHover: string
  borde: string
  divide: string
  chipBg: string
  chipHoverBg: string
  chipHoverTexto: string
}

const TEMA: Record<'claro' | 'oscuro', TemaTexto> = {
  // Texto claro (blanco) — para fondos oscuros/de color, como la banda azul institucional.
  claro: {
    texto: 'text-white/80',
    textoFuerte: 'text-white',
    textoHover: 'hover:text-white',
    borde: 'border-white/20',
    divide: 'divide-white/20',
    chipBg: 'bg-white/10',
    chipHoverBg: 'hover:bg-white/20',
    chipHoverTexto: 'hover:text-white',
  },
  // Texto oscuro — para fondos claros, como una banda blanca de logos.
  oscuro: {
    texto: 'text-gray-600',
    textoFuerte: 'text-gray-900',
    textoHover: 'hover:text-gray-900',
    borde: 'border-gray-200',
    divide: 'divide-gray-300',
    chipBg: 'bg-gray-100',
    chipHoverBg: 'hover:bg-gray-200',
    chipHoverTexto: 'hover:text-gray-900',
  },
}

// Soporta **negrita** dentro de un bloque de texto sin exponer HTML crudo
// (ej: "**Sede Principal:** Calle 4 # 7-37 B/ Centro, Popayán").
function renderTextoConNegritas(texto: string, tema: TemaTexto) {
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return partes.map((parte, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={`font-bold ${tema.textoFuerte}`}>
        {parte}
      </strong>
    ) : (
      parte
    ),
  )
}

function EnlaceFooter({ etiqueta, enlace, tema }: { etiqueta: string; enlace: string; tema: TemaTexto }) {
  const clase = `${tema.texto} ${tema.textoHover} transition-colors`
  return esUrlExterna(enlace) ? (
    <a href={enlace} target="_blank" rel="noopener noreferrer" className={clase}>
      {etiqueta}
    </a>
  ) : (
    <Link href={enlace} className={clase}>
      {etiqueta}
    </Link>
  )
}

const ALINEACION_CARD: Record<'izquierda' | 'centro' | 'derecha', string> = {
  izquierda: 'items-start text-left',
  centro: 'items-center text-center',
  derecha: 'items-end text-right',
}

interface AccesoRapidoCardProps {
  icono?: string
  titulo?: string
  enlace?: string
  orientacionContenido: 'vertical' | 'horizontal'
  alineacion: 'izquierda' | 'centro' | 'derecha'
  tamanoCard: number
  iconoTamano: number
  textoTamano: number
  textoNegrita: boolean
  textoColor?: string
}

function AccesoRapidoCard({
  icono,
  titulo,
  enlace,
  orientacionContenido,
  alineacion,
  tamanoCard,
  iconoTamano,
  textoTamano,
  textoNegrita,
  textoColor,
}: AccesoRapidoCardProps) {
  if (!icono || !titulo || !enlace) return null
  const contenido = (
    <>
      <DynamicIcon name={icono as never} style={{ width: iconoTamano, height: iconoTamano }} className="shrink-0 text-primary" />
      <span
        style={{ fontSize: textoTamano, color: textoColor || undefined }}
        className={`${textoNegrita ? 'font-semibold' : 'font-normal'} ${textoColor ? '' : 'text-primary'}`}
      >
        {titulo}
      </span>
    </>
  )
  const clase = `flex shrink-0 gap-2 rounded-xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${
    orientacionContenido === 'vertical' ? 'flex-col' : 'flex-row'
  } ${ALINEACION_CARD[alineacion]}`
  const estilo = { width: tamanoCard }
  return esUrlExterna(enlace) ? (
    <a href={enlace} target="_blank" rel="noopener noreferrer" className={clase} style={estilo}>
      {contenido}
    </a>
  ) : (
    <Link href={enlace} className={clase} style={estilo}>
      {contenido}
    </Link>
  )
}

function ImagenSliderItemCard({
  item,
}: {
  item: ImagenSliderItem
}) {
  if (!item.imagen?.url) return null
  const ancho = item.ancho || 90
  const alto = item.alto || 60
  const img = (
    <Image
      src={item.imagen.url}
      alt={item.imagen.alt || ''}
      width={ancho}
      height={alto}
      style={{ width: ancho, height: alto }}
      className="shrink-0 object-contain"
    />
  )
  if (!item.enlace) return img
  return esUrlExterna(item.enlace) ? (
    <a href={item.enlace} target="_blank" rel="noopener noreferrer" className="shrink-0">
      {img}
    </a>
  ) : (
    <Link href={item.enlace} className="shrink-0">
      {img}
    </Link>
  )
}

// El renderer no sabe qué es una "dirección" o un "PQRS" — solo sabe dibujar
// estos tipos de bloque genéricos. El significado lo decide quien arma el
// layout en el CMS combinándolos dentro de una celda.
function FooterBlockRenderer({ block, tema }: { block: FooterBlock; tema: TemaTexto }) {
  switch (block.blockType) {
    case 'texto':
      return (
        <p className={`text-sm leading-relaxed ${tema.texto}`}>
          {renderTextoConNegritas(block.contenido, tema)}
        </p>
      )

    case 'titulo':
      return (
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${tema.textoFuerte}`}>
          {block.contenido}
        </h3>
      )

    case 'imagen': {
      const img = block.imagen?.url ? (
        <Image
          src={block.imagen.url}
          alt={block.imagen.alt || ''}
          width={block.ancho || 64}
          height={block.alto || 40}
          style={{ width: block.ancho || 64, height: block.alto || 40 }}
          className="object-contain"
        />
      ) : null
      return block.enlace ? (
        <a href={block.enlace} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )
    }

    case 'enlace':
      return (
        <div className="text-sm">
          <EnlaceFooter etiqueta={block.etiqueta} enlace={block.enlace} tema={tema} />
        </div>
      )

    case 'lista-enlaces':
      return (
        <div>
          {block.subtitulo && (
            <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${tema.texto}`}>
              {block.subtitulo}
            </h4>
          )}
          <ul className="space-y-2 text-sm">
            {block.enlaces?.map((link) => (
              <li key={link.enlace}>
                <EnlaceFooter etiqueta={link.etiqueta} enlace={link.enlace} tema={tema} />
              </li>
            ))}
          </ul>
        </div>
      )

    case 'logos':
      return (
        <div className="flex flex-wrap items-center gap-3">
          {block.logos?.map((item, i) => {
            const img = item.imagen?.url ? (
              <Image
                key={i}
                src={item.imagen.url}
                alt={item.imagen.alt || 'Certificación'}
                width={item.ancho || 64}
                height={item.alto || 40}
                style={{ width: item.ancho || 64, height: item.alto || 40 }}
                className="rounded bg-white/90 object-contain p-1"
              />
            ) : null
            return item.enlace ? (
              <a key={i} href={item.enlace} target="_blank" rel="noopener noreferrer">
                {img}
              </a>
            ) : (
              img
            )
          })}
        </div>
      )

    case 'redes-sociales':
      return (
        <div className="flex gap-3">
          {block.redes?.map((red) => {
            const Icono = ICONOS_REDES[red.red] ?? Globe
            return (
              <a
                key={red.red}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.red}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${tema.chipBg} ${tema.texto} transition-colors ${tema.chipHoverBg} ${tema.chipHoverTexto}`}
              >
                <Icono size={16} />
              </a>
            )
          })}
        </div>
      )

    case 'separador':
      return <hr className={`my-2 ${tema.borde}`} />

    case 'espaciador':
      return <div style={{ height: block.alto ?? 16 }} />

    case 'html':
      // Bloque avanzado, exclusivo de Super Administrador en el CMS —
      // confiamos en ese límite de acceso para permitir HTML crudo aquí,
      // pero el HTML pegado no siempre viene pensado para verse bien en un
      // teléfono (anchos/altos fijos, "white-space: nowrap"...). La clase
      // "footer-html" (globals.css) neutraliza eso para que igual envuelva
      // y se achique; si algo de verdad no cabe (ej. una tabla ancha),
      // scrollea dentro de su propio bloque en vez de romper la página.
      return (
        <div
          className="footer-html w-full min-w-0"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: block.contenido }}
        />
      )

    case 'accesos-rapidos': {
      const orientacionContenido = block.orientacionContenido ?? 'vertical'
      const alineacion = block.alineacion ?? 'centro'
      const tamanoCard = block.tamanoCard ?? 140
      const iconoTamano = block.iconoTamano ?? 24
      const textoTamano = block.textoTamano ?? 13
      const textoNegrita = block.textoNegrita ?? true
      return (
        <OverflowSlider
          direccion="horizontal"
          modo={block.modoDesplazamiento ?? 'botones'}
          velocidad={block.velocidadAutomatico ?? 3}
          espacio={block.espacio ?? 16}
          className="w-full py-1"
        >
          {block.accesos?.map((item, i) => (
            <AccesoRapidoCard
              key={i}
              icono={item.icono}
              titulo={item.titulo}
              enlace={item.enlace}
              orientacionContenido={orientacionContenido}
              alineacion={alineacion}
              tamanoCard={tamanoCard}
              iconoTamano={iconoTamano}
              textoTamano={textoTamano}
              textoNegrita={textoNegrita}
              textoColor={block.textoColor}
            />
          ))}
        </OverflowSlider>
      )
    }

    case 'imagenes-slider': {
      const direccion = block.direccion ?? 'horizontal'
      return (
        <div
          className="w-full rounded-lg py-3"
          style={{ backgroundColor: block.colorLienzo || '#FFFFFF', maxHeight: direccion === 'vertical' ? 320 : undefined }}
        >
          <OverflowSlider
            direccion={direccion}
            modo={block.modoDesplazamiento ?? 'automatico'}
            velocidad={block.velocidadAutomatico ?? 3}
            espacio={block.espacio ?? 32}
            className="px-4"
          >
            {block.imagenes?.map((item, i) => (
              <ImagenSliderItemCard key={i} item={item} />
            ))}
          </OverflowSlider>
        </div>
      )
    }

    default:
      return null
  }
}

const ALINEACION_TEXTO: Record<NonNullable<FooterColumn['align']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const ALINEACION_VERTICAL: Record<NonNullable<FooterColumn['verticalAlign']>, string> = {
  top: 'self-start',
  center: 'self-center',
  bottom: 'self-end',
}

// Ancho con nombre → columnas que ocupa en una grilla interna de 12. El
// editor del CMS nunca ve estos números: solo elige Pequeña/Mediana/Grande/
// Completa y la grilla acomoda cada columna sola, pasando de línea cuando
// no cabe (comportamiento nativo de CSS Grid con grid-auto-flow: row).
const ANCHO_A_SPAN: Record<NonNullable<FooterColumn['ancho']>, number> = {
  pequena: 3,
  mediana: 4,
  grande: 6,
  completa: 12,
}

// Bloques cuyo contenido interno necesita el ancho real de la columna para
// funcionar (envolver logos, o medir cuánto se desborda un slider). Con
// items-start/center/end (alineación por defecto de la columna) un hijo de
// flex-col se dimensiona a su propio contenido en vez de estirarse — por
// eso estos bloques fuerzan su propio ancho con self-stretch, sin afectar
// la alineación del resto (textos, botones, redes) que sí deben quedar
// solo tan anchos como su contenido.
const BLOQUES_ANCHO_COMPLETO = new Set(['logos', 'accesos-rapidos', 'imagenes-slider'])

function FooterColumnRenderer({ column, tema }: { column: FooterColumn; tema: TemaTexto }) {
  const span = ANCHO_A_SPAN[column.ancho || 'mediana']
  return (
    <div
      className={`footer-col min-w-0 w-full flex gap-3 ${column.direccionContenido === 'fila' ? `flex-row flex-wrap items-center divide-x ${tema.divide}` : 'flex-col'} ${ALINEACION_TEXTO[column.align || 'left']} ${ALINEACION_VERTICAL[column.verticalAlign || 'top']}`}
      style={{ '--fc-span': span } as React.CSSProperties}
    >
      {column.children?.map((block, i) => (
        <div
          key={i}
          className={`min-w-0 ${BLOQUES_ANCHO_COMPLETO.has(block.blockType) ? 'w-full self-stretch' : ''} ${column.direccionContenido === 'fila' ? 'pl-3 first:pl-0' : ''}`}
        >
          <FooterBlockRenderer block={block} tema={tema} />
        </div>
      ))}
    </div>
  )
}

function FooterSeccionRenderer({ seccion, anchoMaximo }: { seccion: FooterSeccion; anchoMaximo: string }) {
  const columnas = seccion.columnas ?? []
  if (columnas.length === 0) return null
  const tema = TEMA[seccion.textoOscuro ? 'oscuro' : 'claro']

  return (
    <div style={{ backgroundColor: seccion.colorFondo || '#0378B3' }}>
      <div className="mx-auto px-4 py-8" style={{ maxWidth: anchoMaximo }}>
        <div className="grid grid-cols-12 gap-x-8 gap-y-6">
          {columnas.map((column) => (
            <FooterColumnRenderer key={column.id} column={column} tema={tema} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Motor de renderizado genérico: Footer → Secciones → Columnas → Bloques.
// Cada sección es una banda apilable con su propio color; dentro, las
// columnas se acomodan solas sobre una grilla de 12 — el mismo componente
// sirve para cualquier tenant y cualquier combinación de bandas.
export default function Footer({ tenant }: { tenant?: Tenant }) {
  const year = new Date().getFullYear()
  const footer = tenant?.footer
  const secciones = footer?.secciones ?? []
  const anchoMaximo = footer?.anchoMaximo || '1100px'

  if (secciones.length === 0) {
    return (
      <footer style={{ backgroundColor: '#0378B3' }}>
        <div className="mx-auto px-4 py-12" style={{ maxWidth: anchoMaximo }}>
          <p className="text-center text-sm text-white/60">
            © {year} {tenant?.nombre ?? 'Portal Institucional'}
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer>
      {secciones.map((seccion, i) => (
        <FooterSeccionRenderer key={seccion.id ?? i} seccion={seccion} anchoMaximo={anchoMaximo} />
      ))}
    </footer>
  )
}
