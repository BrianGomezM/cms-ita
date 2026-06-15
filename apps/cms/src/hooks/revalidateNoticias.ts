// Avisa al sitio web que una noticia/aviso cambió, para regenerar
// de inmediato el listado (/noticias) y la página de detalle.
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || ''

async function notificarRevalidacion(slug: string) {
  if (!REVALIDATE_SECRET) return
  try {
    await fetch(`${SITE_URL}/api/revalidate?secret=${REVALIDATE_SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
  } catch (err) {
    console.error('No se pudo revalidar el sitio web:', err)
  }
}

export const revalidateNoticiaAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  if (doc?.estado === 'publicado' || previousDoc?.estado === 'publicado') {
    await notificarRevalidacion('noticias')
    await notificarRevalidacion(`noticias/${doc?.slug}`)
  }
  return doc
}

export const revalidateNoticiaAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc?.estado === 'publicado') {
    await notificarRevalidacion('noticias')
    await notificarRevalidacion(`noticias/${doc?.slug}`)
  }
  return doc
}
