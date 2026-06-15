import type { CollectionConfig } from 'payload'
import { soloSuperAdmin } from '../access'
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
  },
  hooks: {
    beforeOperation: [injectTenantContext],
    beforeChange: [autoAssignTenant],
    afterChange: [auditAfterChange],   // ← agregar
    afterDelete: [auditAfterDelete],   // ← agregar
  },
  // La info del tenant (nombre, logo, colores, dominio) es pública:
  // el sitio web la necesita para resolver qué tenant servir y aplicar su marca.
  // Solo superadmin puede crear/editar/eliminar tenants.
  access: {
    read: () => true,
    create: soloSuperAdmin,
    update: soloSuperAdmin,
    delete: soloSuperAdmin,
  },
  fields: [
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
      },
    },
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
          admin: { description: 'Ej: #003366' },
        },
        {
          name: 'colorSecundario',
          type: 'text',
          label: 'Color secundario (hex)',
          defaultValue: '#0066CC',
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
        },
      ],
    },
    // ── Menú de navegación ──────────────────────────────
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
    // ── Pie de página ────────────────────────────────────
    {
      name: 'footer',
      type: 'group',
      label: 'Pie de página',
      fields: [
        {
          name: 'direccion',
          type: 'text',
          label: 'Dirección física',
        },
        {
          name: 'telefonoConmutador',
          type: 'text',
          label: 'Teléfono conmutador',
        },
        {
          name: 'lineaGratuita',
          type: 'text',
          label: 'Línea gratuita / atención al ciudadano',
        },
        {
          name: 'lineaAnticorrupcion',
          type: 'text',
          label: 'Línea anticorrupción',
        },
        {
          name: 'correoNotificaciones',
          type: 'email',
          label: 'Correo de notificaciones judiciales',
        },
        {
          name: 'horarioAtencion',
          type: 'text',
          label: 'Horario de atención',
          admin: { description: 'Ej: Lunes a viernes de 8:00 a.m. a 5:00 p.m.' },
        },
        {
          name: 'redesSociales',
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
              admin: { description: 'Ej: https://www.facebook.com/tuentidad' },
            },
          ],
        },
        {
          name: 'enlacesLegales',
          type: 'array',
          label: 'Enlaces legales',
          labels: { singular: 'Enlace legal', plural: 'Enlaces legales' },
          admin: {
            description:
              'Ej: Política de privacidad, Términos y condiciones, Mapa del sitio',
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
              admin: { description: 'Ej: /politica-privacidad' },
            },
          ],
        },
      ],
    },
    {
      name: 'activo',
      type: 'checkbox',
      label: 'Tenant activo',
      defaultValue: true,
    },
  ],
  timestamps: true,
}