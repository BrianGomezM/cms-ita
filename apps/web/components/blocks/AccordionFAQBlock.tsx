'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { AccordionFAQBlockType } from '@/lib/types'

export default function AccordionFAQBlock({ titulo, descripcion, items }: AccordionFAQBlockType) {
  const [abierto, setAbierto] = useState<string | null>(null)

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
            {descripcion && (
              <p className="text-gray-600 mt-4">{descripcion}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const isOpen = abierto === item.id
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAbierto(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-primary">{item.pregunta}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-200">
                    {item.respuesta}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
