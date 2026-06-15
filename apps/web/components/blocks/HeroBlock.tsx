import type { HeroBlockType } from '@/lib/types'
import HeroSection from '@/components/blocks/HeroSection'

export default function HeroBlock({
  titulo,
  subtitulo,
  imagenPrincipal,
  servicios,
  banners,
}: HeroBlockType) {
  const serviciosMapeados = servicios
    ?.filter((s): s is Required<typeof s> => Boolean(s.icono && s.label && s.href))
    .map((s) => ({
      iconName: s.icono,
      label: s.label,
      href: s.href,
    })) ?? []

  const bannersMapeados = banners
    ?.filter((b): b is Required<typeof b> => Boolean(b.imagen?.url && b.titulo && b.href))
    .map((b) => ({
      image: b.imagen.url,
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
