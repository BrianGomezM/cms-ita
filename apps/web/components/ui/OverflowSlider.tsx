'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface OverflowSliderProps {
  children: React.ReactNode
  /** 'horizontal' desliza en fila, 'vertical' desliza en columna. */
  direccion?: 'horizontal' | 'vertical'
  /** Qué hacer cuando el contenido no cabe: botones manuales o desplazamiento solo. */
  modo?: 'automatico' | 'botones'
  /** Segundos entre cada paso, solo aplica si modo es "automatico". */
  velocidad?: number
  /** Espacio entre elementos, en px — se usa tanto si hay scroll como si no. */
  espacio?: number
  className?: string
}

// Motor de carrusel genérico: mide si el contenido realmente no cabe en su
// contenedor (con ResizeObserver, no con un número fijo de elementos, ya
// que eso depende del tamaño que el administrador elija para cada ítem).
// Si cabe, se muestra centrado y quieto. Si no cabe, se activa scroll con
// botones o con desplazamiento automático (que se pausa al pasar el mouse).
export default function OverflowSlider({
  children,
  direccion = 'horizontal',
  modo = 'botones',
  velocidad = 3,
  espacio = 16,
  className = '',
}: OverflowSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [desborda, setDesborda] = useState(false)
  const esHorizontal = direccion === 'horizontal'

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const medir = () => {
      setDesborda(esHorizontal ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight > el.clientHeight + 1)
    }

    medir()
    const observer = new ResizeObserver(medir)
    observer.observe(el)
    return () => observer.disconnect()
  }, [esHorizontal, children])

  const avanzar = useCallback(
    (signo: 1 | -1) => {
      const el = trackRef.current
      if (!el) return
      const paso = esHorizontal ? el.clientWidth * 0.8 : el.clientHeight * 0.8
      const limite = esHorizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight
      const actual = esHorizontal ? el.scrollLeft : el.scrollTop
      let siguiente = actual + signo * paso
      if (siguiente >= limite - 1) siguiente = 0
      if (siguiente < 0) siguiente = limite
      el.scrollTo(esHorizontal ? { left: siguiente, behavior: 'smooth' } : { top: siguiente, behavior: 'smooth' })
    },
    [esHorizontal],
  )

  // Desplazamiento automático: avanza solo cada "velocidad" segundos y se
  // detiene mientras el visitante tiene el mouse encima o está enfocado.
  const [pausado, setPausado] = useState(false)
  useEffect(() => {
    if (!desborda || modo !== 'automatico' || pausado) return
    const id = setInterval(() => avanzar(1), Math.max(velocidad, 1) * 1000)
    return () => clearInterval(id)
  }, [desborda, modo, pausado, velocidad, avanzar])

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div
        ref={trackRef}
        className={
          esHorizontal
            ? `flex flex-nowrap overflow-x-auto scroll-smooth ${desborda ? '' : 'justify-center'}`
            : `flex max-h-full flex-col flex-nowrap overflow-y-auto scroll-smooth ${desborda ? '' : 'items-center'}`
        }
        style={{ gap: espacio, scrollbarWidth: 'thin' }}
      >
        {children}
      </div>

      {desborda && modo === 'botones' && (
        <>
          <button
            type="button"
            onClick={() => avanzar(-1)}
            aria-label="Anterior"
            className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-transform hover:scale-110 ${
              esHorizontal ? 'top-1/2 left-1 -translate-y-1/2' : 'top-1 left-1/2 -translate-x-1/2 rotate-90'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => avanzar(1)}
            aria-label="Siguiente"
            className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-transform hover:scale-110 ${
              esHorizontal ? 'top-1/2 right-1 -translate-y-1/2' : 'right-1/2 bottom-1 translate-x-1/2 rotate-90'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  )
}
