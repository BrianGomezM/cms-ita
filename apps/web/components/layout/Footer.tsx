import type { Tenant, FooterBlock, FooterColumn } from '@/lib/types'
import { Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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

// Soporta **negrita** dentro de un bloque de texto sin exponer HTML crudo
// (ej: "**Sede Principal:** Calle 4 # 7-37 B/ Centro, Popayán").
function renderTextoConNegritas(texto: string) {
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return partes.map((parte, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {parte}
      </strong>
    ) : (
      parte
    ),
  )
}

function EnlaceFooter({ etiqueta, enlace }: { etiqueta: string; enlace: string }) {
  const clase = 'text-white/80 hover:text-white transition-colors'
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

// El renderer no sabe qué es una "dirección" o un "PQRS" — solo sabe dibujar
// estos 10 tipos de bloque genéricos. El significado lo decide quien arma el
// layout en el CMS combinándolos dentro de una celda.
function FooterBlockRenderer({ block }: { block: FooterBlock }) {
  switch (block.blockType) {
    case 'texto':
      return (
        <p className="text-sm leading-relaxed text-white/80">
          {renderTextoConNegritas(block.contenido)}
        </p>
      )

    case 'titulo':
      return (
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{block.contenido}</h3>
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
          <EnlaceFooter etiqueta={block.etiqueta} enlace={block.enlace} />
        </div>
      )

    case 'lista-enlaces':
      return (
        <div>
          {block.subtitulo && (
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
              {block.subtitulo}
            </h4>
          )}
          <ul className="space-y-2 text-sm">
            {block.enlaces?.map((link) => (
              <li key={link.enlace}>
                <EnlaceFooter etiqueta={link.etiqueta} enlace={link.enlace} />
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
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Icono size={16} />
              </a>
            )
          })}
        </div>
      )

    case 'separador':
      return <hr className="my-2 border-white/20" />

    case 'espaciador':
      return <div style={{ height: block.alto ?? 16 }} />

    case 'html':
      // Bloque avanzado, exclusivo de Super Administrador en el CMS —
      // confiamos en ese límite de acceso para permitir HTML crudo aquí.
      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: block.contenido }} />

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

function FooterColumnRenderer({ column }: { column: FooterColumn }) {
  const span = ANCHO_A_SPAN[column.ancho || 'mediana']
  return (
    <div
      className={`flex gap-3 ${column.direccionContenido === 'fila' ? 'flex-row flex-wrap items-center divide-x divide-white/20' : 'flex-col'} ${ALINEACION_TEXTO[column.align || 'left']} ${ALINEACION_VERTICAL[column.verticalAlign || 'top']}`}
      style={{ gridColumn: `span ${span}` }}
    >
      {column.children?.map((block, i) => (
        <div key={i} className={column.direccionContenido === 'fila' ? 'pl-3 first:pl-0' : undefined}>
          <FooterBlockRenderer block={block} />
        </div>
      ))}
    </div>
  )
}

// Motor de renderizado genérico: Footer → Columnas → Bloques. Las columnas
// se acomodan solas sobre una grilla de 12 (sin que el editor del CMS tenga
// que pensar en filas) — el mismo componente sirve para cualquier tenant.
export default function Footer({ tenant }: { tenant?: Tenant }) {
  const year = new Date().getFullYear()
  const footer = tenant?.footer
  const columnas = footer?.layout?.columnas ?? []

  return (
    <footer style={{ backgroundColor: footer?.colorFondo || '#0378B3' }}>
      <div
        className="mx-auto px-4 py-12"
        style={{ maxWidth: footer?.anchoMaximo || '1100px' }}
      >
        {columnas.length > 0 ? (
          <div className="grid grid-cols-12 gap-x-8 gap-y-6">
            {columnas.map((column) => (
              <FooterColumnRenderer key={column.id} column={column} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-white/60">
            © {year} {tenant?.nombre ?? 'Portal Institucional'}
          </p>
        )}
      </div>
    </footer>
  )
}
