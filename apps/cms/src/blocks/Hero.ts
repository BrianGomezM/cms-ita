import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Banner principal',
    plural: 'Banners principales',
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
    // ── Estilo del título y subtítulo ────────────────
    {
      type: 'collapsible',
      label: 'Diseño del título y subtítulo (opcional)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'tituloTamano',
              type: 'number',
              label: 'Tamaño del título (px)',
              defaultValue: 48,
              min: 20,
              max: 90,
              admin: {
                description: 'Entre 20 y 90. Recomendado: 40-56.',
                width: '50%',
              },
            },
            {
              name: 'tituloNegrita',
              type: 'checkbox',
              label: 'Título en negrita',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'tituloColor',
              type: 'text',
              label: 'Color del título (hex)',
              admin: {
                description: 'Ej: #003366. Vacío = usa el color institucional.',
                width: '50%',
              },
              validate: (value: unknown) => {
                if (!value) return true
                return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                  ? true
                  : 'Usa un color hexadecimal, ej: #003366'
              },
            },
            {
              name: 'subtituloColor',
              type: 'text',
              label: 'Color del subtítulo (hex)',
              admin: {
                description: 'Ej: #0066CC. Vacío = usa el color institucional.',
                width: '50%',
              },
              validate: (value: unknown) => {
                if (!value) return true
                return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                  ? true
                  : 'Usa un color hexadecimal, ej: #0066CC'
              },
            },
          ],
        },
        {
          name: 'tituloPosicion',
          type: 'select',
          label: 'Posición del texto',
          defaultValue: 'izquierda',
          admin: {
            description: 'Alinea el título y el subtítulo dentro del banner.',
          },
          options: [
            { label: 'Izquierda (recomendado)', value: 'izquierda' },
            { label: 'Centro', value: 'centro' },
            { label: 'Derecha', value: 'derecha' },
          ],
        },
      ],
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
    // ── Estilo de la imagen principal ────────────────
    {
      type: 'collapsible',
      label: 'Diseño de la imagen (opcional)',
      admin: {
        initCollapsed: true,
        condition: (_data, siblingData) => Boolean(siblingData?.imagenPrincipal),
      },
      fields: [
        {
          name: 'imagenDesvanecido',
          type: 'select',
          label: 'Desvanecido de la imagen',
          defaultValue: 'suave',
          admin: {
            description: 'Qué tan transparente se ve la imagen sobre el fondo del banner.',
          },
          options: [
            { label: 'Sin desvanecido', value: 'ninguno' },
            { label: 'Suave (recomendado)', value: 'suave' },
            { label: 'Medio', value: 'medio' },
            { label: 'Fuerte', value: 'fuerte' },
          ],
        },
        {
          name: 'imagenAjuste',
          type: 'select',
          label: 'Tamaño de la imagen',
          defaultValue: 'cubrir',
          admin: {
            description: 'Cómo se ajusta la imagen dentro del espacio disponible.',
          },
          options: [
            { label: 'Cubrir todo el espacio (recomendado)', value: 'cubrir' },
            { label: 'Ajustar sin recortar', value: 'contener' },
            { label: 'Tamaño original centrado', value: 'original' },
          ],
        },
      ],
    },
    // ── Grid de servicios ───────────────────────────
    {
      name: 'servicios',
      type: 'array',
      label: 'Tarjetas de servicios',
      admin: {
        description: 'Agrega las tarjetas de servicios que necesites.',
      },
      fields: [
        {
          name: 'icono',
          type: 'text',
          required: true,
          label: 'Ícono',
          admin: {
            description: 'Busca y elige el ícono que mejor represente este servicio (más de 1900 disponibles).',
            components: {
              Field: '/app/(payload)/components/IconPickerField#default',
            },
          },
          validate: (value: unknown) => {
            if (!value) return 'Elige un ícono'
            return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value))
              ? true
              : 'Ícono inválido, elígelo desde el buscador'
          },
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
      admin: {
        description: 'Agrega los banners que necesites.',
      },
      fields: [
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen del banner',
        },
        {
          name: 'opacidad',
          type: 'select',
          label: 'Opacidad de la imagen',
          defaultValue: 'ninguno',
          admin: {
            description: 'Qué tan transparente se ve la imagen del banner.',
          },
          options: [
            { label: 'Sin desvanecido (recomendado)', value: 'ninguno' },
            { label: 'Suave', value: 'suave' },
            { label: 'Medio', value: 'medio' },
            { label: 'Fuerte', value: 'fuerte' },
          ],
        },
        {
          name: 'titulo',
          type: 'text',
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