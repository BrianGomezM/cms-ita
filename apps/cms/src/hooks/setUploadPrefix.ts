// Antes de crear un archivo en Media, copia la carpeta elegida por el editor
// al campo `prefix` que inyecta @payloadcms/storage-s3. Así el archivo queda
// físicamente organizado en MinIO como carpeta/nombre-archivo.ext en vez de
// quedar todo suelto en la raíz del bucket.
import type { CollectionBeforeOperationHook } from 'payload'

export const setUploadPrefix: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation === 'create') {
    const carpeta = (args.data as Record<string, unknown> | undefined)?.carpeta as
      | string
      | undefined
    args.data = { ...args.data, prefix: carpeta || 'general' }
  }
  return args
}
