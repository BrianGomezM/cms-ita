import type { GaleriaBlockType } from '@/lib/types'
import Image from 'next/image'

// Clases de Tailwind escritas de forma literal para que el compilador las
// detecte (no se pueden generar dinámicamente con template strings).
const COLUMNAS_GRID: Record<string, string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-2 md:grid-cols-3',
  '4': 'grid-cols-2 md:grid-cols-4',
  '5': 'grid-cols-2 md:grid-cols-5',
}

const COLUMNAS_MASONRY: Record<string, string> = {
  '2': 'columns-2',
  '3': 'columns-2 md:columns-3',
  '4': 'columns-2 md:columns-4',
  '5': 'columns-2 md:columns-5',
}

export default function GaleriaBlock({ titulo, tipo, columnas, imagenes }: GaleriaBlockType) {
  const items = imagenes?.filter((item) => item.imagen?.url) ?? []

  if (!items.length) return null

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {titulo && (
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            {titulo}
          </h2>
        )}

        {tipo === 'carrusel' && (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2">
            {items.map((item, i) => (
              <div key={i} className="relative shrink-0 w-72 aspect-video rounded-lg overflow-hidden snap-start">
                <Image
                  src={item.imagen!.url}
                  alt={item.caption ?? item.imagen!.alt ?? ''}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {tipo === 'masonry' && (
          <div className={`${COLUMNAS_MASONRY[columnas ?? '3']} gap-4`}>
            {items.map((item, i) => (
              <div key={i} className="relative mb-4 rounded-lg overflow-hidden break-inside-avoid">
                <Image
                  src={item.imagen!.url}
                  alt={item.caption ?? item.imagen!.alt ?? ''}
                  width={item.imagen!.width ?? 600}
                  height={item.imagen!.height ?? 400}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {(!tipo || tipo === 'grid') && (
          <div className={`grid ${COLUMNAS_GRID[columnas ?? '3']} gap-4`}>
            {items.map((item, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={item.imagen!.url}
                  alt={item.caption ?? item.imagen!.alt ?? ''}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
