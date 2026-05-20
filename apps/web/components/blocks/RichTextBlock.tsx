import type { RichTextBlockType } from '@/lib/types'

const anchoClases = {
  normal: 'max-w-3xl',
  amplio: 'max-w-5xl',
  completo: 'max-w-6xl',
}

export default function RichTextBlock({ contenido, ancho }: RichTextBlockType) {
  // Payload Lexical serializa el contenido como JSON
  // Por ahora renderizamos el texto plano — en el siguiente paso
  // integraremos el serializer de Lexical
  const textoPlano = extraerTexto(contenido)

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

// Extrae texto plano del JSON de Lexical
function extraerTexto(contenido: unknown): string {
  if (!contenido) return ''
  if (typeof contenido === 'string') return contenido
  if (typeof contenido === 'object' && contenido !== null && 'root' in contenido) {
    const root = (contenido as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root
    if (root?.children) {
      return root.children
        .map((node) => node.children?.map((child) => child.text ?? '').join('') ?? '')
        .join('\n')
    }
  }
  return ''
}