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

  return <PreviewBlockRenderer blocks={data.layout} tenant={tenant} />
}
