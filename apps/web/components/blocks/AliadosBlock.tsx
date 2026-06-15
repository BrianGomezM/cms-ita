import type { AliadosBlockType } from '@/lib/types'
import Image from 'next/image'

export default function AliadosBlock({ titulo, descripcion, aliados }: AliadosBlockType) {
  if (!aliados?.length) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-institucional">
        {(titulo || descripcion) && (
          <div className="text-center mb-10">
            {titulo && (
              <>
                <h2 className="section-title">{titulo}</h2>
                <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
              </>
            )}
            {descripcion && <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{descripcion}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
          {aliados.map((aliado, i) => {
            const logo = (
              <div className="relative h-16 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
                <Image
                  src={aliado.logo.url}
                  alt={aliado.logo.alt ?? aliado.nombre}
                  fill
                  className="object-contain"
                />
              </div>
            )

            return (
              <div key={i} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                {aliado.enlace ? (
                  <a
                    href={aliado.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                    title={aliado.nombre}
                  >
                    {logo}
                  </a>
                ) : (
                  <div className="w-full" title={aliado.nombre}>
                    {logo}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
