import type { GaleriaBlockType } from '@/lib/types'
import Image from 'next/image'

export default function GaleriaBlock({ titulo, imagenes }: GaleriaBlockType) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {titulo && (
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            {titulo}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagenes?.map((item, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={item.imagen.url}
                alt={item.caption ?? item.imagen.alt ?? ''}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}