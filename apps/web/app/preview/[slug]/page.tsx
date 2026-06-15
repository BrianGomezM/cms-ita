import { getPageBySlug, getTenantById, getCurrentTenant } from '@/lib/payload'
import PreviewClient from '@/components/PreviewClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tenant?: string }>
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { tenant: tenantParam } = await searchParams

  const tenant = tenantParam
    ? await getTenantById(Number(tenantParam))
    : await getCurrentTenant()

  const page = tenant
    ? await getPageBySlug(slug, { draft: true, tenantId: tenant.id })
    : null

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <p className="text-gray-600">
          Guarda la página al menos una vez (puede ser como Borrador) para generar la vista previa.
        </p>
      </div>
    )
  }

  return (
    <>
      <Header tenant={tenant ?? undefined} />
      <main className="flex-1">
        <PreviewClient initialPage={page} tenant={tenant ?? undefined} />
      </main>
      <Footer tenant={tenant ?? undefined} />
    </>
  )
}
