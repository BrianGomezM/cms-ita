'use client'
import type { Tenant } from '@/lib/types'
import { obtenerIniciales } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown, ChevronRight, Search } from 'lucide-react'

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
  { label: 'Noticias', href: '/noticias' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Header({ tenant }: { tenant?: Tenant }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [dropdownAbierto, setDropdownAbierto] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAbierto])

  const navLinks = tenant?.menuPrincipal?.length
    ? tenant.menuPrincipal.map((item) => ({
        label: item.etiqueta,
        href: item.enlace,
        children: item.submenu?.length
          ? item.submenu.map((sub) => ({ label: sub.etiqueta, href: sub.enlace }))
          : undefined,
      }))
    : navLinksPorDefecto

  const accesosRapidos =
    tenant?.accesosRapidos?.map((item) => ({ label: item.etiqueta, href: item.enlace })) ?? []

  const menuIconoUrl = tenant?.menuHamburguesa?.icono?.url ?? tenant?.logo?.url
  const menuTitulo = tenant?.menuHamburguesa?.titulo || tenant?.nombre || 'Portal Institucional'

  return (
    <header className="sticky top-0 z-50 shadow-md">

      {/* ── Barra GOV.CO — obligatoria Res. 1519 ── */}
      <div className="bg-gov text-white text-xs py-1.5 px-4">
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
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {obtenerIniciales(tenant?.nombre)}
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-primary text-sm leading-tight">
                    {tenant?.nombre ?? 'Portal Institucional'}
                  </div>
                  <div className="text-xs text-gray-500">Entidad pública</div>
                </div>
              </div>
            )}
          </Link>

          {/* Buscador — siempre visible, sin botón que lo despliegue */}
          <form action="/buscar" method="get" className="hidden min-w-0 flex-1 max-w-xs sm:block">
            <div className="relative">
              <input
                type="search"
                name="q"
                placeholder="Buscar..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                aria-label="Buscar"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Accesos rápidos */}
          <nav className="hidden shrink-0 items-center gap-4 lg:flex">
            {accesosRapidos.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium leading-tight text-primary hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Botón del menú (hamburguesa, siempre visible) */}
          <button
            className="shrink-0 p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Fondo oscurecido del menú móvil ── */}
      <div
        className={`fixed inset-0 z-55 bg-black/50 transition-opacity duration-300 ${
          menuAbierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuAbierto(false)}
        aria-hidden="true"
      />

      {/* ── Menú móvil (offcanvas) ── */}
      <aside
        className={`fixed inset-y-0 right-0 z-60 w-[85%] max-w-sm overflow-y-auto rounded-l-2xl bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          menuAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
          <div className="flex min-w-0 items-center gap-3">
            {menuIconoUrl ? (
              <Image
                src={menuIconoUrl}
                alt={menuTitulo}
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                CC
              </div>
            )}
            <span className="truncate text-sm font-bold leading-tight text-primary">
              {menuTitulo}
            </span>
          </div>
          <button
            className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:text-primary"
            onClick={() => setMenuAbierto(false)}
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            Menú
          </h2>
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-gray-100 last:border-0">
                {link.children ? (
                  <>
                    <button
                      className="flex w-full items-center justify-between gap-2 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
                      onClick={() =>
                        setDropdownAbierto(dropdownAbierto === link.href ? null : link.href)
                      }
                      aria-expanded={dropdownAbierto === link.href}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight size={16} className="shrink-0 text-primary" />
                        {link.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${
                          dropdownAbierto === link.href ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {dropdownAbierto === link.href && (
                      <div className="flex flex-col gap-0.5 pb-2 pl-7">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="py-2 text-sm text-gray-500 transition-colors hover:text-primary"
                            onClick={() => setMenuAbierto(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <ChevronRight size={16} className="shrink-0 text-primary" />
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </header>
  )
}