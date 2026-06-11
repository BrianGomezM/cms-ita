import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Endpoint llamado por Payload (hook afterChange/afterDelete de "pages")
// cuando una página se publica, despublica o elimina, para que Next.js
// regenere de inmediato esa ruta sin esperar al intervalo de ISR.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const slug = body?.slug as string | undefined

  if (slug === 'inicio') {
    revalidatePath('/')
  } else if (slug) {
    revalidatePath(`/${slug}`)
  } else {
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? null, now: Date.now() })
}
