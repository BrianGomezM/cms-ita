import { FileText, Download, Calendar } from 'lucide-react'
import type { DocumentListBlockType } from '@/lib/types'

export default function DocumentListBlock({ titulo, descripcion, items }: DocumentListBlockType) {
  if (!items?.length) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-institucional max-w-3xl">

        {(titulo || descripcion) && (
          <div className="text-center mb-12">
            {titulo && (
              <>
                <h2 className="section-title">{titulo}</h2>
                <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
              </>
            )}
            {descripcion && <p className="text-gray-600 mt-4">{descripcion}</p>}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                <FileText size={20} />
              </div>

              <div className="flex-1 min-w-0">
                {item.categoria && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-primary">
                    {item.categoria}
                  </span>
                )}
                <h3 className="text-base font-bold text-primary mt-1">{item.nombre}</h3>
                {item.descripcion && (
                  <p className="text-gray-600 text-sm mt-1">{item.descripcion}</p>
                )}
                {item.fecha && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Calendar size={12} />
                    {new Date(item.fecha).toLocaleDateString('es-CO')}
                  </span>
                )}
              </div>

              <a
                href={item.archivo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors"
              >
                Descargar <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
