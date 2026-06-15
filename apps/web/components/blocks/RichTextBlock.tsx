import type { RichTextBlockType } from '@/lib/types'
import { extraerTextoLexical } from '@/lib/lexical'

const anchoClases = {
  normal: 'max-w-3xl',
  amplio: 'max-w-5xl',
  completo: 'max-w-6xl',
}

export default function RichTextBlock({ contenido, ancho }: RichTextBlockType) {
  // Payload Lexical serializa el contenido como JSON
  // Por ahora renderizamos el texto plano — en el siguiente paso
  // integraremos el serializer de Lexical
  const textoPlano = extraerTextoLexical(contenido)

  return (
    <section className="py-12 px-6 bg-white">
      <div className={`mx-auto ${anchoClases[ancho]}`}>
        <div className="prose prose-lg prose-blue max-w-none">
          {textoPlano}
        </div>
      </div>
    </section>
  )
}