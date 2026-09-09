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

// Los tamaños de título grandes (hero, banners) los define el administrador
// en px pensando en pantallas anchas — sin escalar, un título de 60-80px
// puede desbordar o verse desproporcionado en un teléfono. clamp() lo reduce
// de forma fluida en pantallas angostas sin superar nunca el valor elegido
// en el CMS (que sigue viéndose igual desde el breakpoint donde el 5vw ya
// lo alcanza en adelante).
export function fontSizeClamp(tamano: number, minimo = 20): string {
  const min = Math.min(tamano, Math.max(minimo, Math.round(tamano * 0.6)))
  return `clamp(${min}px, 5vw, ${tamano}px)`
}
