import type { CardsBlockType } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

const columnasClases = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function CardsBlock({ titulo, columnas, items }: CardsBlockType) {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {titulo && (
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            {titulo}
          </h2>
        )}

        <div className={`grid gap-6 ${columnasClases[columnas]}`}>
          {items?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {item.imagen?.url && (
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.imagen.url}
                    alt={item.imagen.alt ?? item.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {item.icono && !item.imagen && (
                <div className="text-4xl mb-4">{item.icono}</div>
              )}

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.titulo}
              </h3>

              {item.descripcion && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.descripcion}
                </p>
              )}

              {item.enlace && (
                <Link
                  href={item.enlace}
                  className="mt-4 inline-block text-blue-700 font-medium text-sm hover:underline"
                >
                  Ver más →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}