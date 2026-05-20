import type { Block } from '@/lib/types'
import HeroBlock from './blocks/HeroBlock'
import CardsBlock from './blocks/CardsBlock'
import RichTextBlock from './blocks/RichTextBlock'
import GaleriaBlock from './blocks/GaleriaBlock'
import ApiExternaBlock from './blocks/ApiExternaBlock'

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
          default:
            return null
        }
      })}
    </>
  )
}