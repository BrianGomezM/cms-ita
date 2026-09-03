// Antes de crear un archivo en Media, arma el `prefix` que inyecta
// @payloadcms/storage-s3 combinando el tenant dueño del archivo con la
// carpeta elegida por el editor. Así cada archivo queda físicamente
// organizado en MinIO (y en Documentos_cms/minio en disco) como
// <slug-del-tenant>/<carpeta>/nombre-archivo.ext, en vez de mezclar
// todos los clientes en las mismas carpetas planas.
import type { CollectionBeforeOperationHook } from 'payload'

export const setUploadPrefix: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation === 'create') {
    const data = args.data as Record<string, unknown> | undefined
    const carpeta = (data?.carpeta as string | undefined) || 'general'

    const user = req.user as { rol?: string; tenant?: number | { id: number } } | undefined
    const tenantId =
      (data?.tenant as number | undefined) ??
      (typeof user?.tenant === 'object' ? user.tenant?.id : user?.tenant)

    let tenantSlug = 'sin-tenant'
    if (tenantId) {
      try {
        const tenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantId,
          depth: 0,
        })
        tenantSlug = (tenant?.slug as string | undefined) || tenantSlug
      } catch {
        // Si la consulta falla, el archivo cae en "sin-tenant" en vez de
        // bloquear la subida.
      }
    }

    args.data = { ...args.data, prefix: `${tenantSlug}/${carpeta}` } as typeof args.data
  }
  return args
}
