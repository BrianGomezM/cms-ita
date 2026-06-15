import type { Metadata } from 'next'
import { Roboto, Inter, Open_Sans } from 'next/font/google'
import { getCurrentTenant } from '@/lib/payload'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

// Mapea la fuente elegida en el panel (Tenant > Configuración visual) a la
// variable CSS generada por next/font para esa familia tipográfica.
const FUENTES_POR_TENANT: Record<string, string> = {
  roboto: 'var(--font-roboto)',
  inter: 'var(--font-inter)',
  'open-sans': 'var(--font-open-sans)',
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant()
  return {
    title: tenant?.nombre ?? 'Portal Institucional',
    description: `Sitio web institucional de ${tenant?.nombre ?? 'la entidad'}`,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getCurrentTenant()
  const config = tenant?.configuracion

  // Variables CSS de marca: cada tenant puede definir sus propios colores y
  // tipografía desde el panel (Tenant > Configuración visual). Si no los
  // define, se usan los valores por defecto definidos en globals.css.
  const temaTenant: Record<string, string> = {}
  if (config?.colorPrimario) temaTenant['--color-primary'] = config.colorPrimario
  if (config?.colorSecundario) temaTenant['--color-secondary'] = config.colorSecundario
  temaTenant['--font-tenant'] = FUENTES_POR_TENANT[config?.fuente ?? 'roboto'] ?? 'var(--font-roboto)'

  return (
    <html
      lang="es"
      className={`${roboto.variable} ${inter.variable} ${openSans.variable}`}
      style={temaTenant as React.CSSProperties}
    >
      <body className="min-h-screen flex flex-col bg-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}