"use client"

import { DynamicIcon } from "lucide-react/dynamic"
import Link from "next/link"
import Image from "next/image"

interface ServiceItem {
  iconName: string
  label: string
  href: string
}

interface NewsItem {
  image: string
  title?: string
  href: string
  opacity?: ImagenDesvanecido
}

type TituloPosicion = 'izquierda' | 'centro' | 'derecha'
type ImagenDesvanecido = 'ninguno' | 'suave' | 'medio' | 'fuerte'
type ImagenAjuste = 'cubrir' | 'contener' | 'original'

const TITULO_POSICION_CLASES: Record<TituloPosicion, string> = {
  izquierda: 'text-left items-start',
  centro: 'text-center items-center',
  derecha: 'text-right items-end',
}

const IMAGEN_DESVANECIDO_CLASES: Record<ImagenDesvanecido, string> = {
  ninguno: 'opacity-100',
  suave: 'opacity-90',
  medio: 'opacity-70',
  fuerte: 'opacity-50',
}

const IMAGEN_AJUSTE_CLASES: Record<ImagenAjuste, string> = {
  cubrir: 'object-cover object-[center_40%]',
  contener: 'object-contain object-center',
  original: 'object-none object-center',
}

interface HeroSectionProps {
  imagenPrincipal?: string
  titulo?: string
  subtitulo?: string
  tituloTamano?: number
  tituloNegrita?: boolean
  tituloColor?: string
  tituloPosicion?: TituloPosicion
  subtituloColor?: string
  imagenDesvanecido?: ImagenDesvanecido
  imagenAjuste?: ImagenAjuste
  services?: ServiceItem[]
  news?: NewsItem[]
}

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link
      href={service.href}
      className="group flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:border-2 hover:border-primary hover:scale-105 border-2 border-transparent min-h-35"
    >
      <DynamicIcon
        name={service.iconName as never}
        className="h-10 w-10 text-primary transition-colors group-hover:text-secondary"
      />
      <span className="text-center text-sm font-medium text-primary">{service.label}</span>
    </Link>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={item.href}
      className="group relative block h-30 w-full overflow-hidden rounded-xl sm:w-[calc((100%-2rem)/3)]"
    >
      <Image
        src={item.image}
        alt={item.title || ''}
        fill
        className={`object-cover transition-transform duration-300 group-hover:scale-110 ${IMAGEN_DESVANECIDO_CLASES[item.opacity ?? 'ninguno']}`}
      />
      {item.title && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-end p-3">
            <span className="text-sm font-semibold text-white drop-shadow-md">{item.title}</span>
          </div>
        </>
      )}
    </Link>
  )
}

export default function HeroSection({
  imagenPrincipal,
  titulo,
  subtitulo,
  tituloTamano = 48,
  tituloNegrita = true,
  tituloColor,
  tituloPosicion = 'izquierda',
  subtituloColor,
  imagenDesvanecido = 'suave',
  imagenAjuste = 'cubrir',
  services = [],
  news = [],
}: HeroSectionProps) {
  const hasContent = titulo || subtitulo || services.length > 0 || news.length > 0 || imagenPrincipal

  if (!hasContent) return null

  return (
    <section className="relative min-h-175 w-full overflow-hidden bg-linear-to-br from-[#e8f0fe] to-[#dce8ff]">

      {imagenPrincipal && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imagenPrincipal}
            alt="Imagen principal"
            fill
            className={`${IMAGEN_AJUSTE_CLASES[imagenAjuste]} ${IMAGEN_DESVANECIDO_CLASES[imagenDesvanecido]}`}
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#dce8ff]/15 via-[#dce8ff]/10 to-transparent" />
        </div>
      )}

      <div className="relative z-10 container mx-auto grid min-h-175 grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-12 lg:gap-12">

        <div className="hidden lg:block lg:col-span-5" />

        <div className="flex flex-col justify-center lg:col-span-7">
          {(titulo || subtitulo) && (
            <div className={`mb-8 flex flex-col ${TITULO_POSICION_CLASES[tituloPosicion]}`}>
              {titulo && (
                <h1
                  className={`mb-2 ${tituloColor ? '' : 'text-primary'} ${tituloNegrita ? 'font-bold' : 'font-normal'}`}
                  style={{ fontSize: `${tituloTamano}px`, color: tituloColor || undefined }}
                >
                  {titulo}
                </h1>
              )}
              {subtitulo && (
                <p
                  className={`text-xl lg:text-2xl ${subtituloColor ? '' : 'text-secondary'}`}
                  style={{ color: subtituloColor || undefined }}
                >
                  {subtitulo}
                </p>
              )}
            </div>
          )}

          {services.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          )}

          {news.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {news.map((item, index) => (
                <NewsCard key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
