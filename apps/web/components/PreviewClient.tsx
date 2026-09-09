'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLivePreview } from '@payloadcms/live-preview-react'
import PreviewBlockRenderer from '@/components/PreviewBlockRenderer'
import type { Block, Tenant } from '@/lib/types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

type PreviewData = {
  layout: Block[]
  [key: string]: unknown
}

export default function PreviewClient({
  initialPage,
  tenant,
}: {
  initialPage: PreviewData
  tenant?: Tenant
}) {
  const router = useRouter()
  const { data } = useLivePreview<PreviewData>({
    initialData: initialPage,
    serverURL: CMS_URL,
    depth: 2,
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'payload-refresh') {
        router.refresh()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [router])

  // Deja un rastro del tenant que se está previsualizando: si el editor
  // navega por el menú/footer/enlaces hacia otra página (que ya no vive bajo
  // /preview/[slug]), getCurrentTenant() usa esta cookie como respaldo en
  // vez de fallar porque el host local no coincide con ningún tenant.
  useEffect(() => {
    if (!tenant?.slug) return
    document.cookie = `preview-tenant=${tenant.slug}; path=/; max-age=7200; samesite=lax`
  }, [tenant?.slug])

  return <PreviewBlockRenderer blocks={data.layout} tenant={tenant} />
}
