'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelection, Button, toast } from '@payloadcms/ui'

// Botón que aparece arriba de la tabla de Páginas: publica de una sola vez
// todas las páginas que el editor haya marcado con los checkboxes. Cada
// página se publica como documento independiente (la misma acción que dar
// "Publicar" adentro de cada una), simplemente evita entrar una por una
// cuando se editó más de una página a la vez. Sin selección, no se muestra.
export default function PublicarVariasButton() {
  const { selectedIDs } = useSelection()
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)

  if (!selectedIDs.length) return null

  const publicar = async () => {
    setEnviando(true)
    try {
      const res = await fetch('/api/pages/publicar-varias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedIDs }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.error || 'No se pudieron publicar las páginas.')
        return
      }

      const publicadas: number[] = data?.publicadas ?? []
      const fallidas: number[] = data?.fallidas ?? []

      if (publicadas.length) {
        toast.success(`${publicadas.length} página${publicadas.length === 1 ? '' : 's'} publicada${publicadas.length === 1 ? '' : 's'}.`)
      }
      if (fallidas.length) {
        toast.error(`${fallidas.length} página${fallidas.length === 1 ? '' : 's'} no se pudo publicar (sin permiso o no encontrada).`)
      }

      router.refresh()
    } catch {
      toast.error('Error de red al publicar las páginas.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={{ margin: '0 0 16px' }}>
      <Button onClick={publicar} disabled={enviando} buttonStyle="primary" size="small">
        {enviando ? 'Publicando…' : `Publicar ${selectedIDs.length} página${selectedIDs.length === 1 ? '' : 's'} seleccionada${selectedIDs.length === 1 ? '' : 's'}`}
      </Button>
    </div>
  )
}
