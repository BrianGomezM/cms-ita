import type { HeroBlockType } from '@/lib/types'
import HeroSection from '@/components/blocks/HeroSection'

const SERVICIOS_DEFAULT = [
  { iconName: 'RefreshCw',  label: 'Renuévate aquí',                      href: '/renovacion'    },
  { iconName: 'Monitor',    label: 'Trámites Virtuales de los Registros',  href: '/tramites'      },
  { iconName: 'Download',   label: 'Certificados',                         href: '/certificados'  },
  { iconName: 'Lightbulb',  label: 'Programa Ingenia',                     href: '/ingenia'       },
  { iconName: 'User',       label: 'Servicios',                            href: '/servicios'     },
  { iconName: 'Megaphone',  label: 'Convocatorias',                        href: '/convocatorias' },
  { iconName: 'Search',     label: 'Matricúlate',                          href: '/matricula'     },
  { iconName: 'Award',      label: 'Aliado Plus',                          href: '/aliado-plus'   },
]

const BANNERS_DEFAULT = [
  { image: '/img-project/Capacitaciones.jpg', title: 'Capacitaciones y eventos',         href: '/noticias' },
  { image: '/img-project/Empresarios.jpg',    title: 'Conoce tus Beneficios al Renovar', href: '/noticias' },
  { image: '/img-project/Noticias.jpg',       title: 'Noticias',                          href: '/noticias' },
]

export default function HeroBlock({
  titulo,
  subtitulo,
  imagenPrincipal,
  servicios,
  banners,
}: HeroBlockType) {

  // Si el CMS tiene servicios configurados los usa, si no, los defaults
  const serviciosMapeados = servicios?.length
    ? servicios.map((s) => ({
        iconName: s.icono,
        label: s.label,
        href: s.href,
      }))
    : SERVICIOS_DEFAULT

  // Si el CMS tiene banners configurados los usa, si no, los defaults
  const bannersMapeados = banners?.length
    ? banners.map((b) => ({
        image: typeof b.imagen === 'object' ? (b.imagen?.url ?? '') : '',
        title: b.titulo,
        href: b.href,
      }))
    : BANNERS_DEFAULT

  return (
    <HeroSection
      imagenPrincipal={imagenPrincipal?.url ?? '/img-project/Empresarios.jpg'}
      titulo={titulo}
      subtitulo={subtitulo}
      services={serviciosMapeados}
      news={bannersMapeados}
    />
  )
}