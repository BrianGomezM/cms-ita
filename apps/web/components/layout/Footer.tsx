import type { Tenant } from '@/lib/types'
import {
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  ExternalLink,
  Clock,
  Globe,
} from 'lucide-react'
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

export default function Footer({ tenant }: { tenant?: Tenant }) {
  const year = new Date().getFullYear()
  const footer = tenant?.footer
  const enlacesLegales = footer?.enlacesLegales?.length
    ? footer.enlacesLegales
    : [
        { etiqueta: 'Política de privacidad', enlace: '/politicas' },
        { etiqueta: 'Términos de uso', enlace: '/terminos' },
      ]

  return (
    <footer className="bg-[#001a33] text-gray-300">
      {/* Franja dorada superior */}
      <div className="h-1 bg-[#e8a020]" />

      {/* Contenido principal */}
      <div className="container-institucional py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Col 1 — Entidad */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#0066cc] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                CC
              </div>
              <div>
                <div className="font-bold text-white text-sm leading-tight">
                  {tenant?.nombre ?? 'Portal Institucional'}
                </div>
                <div className="text-xs text-gray-400">Entidad pública</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Impulsamos el desarrollo empresarial del Cauca, promoviendo la competitividad y la transparencia.
            </p>
            {/* Redes sociales */}
            {!!footer?.redesSociales?.length && (
              <div className="flex gap-3">
                {footer.redesSociales.map((red) => {
                  const Icono = ICONOS_REDES[red.red] ?? Globe
                  return (
                    <a
                      key={red.red}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={red.red}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:bg-[#0066cc] hover:text-white transition-colors"
                    >
                      <Icono size={16} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Col 2 — Servicios */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Registro Mercantil', href: '/registro-mercantil' },
                { label: 'Certificados', href: '/certificados' },
                { label: 'Formación Empresarial', href: '/formacion' },
                { label: 'Trámites en línea', href: '/tramites' },
                { label: 'Contratación', href: '/contratacion' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <span className="text-[#e8a020]">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Transparencia */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Transparencia
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Información de la entidad', href: '/nosotros' },
                { label: 'Normativa', href: '/normativa' },
                { label: 'Planeación', href: '/planeacion' },
                { label: 'Datos abiertos', href: '/datos-abiertos' },
                { label: 'Participa', href: '/participa' },
                { label: 'Mapa del sitio', href: '/mapa-sitio' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <span className="text-[#e8a020]">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              {footer?.telefonoConmutador && (
                <li className="flex items-start gap-2 text-gray-400">
                  <Phone size={14} className="mt-0.5 text-[#e8a020] shrink-0" />
                  <span>Conmutador: {footer.telefonoConmutador}</span>
                </li>
              )}
              {footer?.lineaGratuita && (
                <li className="flex items-start gap-2 text-gray-400">
                  <Phone size={14} className="mt-0.5 text-[#e8a020] shrink-0" />
                  <span>Línea gratuita: {footer.lineaGratuita}</span>
                </li>
              )}
              {footer?.correoNotificaciones && (
                <li className="flex items-start gap-2 text-gray-400">
                  <Mail size={14} className="mt-0.5 text-[#e8a020] shrink-0" />
                  <span>{footer.correoNotificaciones}</span>
                </li>
              )}
              {footer?.direccion && (
                <li className="flex items-start gap-2 text-gray-400">
                  <MapPin size={14} className="mt-0.5 text-[#e8a020] shrink-0" />
                  <span>{footer.direccion}</span>
                </li>
              )}
              {footer?.horarioAtencion && (
                <li className="flex items-start gap-2 text-gray-400">
                  <Clock size={14} className="mt-0.5 text-[#e8a020] shrink-0" />
                  <span>{footer.horarioAtencion}</span>
                </li>
              )}
              {footer?.lineaAnticorrupcion && (
                <li className="flex items-start gap-2 text-red-400">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>Anticorrupción: <strong className="text-red-300">{footer.lineaAnticorrupcion}</strong></span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <div className="container-institucional py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© {year} {tenant?.nombre ?? 'Portal Institucional'}. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            {enlacesLegales.map((link) => (
              <Link key={link.enlace} href={link.enlace} className="hover:text-gray-300 transition-colors">
                {link.etiqueta}
              </Link>
            ))}
            <a
              href="https://www.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-300 transition-colors"
            >
              GOV.CO <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}