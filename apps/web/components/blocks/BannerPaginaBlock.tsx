import type { BannerPaginaBlockType } from '@/lib/types'
import Image from 'next/image'
import { fontSizeClamp } from '@/lib/utils'

type TextoPosicion = 'izquierda' | 'centro' | 'derecha'
type ImagenDesvanecido = 'ninguno' | 'suave' | 'medio' | 'fuerte'
type ImagenAjuste = 'cubrir' | 'contener' | 'original'

const TEXTO_POSICION_CLASES: Record<TextoPosicion, string> = {
  izquierda: 'justify-start text-left',
  centro: 'justify-center text-center',
  derecha: 'justify-end text-right',
}

const IMAGEN_DESVANECIDO_CLASES: Record<ImagenDesvanecido, string> = {
  ninguno: 'opacity-100',
  suave: 'opacity-90',
  medio: 'opacity-70',
  fuerte: 'opacity-50',
}

const IMAGEN_AJUSTE_CLASES: Record<ImagenAjuste, string> = {
  cubrir: 'object-cover',
  contener: 'object-contain',
  original: 'object-none',
}

export default function BannerPaginaBlock({
  texto,
  textoTamano = 36,
  textoNegrita = true,
  textoColor,
  textoPosicion = 'izquierda',
  imagenFondo,
  imagenDesvanecido = 'suave',
  imagenAjuste = 'cubrir',
}: BannerPaginaBlockType) {
  return (
    <section className="relative min-h-55 w-full overflow-hidden bg-primary">
      {imagenFondo?.url && (
        <div className="absolute inset-0">
          <Image
            src={imagenFondo.url}
            alt=""
            fill
            className={`${IMAGEN_AJUSTE_CLASES[imagenAjuste]} ${IMAGEN_DESVANECIDO_CLASES[imagenDesvanecido]}`}
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      )}
      <div
        className={`relative z-10 mx-auto flex min-h-55 max-w-6xl items-end px-4 py-8 ${TEXTO_POSICION_CLASES[textoPosicion]}`}
      >
        <h1
          style={{
            fontSize: fontSizeClamp(textoTamano),
            color: textoColor || '#FFFFFF',
            fontWeight: textoNegrita ? 700 : 400,
          }}
        >
          {texto}
        </h1>
      </div>
    </section>
  )
}
