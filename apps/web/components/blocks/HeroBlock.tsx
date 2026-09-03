import type { HeroBlockType } from '@/lib/types'
import HeroSection from '@/components/blocks/HeroSection'

export default function HeroBlock({
  titulo,
  subtitulo,
  tituloTamano,
  tituloNegrita,
  tituloColor,
  tituloPosicion,
  subtituloColor,
  imagenPrincipal,
  imagenDesvanecido,
  imagenAjuste,
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
    ?.filter((b) => Boolean(b.imagen?.url && b.href))
    .map((b) => ({
      image: b.imagen!.url!,
      title: b.titulo,
      href: b.href!,
      opacity: b.opacidad,
    })) ?? []

  return (
    <HeroSection
      imagenPrincipal={imagenPrincipal?.url}
      titulo={titulo}
      subtitulo={subtitulo}
      tituloTamano={tituloTamano}
      tituloNegrita={tituloNegrita}
      tituloColor={tituloColor}
      tituloPosicion={tituloPosicion}
      subtituloColor={subtituloColor}
      imagenDesvanecido={imagenDesvanecido}
      imagenAjuste={imagenAjuste}
      services={serviciosMapeados}
      news={bannersMapeados}
    />
  )
}
