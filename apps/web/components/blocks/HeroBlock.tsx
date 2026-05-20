import type { HeroBlockType } from '@/lib/types'
import Image from 'next/image'

const alineacionClases = {
  izquierda: 'items-start text-left',
  centro: 'items-center text-center',
  derecha: 'items-end text-right',
}

const botonClases = {
  primario: 'bg-blue-700 text-white hover:bg-blue-800',
  secundario: 'bg-gray-600 text-white hover:bg-gray-700',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-blue-900',
}

export default function HeroBlock({ titulo, subtitulo, imagen, alineacion, boton }: HeroBlockType) {
  const align = alineacionClases[alineacion] ?? alineacionClases.centro

  return (
    <section className="relative min-h-120 flex items-center bg-blue-900 overflow-hidden">
      {/* Imagen de fondo */}
      {imagen?.url && (
        <Image
          src={imagen.url}
          alt={imagen.alt ?? ''}
          fill
          className="object-cover opacity-30"
          priority
        />
      )}

      {/* Contenido */}
      <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col ${align}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
          {titulo}
        </h1>

        {subtitulo && (
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
            {subtitulo}
          </p>
        )}

        {boton?.texto && boton?.url && (
          <a
            href={boton.url}
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${botonClases[boton.estilo ?? 'primario']}`}
          >
            {boton.texto}
          </a>
        )}
      </div>
    </section>
  )
}