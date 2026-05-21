import type { CardsBlockType } from '@/lib/types'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const columnasClases = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function CardsBlock({ titulo, columnas, items }: CardsBlockType) {
  if (!items?.length) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-institucional">

        {titulo && (
          <div className="text-center mb-12">
            <h2 className="section-title">{titulo}</h2>
            <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
          </div>
        )}

        <div className={`grid gap-6 ${columnasClases[columnas]}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className="card group p-0 overflow-hidden flex flex-col"
            >
              {item.imagen?.url && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.imagen.url}
                    alt={item.imagen.alt ?? item.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {item.icono && !item.imagen && (
                  <div className="text-4xl mb-4">{item.icono}</div>
                )}

                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {item.titulo}
                </h3>

                {item.descripcion && (
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                    {item.descripcion}
                  </p>
                )}

                {item.enlace && (
                  <a
                    href={item.enlace}
                    className="inline-flex items-center gap-2 text-secondary font-medium text-sm hover:text-primary transition-colors mt-auto group/link"
                  >
                    Ver más
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
