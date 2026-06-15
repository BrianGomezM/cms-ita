import type { EquipoBlockType } from '@/lib/types'
import Image from 'next/image'
import { Mail, Phone, User } from 'lucide-react'

const columnasClases = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function EquipoBlock({ titulo, descripcion, columnas, integrantes }: EquipoBlockType) {
  if (!integrantes?.length) return null

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

        <div className={`grid gap-6 ${columnasClases[columnas]}`}>
          {integrantes.map((persona) => (
            <div key={persona.id} className="card p-6 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-blue-50 mb-4 flex items-center justify-center">
                {persona.foto?.url ? (
                  <Image
                    src={persona.foto.url}
                    alt={persona.foto.alt ?? persona.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="text-primary" size={36} />
                )}
              </div>

              <h3 className="font-bold text-primary leading-tight">{persona.nombre}</h3>
              <p className="text-sm text-secondary font-medium mt-1">{persona.cargo}</p>
              {persona.dependencia && (
                <p className="text-xs text-gray-500 mt-1">{persona.dependencia}</p>
              )}

              {persona.descripcion && (
                <p className="text-gray-600 text-sm leading-relaxed mt-3">{persona.descripcion}</p>
              )}

              {(persona.correo || persona.telefono) && (
                <div className="flex flex-col items-center gap-1 mt-4 pt-4 border-t border-gray-100 w-full">
                  {persona.correo && (
                    <a
                      href={`mailto:${persona.correo}`}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors"
                    >
                      <Mail size={12} /> {persona.correo}
                    </a>
                  )}
                  {persona.telefono && (
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={12} /> {persona.telefono}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
