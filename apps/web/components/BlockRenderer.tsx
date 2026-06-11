import type { Block } from '@/lib/types'
import HeroBlock from './blocks/HeroBlock'
import CardsBlock from './blocks/CardsBlock'
import RichTextBlock from './blocks/RichTextBlock'
import GaleriaBlock from './blocks/GaleriaBlock'
import ApiExternaBlock from './blocks/ApiExternaBlock'
import AccordionFAQBlock from './blocks/AccordionFAQBlock'
import ITABannerBlock from './blocks/ITABannerBlock'
import ContrataBlock from './blocks/ContrataBlock'
import TramiteBlock from './blocks/TramiteBlock'
import ParticipaBlock from './blocks/ParticipaBlock'
import DatosAbiertosBlock from './blocks/DatosAbiertosBlock'
import DocumentListBlock from './blocks/DocumentListBlock'
import TimelineBlock from './blocks/TimelineBlock'
import DataTableBlock from './blocks/DataTableBlock'

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
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
          case 'ita-banner':
            return <ITABannerBlock key={i} {...block} />
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
          default:
            return null
        }
      })}
    </>
  )
}