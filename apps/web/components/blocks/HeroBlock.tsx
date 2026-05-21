import type { HeroBlockType } from '@/lib/types'
import HeroSection from '@/components/blocks/HeroSection'

export default function HeroBlock({
  titulo,
  subtitulo,
  imagenPrincipal,
  servicios,
  banners,
}: HeroBlockType) {
  const serviciosMapeados = servicios?.map((s) => ({
    iconName: s.icono,
    label: s.label,
    href: s.href,
  })) ?? []

  const bannersMapeados = banners?.map((b) => ({
    image: typeof b.imagen === 'object' ? (b.imagen?.url ?? '') : '',
    title: b.titulo,
    href: b.href,
  })) ?? []

  return (
    <HeroSection
      imagenPrincipal={imagenPrincipal?.url}
      titulo={titulo}
      subtitulo={subtitulo}
      services={serviciosMapeados}
      news={bannersMapeados}
    />
  )
}
