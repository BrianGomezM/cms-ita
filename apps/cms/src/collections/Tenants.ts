import type { CollectionConfig } from 'payload'
import { soloSuperAdmin, publicoOSoloSuperAdmin } from '../access'
import { injectTenantContext } from '../hooks/tenantContext'
import { autoAssignTenant } from '../hooks/autoAssignTenant'
import { auditAfterChange, auditAfterDelete } from '../middleware/auditLog'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Cliente (Tenant)',
    plural: 'Clientes (Tenants)',
  },
  admin: {
    useAsTitle: 'nombre',
    group: 'Configuración',
    defaultColumns: ['nombre', 'nit', 'slug', 'activo'],
    description: 'Entidades públicas cliente del CMS',
    // Exclusivo de superadmin — ni admin_cliente ni editor/visualizador
    // deben ver "Clientes" en su menú, ni el suyo propio.
    hidden: ({ user }) => (user as { rol?: string })?.rol !== 'superadmin',
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange],   // ← agregar
    afterDelete: [auditAfterDelete],   // ← agregar
  },
  // La info del tenant (nombre, logo, colores, dominio) es pública para
  // visitantes anónimos: el sitio web la necesita sin login. Dentro del
  // panel, es exclusivo de superadmin — ni siquiera admin_cliente ve su
  // propio tenant aquí (edita su marca/logo a través de lo que superadmin
  // le habilite, no directamente en este módulo).
  access: {
    read: publicoOSoloSuperAdmin,
    create: soloSuperAdmin,
    update: soloSuperAdmin,
    delete: soloSuperAdmin,
  },
  fields: [
    // Campos identificadores fuera de las pestañas: son los que más se
    // consultan/editan de un vistazo (nombre, NIT, estado) y por eso
    // quedan visibles de inmediato en vez de escondidos en una pestaña.
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre de la entidad',
    },
    {
      name: 'nit',
      type: 'text',
      required: true,
      label: 'NIT',
      unique: true,
      admin: {
        description: 'Ej: 900316215-1',
        width: '50%',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (identificador URL)',
      admin: {
        description: 'Solo minúsculas, números y guiones. Ej: alcaldia-bogota',
        width: '50%',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      label: 'Tenant activo',
      defaultValue: true,
    },
    // Las pestañas de Apariencia/Header solo agrupan visualmente los campos
    // de siempre (`menuPrincipal`, `configuracion`, etc.) sin cambiar dónde
    // viven los datos. La pestaña Footer sí cambia de forma: es un
    // constructor de layout (filas → celdas → bloques), ver más abajo.
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Apariencia',
          admin: { description: 'Marca institucional: logo, colores y tipografía del sitio.' },
          fields: [
            {
              name: 'dominio',
              type: 'text',
              label: 'Dominio personalizado',
              admin: {
                description: 'Dominio propio si aplica. Ej: www.alcaldiabogota.gov.co',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo institucional',
            },
            {
              name: 'configuracion',
              type: 'group',
              label: 'Configuración visual',
              fields: [
                {
                  name: 'colorPrimario',
                  type: 'text',
                  label: 'Color primario (hex)',
                  defaultValue: '#003366',
                  admin: { description: 'Ej: #003366', width: '33%' },
                },
                {
                  name: 'colorSecundario',
                  type: 'text',
                  label: 'Color secundario (hex)',
                  defaultValue: '#0066CC',
                  admin: { width: '33%' },
                },
                {
                  name: 'fuente',
                  type: 'select',
                  label: 'Fuente principal',
                  defaultValue: 'inter',
                  options: [
                    { label: 'Inter', value: 'inter' },
                    { label: 'Roboto', value: 'roboto' },
                    { label: 'Open Sans', value: 'open-sans' },
                  ],
                  admin: { width: '34%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Header',
          admin: {
            description:
              'Todo lo que aparece en el encabezado del sitio: menú principal, accesos junto al buscador y el panel del botón de menú (hamburguesa).',
          },
          fields: [
            {
              name: 'menuPrincipal',
              type: 'array',
              label: 'Menú de navegación',
              labels: { singular: 'Enlace del menú', plural: 'Enlaces del menú' },
              admin: {
                description:
                  'Enlaces que aparecen en el menú principal del sitio web. Arrastra para cambiar el orden.',
              },
              fields: [
                {
                  name: 'etiqueta',
                  type: 'text',
                  required: true,
                  label: 'Texto del enlace',
                  admin: { description: 'Ej: Servicios' },
                },
                {
                  name: 'enlace',
                  type: 'text',
                  required: true,
                  label: 'Dirección',
                  admin: { description: 'Ej: /servicios o https://www.otrosito.com' },
                },
                {
                  name: 'submenu',
                  type: 'array',
                  label: 'Submenú (opcional)',
                  labels: { singular: 'Enlace del submenú', plural: 'Enlaces del submenú' },
                  admin: {
                    description: 'Enlaces que se despliegan al pasar el mouse sobre este ítem del menú',
                  },
                  fields: [
                    {
                      name: 'etiqueta',
                      type: 'text',
                      required: true,
                      label: 'Texto del enlace',
                    },
                    {
                      name: 'enlace',
                      type: 'text',
                      required: true,
                      label: 'Dirección',
                      admin: { description: 'Ej: /servicios/registro-mercantil' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'accesosRapidos',
              type: 'array',
              label: 'Accesos rápidos',
              labels: { singular: 'Acceso rápido', plural: 'Accesos rápidos' },
              admin: {
                description: 'Enlaces fijos junto al buscador.',
              },
              fields: [
                {
                  name: 'etiqueta',
                  type: 'text',
                  required: true,
                  label: 'Texto del enlace',
                },
                {
                  name: 'enlace',
                  type: 'text',
                  required: true,
                  label: 'Dirección',
                  admin: { description: 'Ej: /ley-de-transparencia' },
                },
              ],
            },
            {
              name: 'menuHamburguesa',
              type: 'group',
              label: 'Menú desplegable (botón hamburguesa)',
              fields: [
                {
                  name: 'titulo',
                  type: 'text',
                  label: 'Título del panel',
                  admin: {
                    description:
                      'Texto junto al ícono dentro del panel del menú. Si se deja vacío, se usa el nombre de la entidad.',
                  },
                },
                {
                  name: 'icono',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Ícono del panel',
                  admin: {
                    description:
                      'Ícono junto al título dentro del panel del menú. Si se deja vacío, se usa el logo institucional.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          admin: {
            description:
              'Constructor visual del pie de página: agrega columnas y elige qué tan anchas son — se acomodan solas, sin calcular filas ni sumas de 12. No hay campos especiales de "Dirección" o "PQRS" — todo el contenido visible en el footer se arma combinando bloques genéricos dentro de cada columna.',
          },
          fields: [
            // ── Constructor visual del footer ───────────────────
            // Única fuente del contenido del pie de página — sin campos
            // estructurados aparte (ver decisión: se aceptó que el bloque
            // "Contacto" de páginas y /mapa-sitio se reharán por separado
            // más adelante en vez de mantener datos duplicados aquí).
            {
              name: 'footer',
              type: 'group',
              label: 'Diseño del pie de página',
              admin: { hideGutter: true },
              fields: [
                {
                  name: 'colorFondo',
                  type: 'text',
                  label: 'Color de fondo (hex)',
                  defaultValue: '#0378B3',
                  admin: { description: 'Ej: #0378B3', width: '50%' },
                },
                {
                  name: 'anchoMaximo',
                  type: 'text',
                  label: 'Ancho máximo del contenido',
                  defaultValue: '1100px',
                  admin: { description: 'Ej: 1100px', width: '50%' },
                },
                {
                  name: 'layout',
                  type: 'group',
                  label: 'Columnas',
                  fields: [
                    {
                      name: 'vistaPrevia',
                      type: 'ui',
                      label: 'Vista previa del layout',
                      admin: {
                        components: {
                          Field: '/app/(payload)/components/FooterLayoutPreview#default',
                        },
                      },
                    },
                    {
                      name: 'columnas',
                      type: 'array',
                      label: 'Columnas del footer',
                      labels: { singular: 'Columna', plural: 'Columnas' },
                      admin: {
                        initCollapsed: false,
                        description:
                          'Agrega una columna por cada bloque de contenido que quieras mostrar (por ejemplo: "Enlaces de interés", "Contáctanos", "Síguenos"). Se acomodan solas de izquierda a derecha y pasan a una nueva línea automáticamente según su ancho — no necesitas definir filas ni sumar columnas.',
                        components: {
                          RowLabel: '/app/(payload)/components/FooterColumnaLabel#default',
                        },
                      },
                      fields: [
                        {
                          name: 'ancho',
                          type: 'select',
                          label: 'Ancho de la columna',
                          defaultValue: 'mediana',
                          options: [
                            { label: 'Pequeña (4 por línea)', value: 'pequena' },
                            { label: 'Mediana (3 por línea)', value: 'mediana' },
                            { label: 'Grande (2 por línea)', value: 'grande' },
                            { label: 'Completa (ocupa toda la línea)', value: 'completa' },
                          ],
                          admin: { width: '25%' },
                        },
                        {
                          name: 'align',
                          type: 'select',
                          label: 'Alineación horizontal',
                          defaultValue: 'left',
                          options: [
                            { label: 'Izquierda', value: 'left' },
                            { label: 'Centro', value: 'center' },
                            { label: 'Derecha', value: 'right' },
                          ],
                          admin: { width: '25%' },
                        },
                        {
                          name: 'verticalAlign',
                          type: 'select',
                          label: 'Alineación vertical',
                          defaultValue: 'top',
                          options: [
                            { label: 'Arriba', value: 'top' },
                            { label: 'Centro', value: 'center' },
                            { label: 'Abajo', value: 'bottom' },
                          ],
                          admin: { width: '25%' },
                        },
                        {
                          name: 'direccionContenido',
                          type: 'select',
                          label: 'Dirección del contenido',
                          defaultValue: 'columna',
                          options: [
                            { label: 'Vertical (apilado)', value: 'columna' },
                            { label: 'Horizontal (en línea, separado por "|")', value: 'fila' },
                          ],
                          admin: {
                            width: '25%',
                            description: 'Horizontal sirve para barras tipo "Anticorrupción | Mapa del Sitio | ..."',
                          },
                        },
                        {
                          name: 'children',
                          type: 'blocks',
                          label: 'Contenido de la columna',
                          labels: { singular: 'Bloque', plural: 'Bloques' },
                          admin: { initCollapsed: false },
                          blocks: [
                                {
                                  slug: 'texto',
                                  labels: { singular: 'Bloque: Texto', plural: 'Bloques: Texto' },
                                  fields: [
                                    {
                                      name: 'contenido',
                                      type: 'textarea',
                                      required: true,
                                      label: 'Texto',
                                      admin: {
                                        description: 'Envuelve una parte en **doble asterisco** para ponerla en negrita. Ej: **Sede Principal:** Calle 4 # 7-37 B/ Centro, Popayán',
                                      },
                                    },
                                  ],
                                },
                                {
                                  slug: 'titulo',
                                  labels: { singular: 'Bloque: Título', plural: 'Bloques: Título' },
                                  fields: [
                                    { name: 'contenido', type: 'text', required: true, label: 'Texto del título' },
                                  ],
                                },
                                {
                                  slug: 'imagen',
                                  labels: { singular: 'Bloque: Imagen (logo, sello, certificación)', plural: 'Bloques: Imagen' },
                                  fields: [
                                    {
                                      name: 'imagen',
                                      type: 'upload',
                                      relationTo: 'media',
                                      required: true,
                                      label: 'Imagen',
                                    },
                                    {
                                      name: 'ancho',
                                      type: 'number',
                                      label: 'Ancho (px)',
                                      defaultValue: 64,
                                      admin: { width: '33%' },
                                    },
                                    {
                                      name: 'alto',
                                      type: 'number',
                                      label: 'Alto (px)',
                                      defaultValue: 40,
                                      admin: { width: '33%' },
                                    },
                                    {
                                      name: 'enlace',
                                      type: 'text',
                                      label: 'Enlace (opcional)',
                                      admin: { width: '34%', description: 'Si la imagen debe ser clicable' },
                                    },
                                  ],
                                },
                                {
                                  slug: 'enlace',
                                  labels: { singular: 'Bloque: Enlace', plural: 'Bloques: Enlace' },
                                  fields: [
                                    { name: 'etiqueta', type: 'text', required: true, label: 'Texto del enlace' },
                                    {
                                      name: 'enlace',
                                      type: 'text',
                                      required: true,
                                      label: 'Dirección',
                                      admin: { description: 'Ej: /servicios, https://... , tel:018000910060' },
                                    },
                                  ],
                                },
                                {
                                  slug: 'lista-enlaces',
                                  labels: { singular: 'Bloque: Lista de enlaces', plural: 'Bloques: Lista de enlaces' },
                                  fields: [
                                    {
                                      name: 'subtitulo',
                                      type: 'text',
                                      label: 'Subtítulo (opcional)',
                                      admin: { description: 'Ej: Entidades de control' },
                                    },
                                    {
                                      name: 'enlaces',
                                      type: 'array',
                                      label: 'Enlaces',
                                      labels: { singular: 'Enlace', plural: 'Enlaces' },
                                      fields: [
                                        { name: 'etiqueta', type: 'text', required: true, label: 'Texto del enlace' },
                                        {
                                          name: 'enlace',
                                          type: 'text',
                                          required: true,
                                          label: 'Dirección',
                                          admin: { description: 'Ej: /servicios, https://..., tel:018000910060' },
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  slug: 'logos',
                                  labels: {
                                    singular: 'Bloque: Fila de logos (ej: sellos GOV.CO, ISO 9001, IQNET)',
                                    plural: 'Bloques: Fila de logos',
                                  },
                                  fields: [
                                    {
                                      name: 'logos',
                                      type: 'array',
                                      label: 'Logos',
                                      labels: { singular: 'Logo', plural: 'Logos' },
                                      fields: [
                                        {
                                          name: 'imagen',
                                          type: 'upload',
                                          relationTo: 'media',
                                          required: true,
                                          label: 'Imagen (PNG transparente recomendado)',
                                        },
                                        {
                                          name: 'ancho',
                                          type: 'number',
                                          label: 'Ancho (px)',
                                          defaultValue: 64,
                                          admin: { width: '33%' },
                                        },
                                        {
                                          name: 'alto',
                                          type: 'number',
                                          label: 'Alto (px)',
                                          defaultValue: 40,
                                          admin: { width: '33%' },
                                        },
                                        {
                                          name: 'enlace',
                                          type: 'text',
                                          label: 'Enlace (opcional)',
                                          admin: { width: '34%' },
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  slug: 'redes-sociales',
                                  labels: { singular: 'Bloque: Redes sociales', plural: 'Bloques: Redes sociales' },
                                  fields: [
                                    {
                                      name: 'redes',
                                      type: 'array',
                                      label: 'Redes sociales',
                                      labels: { singular: 'Red social', plural: 'Redes sociales' },
                                      fields: [
                                        {
                                          name: 'red',
                                          type: 'select',
                                          required: true,
                                          label: 'Red social',
                                          options: [
                                            { label: 'Facebook', value: 'facebook' },
                                            { label: 'X (Twitter)', value: 'x' },
                                            { label: 'Instagram', value: 'instagram' },
                                            { label: 'YouTube', value: 'youtube' },
                                            { label: 'LinkedIn', value: 'linkedin' },
                                            { label: 'TikTok', value: 'tiktok' },
                                            { label: 'WhatsApp', value: 'whatsapp' },
                                          ],
                                        },
                                        {
                                          name: 'url',
                                          type: 'text',
                                          required: true,
                                          label: 'Enlace al perfil',
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  slug: 'separador',
                                  labels: {
                                    singular: 'Bloque: Separador (línea horizontal)',
                                    plural: 'Bloques: Separador',
                                  },
                                  fields: [],
                                },
                                {
                                  slug: 'espaciador',
                                  labels: { singular: 'Bloque: Espaciador', plural: 'Bloques: Espaciador' },
                                  fields: [
                                    {
                                      name: 'alto',
                                      type: 'number',
                                      label: 'Alto (px)',
                                      defaultValue: 16,
                                    },
                                  ],
                                },
                                {
                                  slug: 'html',
                                  labels: {
                                    singular: 'Bloque: HTML (avanzado)',
                                    plural: 'Bloques: HTML',
                                  },
                                  fields: [
                                    {
                                      name: 'contenido',
                                      type: 'code',
                                      required: true,
                                      label: 'Código HTML',
                                      admin: {
                                        description: 'Se inserta tal cual en la página — úsalo con cuidado.',
                                        language: 'html',
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}