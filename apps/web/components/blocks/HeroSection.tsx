"use client"

import {
  RefreshCw, Monitor, Download, Lightbulb,
  User, Megaphone, Search, Award,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const ICON_MAP: Record<string, LucideIcon> = {
  RefreshCw, Monitor, Download, Lightbulb,
  User, Megaphone, Search, Award,
}

interface ServiceItem {
  iconName: string
  label: string
  href: string
}

interface NewsItem {
  image: string
  title: string
  href: string
}

interface HeroSectionProps {
  imagenPrincipal?: string
  titulo?: string
  subtitulo?: string
  services?: ServiceItem[]
  news?: NewsItem[]
}

const defaultServices: ServiceItem[] = [
  { iconName: "RefreshCw", label: "Renuévate aquí", href: "/renovacion" },
  { iconName: "Monitor", label: "Trámites Virtuales de los Registros", href: "/tramites" },
  { iconName: "Download", label: "Certificados", href: "/certificados" },
  { iconName: "Lightbulb", label: "Programa Ingenia", href: "/ingenia" },
  { iconName: "User", label: "Servicios", href: "/servicios" },
  { iconName: "Megaphone", label: "Convocatorias", href: "/convocatorias" },
  { iconName: "Search", label: "Matricúlate", href: "/matricula" },
  { iconName: "Award", label: "Aliado Plus", href: "/aliado-plus" },
]

const defaultNews: NewsItem[] = [
  { image: "/img-project/Capacitaciones.jpg", title: "Capacitaciones y eventos", href: "/noticias" },
  { image: "/img-project/Empresarios.jpg", title: "Conoce tus Beneficios y Renueva", href: "/noticias" },
  { image: "/img-project/Noticias.jpg", title: "Noticias", href: "/noticias" },
]

function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = ICON_MAP[service.iconName] ?? User
  return (
    <Link
      href={service.href}
      className="group flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:border-2 hover:border-primary hover:scale-105 border-2 border-transparent min-h-35"
    >
      <Icon className="h-10 w-10 text-primary transition-colors group-hover:text-secondary" />
      <span className="text-center text-sm font-medium text-primary">{service.label}</span>
    </Link>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href} className="group relative block h-30 overflow-hidden rounded-xl">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-primary/70 transition-colors group-hover:bg-primary/80" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span className="text-center text-sm font-semibold text-white">{item.title}</span>
      </div>
    </Link>
  )
}

export default function HeroSection({
  imagenPrincipal = "/img-project/Empresarios.jpg",
  titulo = "¡Bienvenido!",
  subtitulo = "¿Qué trámite deseas realizar?",
  services = defaultServices,
  news = defaultNews,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-175 w-full overflow-hidden bg-linear-to-br from-[#e8f0fe] to-[#dce8ff]">

      {/* ── Imagen de fondo absoluta — cubre todo el hero ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imagenPrincipal}
          alt="Imagen principal"
          fill
          className="object-cover object-[center_40%] opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#dce8ff]/15 via-[#dce8ff]/10 to-transparent" />
      </div>

      {/* ── Contenido encima de la imagen ── */}
      <div className="relative z-10 container mx-auto grid min-h-175 grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-12 lg:gap-12">

        {/* Columna izquierda — vacía en desktop, empuja el contenido a la derecha */}
        <div className="hidden lg:block lg:col-span-5" />

        {/* Columna derecha — texto, tarjetas y noticias */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-primary lg:text-5xl">{titulo}</h1>
            <p className="text-xl text-secondary lg:text-2xl">{subtitulo}</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {news.map((item, index) => (
              <NewsCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}