// Avisa al sitio web (Next.js) que una página cambió, para que regenere
// esa ruta de inmediato (sin esperar al intervalo de ISR).
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || ''

async function notificarRevalidacion(slug?: string | null) {
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

// Revalida cuando una página se publica o se despublica/edita estando publicada
export const revalidatePageAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  if (doc?.estado === 'publicado' || previousDoc?.estado === 'publicado') {
    await notificarRevalidacion(doc?.slug)
  }
  return doc
}

// Revalida cuando se elimina una página que estaba publicada
export const revalidatePageAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  if (doc?.estado === 'publicado') {
    await notificarRevalidacion(doc?.slug)
  }
  return doc
}
