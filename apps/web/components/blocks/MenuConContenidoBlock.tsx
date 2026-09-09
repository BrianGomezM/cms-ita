'use client'

import type { MenuConContenidoBlockType } from '@/lib/types'
import Image from 'next/image'
import { useState } from 'react'
import { ContenidoRenderer, CompartirRedes } from './contenido/ContenidoRenderer'
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

export default function MenuConContenidoBlock({
  textoTamano = 32,
  textoNegrita = true,
  textoColor,
  textoPosicion = 'izquierda',
  imagenDesvanecido = 'suave',
  imagenAjuste = 'cubrir',
  compartir,
  items,
}: MenuConContenidoBlockType) {
  const [activo, setActivo] = useState(0)
  if (!items?.length) return null
  const pestanaActiva = items[activo] ?? items[0]
  const bannerTexto = pestanaActiva.bannerTexto || pestanaActiva.etiqueta

  return (
    <>
      {(pestanaActiva.bannerImagen?.url || bannerTexto) && (
        <section className="relative min-h-45 w-full overflow-hidden bg-primary">
          {pestanaActiva.bannerImagen?.url && (
            <div className="absolute inset-0">
              <Image
                src={pestanaActiva.bannerImagen.url}
                alt=""
                fill
                className={`${IMAGEN_AJUSTE_CLASES[imagenAjuste]} ${IMAGEN_DESVANECIDO_CLASES[imagenDesvanecido]}`}
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
            </div>
          )}
          <div
            className={`relative z-10 mx-auto flex min-h-45 max-w-6xl items-end px-4 py-6 ${TEXTO_POSICION_CLASES[textoPosicion]}`}
          >
            <h2
              style={{
                fontSize: fontSizeClamp(textoTamano),
                color: textoColor || '#FFFFFF',
                fontWeight: textoNegrita ? 700 : 400,
              }}
            >
              {bannerTexto}
            </h2>
          </div>
        </section>
      )}

      {Boolean(compartir?.redes?.length) && (
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <CompartirRedes bloque={{ blockType: 'compartir-redes', ...compartir }} />
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          <nav className="h-fit overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {items.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                onClick={() => setActivo(i)}
                className={`block w-full border-b border-gray-100 px-4 py-3 text-left text-sm transition-colors last:border-b-0 ${
                  i === activo ? 'bg-primary font-semibold text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.etiqueta}
              </button>
            ))}
          </nav>

          <div className="min-w-0 space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            {pestanaActiva.contenido?.map((bloque, i) => <ContenidoRenderer key={i} bloque={bloque} />)}
          </div>
        </div>
      </section>
    </>
  )
}
