'use client'

import type { Block, Tenant } from '@/lib/types'
import HeroBlock from './blocks/HeroBlock'
import CardsBlock from './blocks/CardsBlock'
import RichTextBlock from './blocks/RichTextBlock'
import GaleriaBlock from './blocks/GaleriaBlock'
import ApiExternaBlock from './blocks/ApiExternaBlock'
import AccordionFAQBlock from './blocks/AccordionFAQBlock'
import ContrataBlock from './blocks/ContrataBlock'
import TramiteBlock from './blocks/TramiteBlock'
import ParticipaBlock from './blocks/ParticipaBlock'
import DatosAbiertosBlock from './blocks/DatosAbiertosBlock'
import DocumentListBlock from './blocks/DocumentListBlock'
import TimelineBlock from './blocks/TimelineBlock'
import DataTableBlock from './blocks/DataTableBlock'
import EquipoBlock from './blocks/EquipoBlock'
import ContactoBlock from './blocks/ContactoBlock'
import AliadosBlock from './blocks/AliadosBlock'
import TestimoniosBlock from './blocks/TestimoniosBlock'

// Bloques que consultan datos en vivo desde el servidor (noticias, resumen ITA)
// y no pueden renderizarse dentro de un componente de cliente. En la vista
// previa se muestran como un mensaje informativo; su contenido real se ve en
// el sitio publicado.
const BLOQUES_NO_PREVISUALIZABLES: Record<string, string> = {
  noticias: 'Noticias y avisos',
  'ita-banner': 'Indicador de Transparencia (ITA)',
}

export default function PreviewBlockRenderer({ blocks, tenant }: { blocks: Block[]; tenant?: Tenant }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        if (block.blockType in BLOQUES_NO_PREVISUALIZABLES) {
          return (
            <div key={i} className="container-institucional py-8 text-center text-sm text-gray-400 border-y border-dashed border-gray-200">
              Bloque &quot;{BLOQUES_NO_PREVISUALIZABLES[block.blockType]}&quot; — visible en el sitio publicado
            </div>
          )
        }

        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={i} {...block} />
          case 'cards':
            return <CardsBlock key={i} {...block} />
          case 'rich-text':
            return <RichTextBlock key={i} {...block} />
          case 'galeria':
            return <GaleriaBlock key={i} {...block} />
          case 'api-externa':
            return <ApiExternaBlock key={i} {...block} />
          case 'accordion-faq':
            return <AccordionFAQBlock key={i} {...block} />
          case 'contrata':
            return <ContrataBlock key={i} {...block} />
          case 'tramite':
            return <TramiteBlock key={i} {...block} />
          case 'participa':
            return <ParticipaBlock key={i} {...block} />
          case 'datos-abiertos':
            return <DatosAbiertosBlock key={i} {...block} />
          case 'document-list':
            return <DocumentListBlock key={i} {...block} />
          case 'timeline':
            return <TimelineBlock key={i} {...block} />
          case 'data-table':
            return <DataTableBlock key={i} {...block} />
          case 'equipo':
            return <EquipoBlock key={i} {...block} />
          case 'contacto':
            return <ContactoBlock key={i} {...block} tenant={tenant} />
          case 'aliados':
            return <AliadosBlock key={i} {...block} />
          case 'testimonios':
            return <TestimoniosBlock key={i} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
