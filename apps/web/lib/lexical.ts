// Extrae texto plano del JSON serializado por el editor Lexical de Payload
export function extraerTextoLexical(contenido: unknown): string {
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
