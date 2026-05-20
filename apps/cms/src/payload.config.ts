import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ITAChecklist } from './collections/ITAChecklist'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— CMS ITA',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Tenants,
    Users,
    Media,
    Pages,
    ITAChecklist,
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
  },

  // Permitir peticiones desde el frontend
  cors: [
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ],

  csrf: [
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ],

  sharp,
  plugins: [],
})