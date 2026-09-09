import type { Tenant } from '@/lib/types'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Barra "Inicio › Página padre › ... › Título de la página actual" que
// aparece arriba del contenido en cada página interna (no en la portada).
// El tramo intermedio ("Página padre › ...") viene de recorrer el campo
// "Página padre" configurado en el CMS — si una página no tiene padre
// asignado, la ruta queda igual que antes: "Inicio › Título". Todo su
// aspecto (colores, tamaño, negrita) se configura desde Clientes → Header →
// Migas de pan — si el administrador la desactiva ahí, no renderiza nada.
export default function Breadcrumbs({
  tenant,
  paginaTitulo,
  trail = [],
}: {
  tenant?: Tenant
  paginaTitulo: string
  trail?: { titulo: string; slug: string }[]
}) {
  const config = tenant?.migasPan
  if (config?.activo === false) return null

  const colorFondo = config?.colorFondo || '#0378B3'
  const colorTexto = config?.colorTexto || '#FFFFFF'
  const colorTextoActual = config?.colorTextoActual || '#E5F1FA'
  const tamanoTexto = config?.tamanoTexto || 14
  const negrita = config?.negrita ?? true

  return (
    <nav aria-label="Ruta de navegación" style={{ backgroundColor: colorFondo }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link
          href="/"
          style={{ color: colorTexto, fontSize: tamanoTexto, fontWeight: negrita ? 600 : 400 }}
          className="transition-opacity hover:underline hover:opacity-90"
        >
          Inicio
        </Link>
        <ChevronRight size={tamanoTexto} style={{ color: colorTexto }} className="shrink-0 opacity-70" />

        {trail.map((item) => (
          <span key={item.slug} className="flex items-center gap-2">
            <Link
              href={`/${item.slug}`}
              style={{ color: colorTexto, fontSize: tamanoTexto, fontWeight: negrita ? 600 : 400 }}
              className="transition-opacity hover:underline hover:opacity-90"
            >
              {item.titulo}
            </Link>
            <ChevronRight size={tamanoTexto} style={{ color: colorTexto }} className="shrink-0 opacity-70" />
          </span>
        ))}

        <span style={{ color: colorTextoActual, fontSize: tamanoTexto }} className="truncate">
          {paginaTitulo}
        </span>
      </div>
    </nav>
  )
}
