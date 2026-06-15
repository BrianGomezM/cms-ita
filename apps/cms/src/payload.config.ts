import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ITAChecklist } from './collections/ITAChecklist'
import { ContactMessages } from './collections/ContactMessages'
import { Noticias } from './collections/Noticias'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— CMS ITA',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: {
      Component: '/app/(payload)/components/CustomAvatar#default',
    },
    livePreview: {
      collections: ['pages'],
      breakpoints: [
        { name: 'mobile', label: 'Móvil', width: 375, height: 720 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Escritorio', width: 1440, height: 900 },
      ],
      url: ({ data }) => {
        const tenantId = typeof data?.tenant === 'object' ? data?.tenant?.id : data?.tenant
        return `${process.env.NEXT_PUBLIC_SITE_URL}/preview/${data?.slug || ''}?tenant=${tenantId ?? ''}`
      },
    },
    components: {
  views: {
    dashboardITA: {
      Component: '/app/(payload)/views/DashboardITA/index#default',
      path: '/dashboard-ita',
    },
  },
  afterNavLinks: [
    '/app/(payload)/components/NavLinkITA#default',
  ],
  beforeDashboard: [
    '/app/(payload)/components/AccesosDirectos#default',
  ],
},
  },

  collections: [
    Tenants,
    Users,
    Media,
    Pages,
    ITAChecklist,
    ContactMessages,
    Noticias,
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { en, es },
  },
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
  sharp,
  plugins: [],
})