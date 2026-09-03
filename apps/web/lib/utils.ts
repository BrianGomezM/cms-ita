const CONECTORES = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e'])

// Iniciales de respaldo cuando el tenant no tiene logo (ej. "Cámara de
// Comercio del Cauca" → "CC"). Nunca debe haber un tenant fijo hardcodeado.
export function obtenerIniciales(nombre?: string): string {
  if (!nombre) return '··'
  const palabras = nombre
    .trim()
    .split(/\s+/)
    .filter((p) => !CONECTORES.has(p.toLowerCase()))
  const iniciales = palabras.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '')
  return iniciales.join('') || '··'
}
