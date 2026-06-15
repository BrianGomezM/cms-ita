import type { TestimoniosBlockType } from '@/lib/types'
import Image from 'next/image'
import { Quote, Star, User } from 'lucide-react'

export default function TestimoniosBlock({ titulo, descripcion, testimonios }: TestimoniosBlockType) {
  if (!testimonios?.length) return null

  return (
    <section className="py-20 bg-white">
      <div className="container-institucional">
        {(titulo || descripcion) && (
          <div className="text-center mb-12">
            {titulo && (
              <>
                <h2 className="section-title">{titulo}</h2>
                <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
              </>
            )}
            {descripcion && <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{descripcion}</p>}
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonios.map((item, i) => (
            <div key={i} className="card p-6 flex flex-col">
              <Quote className="text-secondary mb-4" size={28} />

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: Number(item.calificacion) }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.testimonio}</p>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
                  {item.foto?.url ? (
                    <Image
                      src={item.foto.url}
                      alt={item.foto.alt ?? item.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="text-primary" size={18} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-primary text-sm leading-tight">{item.nombre}</p>
                  {item.cargo && <p className="text-xs text-gray-500">{item.cargo}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
