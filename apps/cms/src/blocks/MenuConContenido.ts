import type { Block } from 'payload'

const validarIcono = (value: unknown) => {
  if (!value) return 'Elige un ícono'
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value))
    ? true
    : 'Ícono inválido, elígelo desde el buscador'
}

const hexOpcional = (mensaje: string) => (value: unknown) => {
  if (!value) return true
  return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value)) ? true : mensaje
}

// Los tipos de contenido que puede llevar cada pestaña — piezas pequeñas y
// reutilizables (el mismo espíritu que los bloques de página), para que el
// administrador arme cualquier combinación sin depender de un solo textarea
// gigante con HTML.
const BLOQUES_CONTENIDO_BASE: Block[] = [
  {
    slug: 'titulo',
    labels: { singular: 'Título', plural: 'Títulos' },
    fields: [
      { name: 'texto', type: 'text', required: true, label: 'Texto del título' },
      {
        type: 'row',
        fields: [
          {
            name: 'tamano',
            type: 'number',
            label: 'Tamaño (px)',
            defaultValue: 24,
            min: 14,
            max: 60,
            admin: { width: '34%' },
          },
          {
            name: 'alineacion',
            type: 'select',
            label: 'Alineación',
            defaultValue: 'izquierda',
            options: [
              { label: 'Izquierda', value: 'izquierda' },
              { label: 'Centro', value: 'centro' },
              { label: 'Derecha', value: 'derecha' },
            ],
            admin: { width: '33%' },
          },
          {
            name: 'color',
            type: 'text',
            label: 'Color (hex, opcional)',
            admin: { width: '33%', description: 'Vacío = usa el color institucional.' },
            validate: (value: unknown) => {
              if (!value) return true
              return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                ? true
                : 'Usa un color hexadecimal, ej: #0378B3'
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'subtitulo',
    labels: { singular: 'Subtítulo', plural: 'Subtítulos' },
    fields: [
      { name: 'texto', type: 'text', required: true, label: 'Texto del subtítulo' },
      {
        type: 'row',
        fields: [
          {
            name: 'tamano',
            type: 'number',
            label: 'Tamaño (px)',
            defaultValue: 18,
            min: 12,
            max: 40,
            admin: { width: '34%' },
          },
          {
            name: 'alineacion',
            type: 'select',
            label: 'Alineación',
            defaultValue: 'izquierda',
            options: [
              { label: 'Izquierda', value: 'izquierda' },
              { label: 'Centro', value: 'centro' },
              { label: 'Derecha', value: 'derecha' },
            ],
            admin: { width: '33%' },
          },
          {
            name: 'color',
            type: 'text',
            label: 'Color (hex, opcional)',
            admin: { width: '33%', description: 'Vacío = usa el color institucional.' },
            validate: (value: unknown) => {
              if (!value) return true
              return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                ? true
                : 'Usa un color hexadecimal, ej: #0378B3'
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'parrafo',
    labels: { singular: 'Párrafo de texto', plural: 'Párrafos de texto' },
    fields: [
      {
        name: 'texto',
        type: 'textarea',
        required: true,
        label: 'Texto',
        admin: {
          description: 'Envuelve una parte en **doble asterisco** para ponerla en negrita. Presiona Enter para hacer un salto de línea.',
        },
      },
    ],
  },
  {
    slug: 'vinetas',
    labels: { singular: 'Lista con viñetas', plural: 'Listas con viñetas' },
    fields: [
      {
        name: 'items',
        type: 'array',
        label: 'Elementos de la lista',
        labels: { singular: 'Elemento', plural: 'Elementos' },
        minRows: 1,
        fields: [
          {
            name: 'texto',
            type: 'text',
            required: true,
            label: 'Texto',
            admin: {
              description: 'Envuelve una parte en **doble asterisco** para ponerla en negrita.',
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'boton',
    labels: { singular: 'Botón', plural: 'Botones' },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'texto',
            type: 'text',
            required: true,
            label: 'Texto del botón',
            admin: { width: '50%' },
          },
          {
            name: 'icono',
            type: 'text',
            label: 'Ícono (opcional)',
            admin: {
              width: '50%',
              description: 'Busca y elige un ícono, o déjalo vacío para no mostrar ninguno.',
              components: { Field: '/app/(payload)/components/IconPickerField#default' },
            },
            validate: (value: unknown) => {
              if (!value) return true
              return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value))
                ? true
                : 'Ícono inválido, elígelo desde el buscador'
            },
          },
        ],
      },
      {
        name: 'enlace',
        type: 'text',
        label: 'Enlace (URL)',
        admin: {
          description: 'Opcional si adjuntas un documento abajo — si pones ambos, el documento tiene prioridad.',
        },
        validate: (value: unknown, { siblingData }: { siblingData?: { documento?: unknown } }) => {
          if (!value && !siblingData?.documento) return 'Indica un enlace o adjunta un documento'
          return true
        },
      },
      {
        name: 'documento',
        type: 'upload',
        relationTo: 'media',
        label: 'Documento adjunto (PDF, opcional)',
        admin: {
          description: 'Si lo adjuntas, el botón abre este documento en una pestaña nueva en vez del enlace.',
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'estilo',
            type: 'select',
            label: 'Estilo',
            defaultValue: 'primario',
            options: [
              { label: 'Primario', value: 'primario' },
              { label: 'Secundario', value: 'secundario' },
              { label: 'Contorno', value: 'outline' },
            ],
            admin: { width: '34%' },
          },
          {
            name: 'color',
            type: 'text',
            label: 'Color propio (hex, opcional)',
            admin: {
              width: '33%',
              description: 'Vacío = usa el color del estilo elegido.',
            },
            validate: (value: unknown) => {
              if (!value) return true
              return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                ? true
                : 'Usa un color hexadecimal, ej: #0378B3'
            },
          },
          {
            name: 'redondeo',
            type: 'select',
            label: 'Redondeo de bordes',
            defaultValue: 'suave',
            options: [
              { label: 'Ninguno', value: 'ninguno' },
              { label: 'Suave (recomendado)', value: 'suave' },
              { label: 'Completo (píldora)', value: 'completo' },
            ],
            admin: { width: '33%' },
          },
        ],
      },
      {
        name: 'alineacion',
        type: 'select',
        label: 'Alineación',
        defaultValue: 'izquierda',
        options: [
          { label: 'Izquierda (recomendado)', value: 'izquierda' },
          { label: 'Centro', value: 'centro' },
          { label: 'Derecha', value: 'derecha' },
        ],
      },
    ],
  },
  {
    slug: 'imagen',
    labels: { singular: 'Imagen', plural: 'Imágenes' },
    fields: [
      { name: 'imagen', type: 'upload', relationTo: 'media', required: true, label: 'Imagen' },
      {
        name: 'ancho',
        type: 'select',
        label: 'Ancho de la imagen',
        defaultValue: 'completa',
        options: [
          { label: 'Pequeña (33%)', value: 'pequena' },
          { label: 'Mediana (50%)', value: 'mediana' },
          { label: 'Grande (75%)', value: 'grande' },
          { label: 'Completa (100%)', value: 'completa' },
        ],
      },
      { name: 'enlace', type: 'text', label: 'Enlace (opcional)' },
    ],
  },
  {
    slug: 'enlace',
    labels: { singular: 'Enlace', plural: 'Enlaces' },
    fields: [
      { name: 'etiqueta', type: 'text', required: true, label: 'Texto del enlace' },
      { name: 'enlace', type: 'text', required: true, label: 'Dirección' },
    ],
  },
  {
    slug: 'enlace-imagen',
    labels: { singular: 'Enlace con imagen (descarga un archivo)', plural: 'Enlaces con imagen' },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'imagen',
            type: 'upload',
            relationTo: 'media',
            label: 'Imagen o ícono (opcional)',
            admin: { width: '50%' },
          },
          {
            name: 'archivo',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Archivo a descargar',
            admin: { width: '50%', description: 'Documento, imagen o cualquier archivo que se descargará al hacer clic.' },
          },
        ],
      },
      { name: 'texto', type: 'text', required: true, label: 'Texto del enlace' },
      {
        type: 'row',
        fields: [
          {
            name: 'tamano',
            type: 'number',
            label: 'Tamaño del texto (px)',
            defaultValue: 15,
            min: 10,
            max: 32,
            admin: { width: '34%' },
          },
          {
            name: 'negrita',
            type: 'checkbox',
            label: 'Negrita',
            defaultValue: false,
            admin: { width: '33%' },
          },
          {
            name: 'color',
            type: 'text',
            label: 'Color (hex, opcional)',
            admin: { width: '33%', description: 'Vacío = usa el color institucional.' },
            validate: (value: unknown) => {
              if (!value) return true
              return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                ? true
                : 'Usa un color hexadecimal, ej: #0378B3'
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'icono-texto',
    labels: { singular: 'Ícono con texto', plural: 'Íconos con texto' },
    fields: [
      {
        name: 'icono',
        type: 'text',
        required: true,
        label: 'Ícono',
        admin: {
          description: 'Busca y elige el ícono (más de 1900 disponibles).',
          components: { Field: '/app/(payload)/components/IconPickerField#default' },
        },
        validate: validarIcono,
      },
      { name: 'texto', type: 'text', required: true, label: 'Texto' },
    ],
  },
  {
    slug: 'galeria',
    labels: { singular: 'Galería de imágenes', plural: 'Galerías de imágenes' },
    fields: [
      {
        name: 'imagenes',
        type: 'array',
        label: 'Imágenes',
        labels: { singular: 'Imagen', plural: 'Imágenes' },
        minRows: 1,
        fields: [
          { name: 'imagen', type: 'upload', relationTo: 'media', required: true, label: 'Imagen' },
          { name: 'enlace', type: 'text', label: 'Enlace (opcional)' },
        ],
      },
    ],
  },
  {
    slug: 'galeria-documentos',
    labels: {
      singular: 'Galería de documentos (imagen con descarga)',
      plural: 'Galerías de documentos',
    },
    fields: [
      {
        type: 'collapsible',
        label: 'Diseño del título (arriba de la imagen, aplica a todos)',
        admin: { initCollapsed: true },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'tituloTamano',
                type: 'number',
                label: 'Tamaño (px)',
                defaultValue: 16,
                min: 12,
                max: 32,
                admin: { width: '34%' },
              },
              {
                name: 'tituloNegrita',
                type: 'checkbox',
                label: 'Negrita',
                defaultValue: true,
                admin: { width: '33%' },
              },
              {
                name: 'tituloAlineacion',
                type: 'select',
                label: 'Alineación',
                defaultValue: 'centro',
                options: [
                  { label: 'Izquierda', value: 'izquierda' },
                  { label: 'Centro', value: 'centro' },
                  { label: 'Derecha', value: 'derecha' },
                ],
                admin: { width: '33%' },
              },
            ],
          },
          {
            name: 'tituloColor',
            type: 'text',
            label: 'Color (hex, opcional)',
            admin: { description: 'Vacío = usa el color institucional.' },
            validate: hexOpcional('Usa un color hexadecimal, ej: #0378B3'),
          },
        ],
      },
      {
        type: 'collapsible',
        label: 'Diseño de la imagen (aplica a todas)',
        admin: { initCollapsed: true },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'imagenTamano',
                type: 'number',
                label: 'Tamaño (px)',
                defaultValue: 120,
                min: 40,
                max: 300,
                admin: { width: '50%' },
              },
              {
                name: 'imagenAlineacion',
                type: 'select',
                label: 'Alineación',
                defaultValue: 'centro',
                options: [
                  { label: 'Izquierda', value: 'izquierda' },
                  { label: 'Centro', value: 'centro' },
                  { label: 'Derecha', value: 'derecha' },
                ],
                admin: { width: '50%' },
              },
            ],
          },
        ],
      },
      {
        type: 'collapsible',
        label: 'Diseño del texto (debajo de la imagen, aplica a todos)',
        admin: { initCollapsed: true },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'tamano',
                type: 'number',
                label: 'Tamaño (px)',
                defaultValue: 15,
                min: 10,
                max: 28,
                admin: { width: '34%' },
              },
              {
                name: 'negrita',
                type: 'checkbox',
                label: 'Negrita',
                defaultValue: true,
                admin: { width: '33%' },
              },
              {
                name: 'alineacion',
                type: 'select',
                label: 'Alineación',
                defaultValue: 'centro',
                options: [
                  { label: 'Izquierda', value: 'izquierda' },
                  { label: 'Centro', value: 'centro' },
                  { label: 'Derecha', value: 'derecha' },
                ],
                admin: { width: '33%' },
              },
            ],
          },
          {
            name: 'color',
            type: 'text',
            label: 'Color (hex, opcional)',
            admin: { description: 'Vacío = usa el color institucional.' },
            validate: hexOpcional('Usa un color hexadecimal, ej: #0378B3'),
          },
        ],
      },
      {
        name: 'elementos',
        type: 'array',
        label: 'Elementos',
        labels: { singular: 'Elemento', plural: 'Elementos' },
        minRows: 1,
        admin: {
          description: 'Se acomodan solos en cuadrícula — entre más agregues, más columnas ocupan.',
        },
        fields: [
          { name: 'titulo', type: 'text', label: 'Título (arriba de la imagen, opcional)' },
          { name: 'imagen', type: 'upload', relationTo: 'media', required: true, label: 'Imagen' },
          { name: 'texto', type: 'text', label: 'Texto (debajo de la imagen, opcional)' },
          {
            type: 'row',
            fields: [
              {
                name: 'enlace',
                type: 'text',
                label: 'Enlace (URL, opcional)',
                admin: { width: '50%' },
              },
              {
                name: 'archivo',
                type: 'upload',
                relationTo: 'media',
                label: 'Documento (opcional)',
                admin: {
                  width: '50%',
                  description: 'Si pones ambos, el documento tiene prioridad. Se abre en una pestaña nueva.',
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

// Tarjetas de imagen con botón — el título y el botón comparten un solo
// estilo para toda la cuadrícula (así se ven uniformes), mientras que cada
// tarjeta solo define su propio contenido. El botón puede ir a un enlace o
// abrir un panel de información (modal) armado con los mismos bloques de
// contenido — así ese panel puede tener título, párrafos, íconos, lo que
// se necesite, sin quedar limitado a un texto fijo.
const TARJETAS_IMAGEN_BLOCK: Block = {
  slug: 'tarjetas-imagen',
  labels: { singular: 'Tarjetas de imagen (con botón Ver)', plural: 'Bloques de tarjetas de imagen' },
  fields: [
    {
      type: 'collapsible',
      label: 'Diseño del título (aplica a todas las tarjetas)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'tituloTamano',
              type: 'number',
              label: 'Tamaño (px)',
              defaultValue: 18,
              min: 14,
              max: 40,
              admin: { width: '34%' },
            },
            {
              name: 'tituloNegrita',
              type: 'checkbox',
              label: 'Negrita',
              defaultValue: true,
              admin: { width: '33%' },
            },
            {
              name: 'tituloAlineacion',
              type: 'select',
              label: 'Alineación',
              defaultValue: 'izquierda',
              options: [
                { label: 'Izquierda', value: 'izquierda' },
                { label: 'Centro', value: 'centro' },
                { label: 'Derecha', value: 'derecha' },
              ],
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'tituloColor',
          type: 'text',
          label: 'Color (hex, opcional)',
          admin: { description: 'Vacío = usa el color institucional.' },
          validate: hexOpcional('Usa un color hexadecimal, ej: #0378B3'),
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Diseño del botón (aplica a todas las tarjetas)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'botonIcono',
              type: 'text',
              label: 'Ícono (opcional)',
              admin: {
                width: '50%',
                description: 'Ej: arrow-right, para la flecha de "Ver más".',
                components: { Field: '/app/(payload)/components/IconPickerField#default' },
              },
              validate: (value: unknown) => {
                if (!value) return true
                return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value))
                  ? true
                  : 'Ícono inválido, elígelo desde el buscador'
              },
            },
            {
              name: 'botonColor',
              type: 'text',
              label: 'Color (hex, opcional)',
              admin: { width: '50%', description: 'Vacío = usa el color institucional.' },
              validate: hexOpcional('Usa un color hexadecimal, ej: #0378B3'),
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'botonTamano',
              type: 'number',
              label: 'Tamaño del texto (px)',
              defaultValue: 15,
              min: 10,
              max: 28,
              admin: { width: '34%' },
            },
            {
              name: 'botonNegrita',
              type: 'checkbox',
              label: 'Negrita',
              defaultValue: true,
              admin: { width: '33%' },
            },
            {
              name: 'botonAlineacion',
              type: 'select',
              label: 'Alineación',
              defaultValue: 'izquierda',
              options: [
                { label: 'Izquierda', value: 'izquierda' },
                { label: 'Centro', value: 'centro' },
                { label: 'Derecha', value: 'derecha' },
              ],
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
    {
      name: 'tarjetas',
      type: 'array',
      label: 'Tarjetas',
      labels: { singular: 'Tarjeta', plural: 'Tarjetas' },
      minRows: 1,
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', required: true, label: 'Imagen' },
        { name: 'titulo', type: 'text', required: true, label: 'Título' },
        {
          name: 'textoBoton',
          type: 'text',
          label: 'Texto del botón',
          defaultValue: 'Ver más',
        },
        {
          name: 'accion',
          type: 'select',
          label: 'Al hacer clic en el botón',
          defaultValue: 'enlace',
          options: [
            { label: 'Ir a un enlace', value: 'enlace' },
            { label: 'Abrir panel de información (modal)', value: 'modal' },
          ],
        },
        {
          name: 'enlace',
          type: 'text',
          label: 'Enlace (URL)',
          admin: {
            condition: (_data, siblingData) => siblingData?.accion !== 'modal',
          },
          validate: (value: unknown, { siblingData }: { siblingData?: { accion?: string } }) => {
            if (siblingData?.accion !== 'modal' && !value) {
              return 'Indica un enlace, o cambia la acción a "Abrir panel de información"'
            }
            return true
          },
        },
        {
          type: 'collapsible',
          label: 'Contenido del panel de información',
          admin: {
            initCollapsed: false,
            condition: (_data, siblingData) => siblingData?.accion === 'modal',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'modalTitulo',
                  type: 'text',
                  label: 'Título del panel',
                  admin: { width: '50%', description: 'Si se deja vacío, se usa el título de la tarjeta.' },
                },
                {
                  name: 'modalImagen',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagen del panel',
                  admin: { width: '50%', description: 'Si se deja vacía, se usa la imagen de la tarjeta.' },
                },
              ],
            },
            {
              name: 'modalContenido',
              type: 'blocks',
              label: 'Contenido del panel',
              labels: { singular: 'Bloque', plural: 'Bloques' },
              admin: { initCollapsed: false },
              blocks: BLOQUES_CONTENIDO_BASE,
            },
          ],
        },
      ],
    },
  ],
}

const BLOQUES_CONTENIDO: Block[] = [...BLOQUES_CONTENIDO_BASE, TARJETAS_IMAGEN_BLOCK]

// Menú lateral de pestañas + contenido a la derecha (como en "Nuestra
// Cámara"): cada pestaña arma su propio contenido combinando los bloques
// de arriba, sin necesidad de crear una página nueva por cada una.
export const MenuConContenidoBlock: Block = {
  slug: 'menu-con-contenido',
  labels: {
    singular: 'Menú con contenido (pestañas)',
    plural: 'Bloques de menú con contenido',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Diseño del banner (aplica a todas las pestañas)',
      admin: {
        initCollapsed: true,
        description: 'Cada pestaña trae su propia imagen y texto de banner, pero todas comparten este mismo estilo — así se ven consistentes al pasar de una a otra.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'textoTamano',
              type: 'number',
              label: 'Tamaño del texto (px)',
              defaultValue: 32,
              min: 20,
              max: 90,
              admin: { width: '50%' },
            },
            {
              name: 'textoNegrita',
              type: 'checkbox',
              label: 'Texto en negrita',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'textoColor',
              type: 'text',
              label: 'Color del texto (hex)',
              admin: { width: '50%', description: 'Ej: #FFFFFF. Vacío = blanco.' },
              validate: (value: unknown) => {
                if (!value) return true
                return /^#([0-9a-fA-F]{3}){1,2}$/.test(String(value))
                  ? true
                  : 'Usa un color hexadecimal, ej: #FFFFFF'
              },
            },
            {
              name: 'textoPosicion',
              type: 'select',
              label: 'Posición del texto',
              defaultValue: 'izquierda',
              options: [
                { label: 'Izquierda (recomendado)', value: 'izquierda' },
                { label: 'Centro', value: 'centro' },
                { label: 'Derecha', value: 'derecha' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'imagenDesvanecido',
              type: 'select',
              label: 'Desvanecido de la imagen',
              defaultValue: 'suave',
              options: [
                { label: 'Sin desvanecido', value: 'ninguno' },
                { label: 'Suave (recomendado)', value: 'suave' },
                { label: 'Medio', value: 'medio' },
                { label: 'Fuerte', value: 'fuerte' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'imagenAjuste',
              type: 'select',
              label: 'Tamaño de la imagen',
              defaultValue: 'cubrir',
              options: [
                { label: 'Cubrir todo el espacio (recomendado)', value: 'cubrir' },
                { label: 'Ajustar sin recortar', value: 'contener' },
                { label: 'Tamaño original centrado', value: 'original' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Pestañas',
      labels: { singular: 'Pestaña', plural: 'Pestañas' },
      minRows: 1,
      admin: {
        description: 'Cada pestaña aparece como un ítem del menú lateral, con su propio banner arriba. La primera se muestra de entrada.',
      },
      fields: [
        {
          name: 'etiqueta',
          type: 'text',
          required: true,
          label: 'Nombre en el menú',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'bannerImagen',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen del banner de esta pestaña',
              admin: { width: '50%' },
            },
            {
              name: 'bannerTexto',
              type: 'text',
              label: 'Texto del banner de esta pestaña',
              admin: {
                width: '50%',
                description: 'Si se deja vacío, se usa el "Nombre en el menú".',
              },
            },
          ],
        },
        {
          name: 'contenido',
          type: 'blocks',
          label: 'Contenido de esta pestaña',
          labels: { singular: 'Bloque', plural: 'Bloques' },
          admin: { initCollapsed: false },
          blocks: BLOQUES_CONTENIDO,
        },
      ],
    },
  ],
}
