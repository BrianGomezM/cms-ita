import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero / Banner principal',
    plural: 'Heros / Banners',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título principal',
      defaultValue: '¡Bienvenido!',
    },
    {
      name: 'subtitulo',
      type: 'text',
      label: 'Subtítulo',
      defaultValue: '¿Qué trámite deseas realizar?',
    },
    // ── Imagen principal (empresarios) ──────────────
    {
      name: 'imagenPrincipal',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
      admin: {
        description: 'Imagen grande lado izquierdo. Recomendado: 500x550px PNG fondo transparente.',
      },
    },
    // ── Grid de servicios ───────────────────────────
    {
      name: 'servicios',
      type: 'array',
      label: 'Tarjetas de servicios',
      maxRows: 8,
      admin: {
        description: 'Grid de servicios (máximo 8)',
      },
      fields: [
        {
          name: 'icono',
          type: 'select',
          required: true,
          label: 'Ícono',
          options: [
            { label: '🔄 Renovar', value: 'RefreshCw' },
            { label: '🖥️ Trámites Virtuales', value: 'Monitor' },
            { label: '⬇️ Certificados', value: 'Download' },
            { label: '💡 Programa', value: 'Lightbulb' },
            { label: '👤 Servicios', value: 'User' },
            { label: '📢 Convocatorias', value: 'Megaphone' },
            { label: '🔍 Búsqueda', value: 'Search' },
            { label: '🏆 Aliado Plus', value: 'Award' },
            { label: '📋 Formulario', value: 'ClipboardList' },
            { label: '📊 Gráfica', value: 'BarChart' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Texto de la tarjeta',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: 'Enlace (URL)',
        },
      ],
    },
    // ── Banners de noticias ─────────────────────────
    {
      name: 'banners',
      type: 'array',
      label: 'Banners de noticias/videos',
      maxRows: 3,
      fields: [
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen del banner',
        },
        {
          name: 'titulo',
          type: 'text',
          required: true,
          label: 'Título del banner',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: 'Enlace del banner',
        },
      ],
    },
    // ── Campos legacy (mantener compatibilidad) ─────
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de fondo (legacy)',
      admin: {
        description: 'Campo anterior — usar "Imagen principal" para el nuevo diseño',
        condition: () => false, // ocultar en el panel
      },
    },
    {
      name: 'alineacion',
      type: 'select',
      label: 'Alineación',
      defaultValue: 'centro',
      admin: { condition: () => false },
      options: [
        { label: 'Izquierda', value: 'izquierda' },
        { label: 'Centro', value: 'centro' },
        { label: 'Derecha', value: 'derecha' },
      ],
    },
    {
      name: 'boton',
      type: 'group',
      label: 'Botón',
      admin: { condition: () => false },
      fields: [
        { name: 'texto', type: 'text', label: 'Texto' },
        { name: 'url', type: 'text', label: 'URL' },
        {
          name: 'estilo',
          type: 'select',
          label: 'Estilo',
          defaultValue: 'primario',
          options: [
            { label: 'Primario', value: 'primario' },
            { label: 'Secundario', value: 'secundario' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
  ],
}