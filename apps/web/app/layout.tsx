import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { getCurrentTenant } from '@/lib/payload'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant()
  return {
    title: tenant?.nombre ?? 'Portal Institucional',
    description: `Sitio web institucional de ${tenant?.nombre ?? 'la entidad'}`,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.variable}>
      <body className="min-h-screen flex flex-col bg-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}