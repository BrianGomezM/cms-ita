'use client'
import type { Tenant } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown, Search, Phone } from 'lucide-react'

const navLinksPorDefecto = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Nosotros',
    href: '/nosotros',
    children: [
      { label: 'Quiénes somos', href: '/nosotros' },
      { label: 'Misión y visión', href: '/mision-vision' },
      { label: 'Estructura orgánica', href: '/estructura' },
    ],
  },
  {
    label: 'Servicios',
    href: '/servicios',
    children: [
      { label: 'Registro Mercantil', href: '/registro-mercantil' },
      { label: 'Certificados', href: '/certificados' },
      { label: 'Formación Empresarial', href: '/formacion' },
    ],
  },
  { label: 'Contratación', href: '/contratacion' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Header({ tenant }: { tenant?: Tenant }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [dropdownAbierto, setDropdownAbierto] = useState<string | null>(null)

  const navLinks = tenant?.menuPrincipal?.length
    ? tenant.menuPrincipal.map((item) => ({
        label: item.etiqueta,
        href: item.enlace,
        children: item.submenu?.length
          ? item.submenu.map((sub) => ({ label: sub.etiqueta, href: sub.enlace }))
          : undefined,
      }))
    : navLinksPorDefecto

  return (
    <header className="sticky top-0 z-50 shadow-md">

      {/* ── Barra GOV.CO — obligatoria Res. 1519 ── */}
      <div className="bg-[#3366cc] text-white text-xs py-1.5 px-4">
        <div className="container-institucional flex items-center justify-between">
          
          <a
            href="https://www.gov.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <span className="text-sm">🇨🇴</span>
            <span>Un sitio web oficial del Estado colombiano</span>
            <span className="hidden sm:inline text-blue-200">— Aquí le explicamos cómo identificarlo →</span>
          </a>
          {tenant?.footer?.lineaGratuita && (
            <div className="hidden sm:flex items-center gap-4 text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <Phone size={11} />
                {tenant.footer.lineaGratuita}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Header principal ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-institucional py-3 flex items-center justify-between gap-4">

          {/* Logo + nombre */}
          <Link href="/" className="flex items-center gap-3 min-w-0">
            {tenant?.logo?.url ? (
              <Image
                src={tenant.logo.url}
                alt={tenant.nombre}
                width={140}
                height={56}
                className="object-contain h-12 w-auto"
                priority
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  CC
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-[#003366] text-sm leading-tight">
                    {tenant?.nombre ?? 'Portal Institucional'}
                  </div>
                  <div className="text-xs text-gray-500">Entidad pública</div>
                </div>
              </div>
            )}
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative group"
                onMouseEnter={() => link.children && setDropdownAbierto(link.href)}
                onMouseLeave={() => setDropdownAbierto(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#003366] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </Link>

                {/* Dropdown */}
                {link.children && dropdownAbierto === link.href && (
                  <div className="absolute top-full left-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-500 hover:text-[#003366] hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* Botón menú móvil */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-[#003366] hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuAbierto ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Menú móvil ── */}
      {menuAbierto && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="container-institucional py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#003366] hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 border-l-2 border-blue-100 pl-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-[#003366] hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setMenuAbierto(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}