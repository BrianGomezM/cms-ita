import type { TimelineBlockType } from '@/lib/types'

export default function TimelineBlock({ titulo, descripcion, items }: TimelineBlockType) {
  if (!items?.length) return null

  return (
    <section className="py-20 bg-white">
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

        <div className="relative pl-8 border-l-2 border-blue-100 flex flex-col gap-8">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <div className="absolute -left-[2.55rem] top-1 w-4 h-4 rounded-full bg-secondary border-4 border-white ring-2 ring-blue-100" />
              <span className="text-sm font-bold text-secondary">{item.fecha}</span>
              <h3 className="text-lg font-bold text-primary mt-1">{item.titulo}</h3>
              {item.descripcion && (
                <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
