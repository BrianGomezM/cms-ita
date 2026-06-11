// Script de seed: importa los 266 ítems del Checklist ITA (Resolución MinTIC 1519)
// Datos extraídos de consultaMatrizDetallada.xlsx
// Ejecutar con: pnpm seed:ita
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import itemsData from './ita-items-2025.json'

// NIT del caso de referencia (Empresa Caucana de Servicios S.A. — 100/100 puntos, periodo 2025)
// A este tenant se le carga el cumplimiento real + URLs de evidencia del Excel.
// Los demás tenants reciben el catálogo de 266 ítems en estado "Pendiente".
const NIT_REFERENCIA = '900316215'

type ItemITA = {
  idPregunta: number
  categoria: string
  subcategoria: string | null
  pregunta: string
  explicacion: string | null
  cumplimiento: 'si' | 'no' | 'na'
  urlEvidencia: string | null
}

async function seed() {
  const payload = await getPayload({ config })
  const items = itemsData as ItemITA[]

  console.log('🌱 Seed del Checklist ITA — Resolución MinTIC 1519')
  console.log(`📋 Ítems en el catálogo: ${items.length}`)

  const tenants = await payload.find({ collection: 'tenants', limit: 100 })
  if (tenants.docs.length === 0) {
    console.error('❌ No hay tenants. Crea uno primero en el panel.')
    process.exit(1)
  }

  for (const tenant of tenants.docs) {
    const tenantId = tenant.id
    const nombre = (tenant as any).nombre
    const nit = (tenant as any).nit as string | undefined
    const esReferencia = !!nit?.startsWith(NIT_REFERENCIA)

    console.log(`\n🏢 ${nombre}${esReferencia ? ' — caso de referencia (100/100, periodo 2025)' : ''}`)

    // Evita duplicar si el tenant ya tiene su checklist cargado
    const existentes = await payload.find({
      collection: 'ita-checklist',
      where: { tenant: { equals: tenantId } },
      limit: 1,
    })
    if (existentes.totalDocs > 0) {
      console.log('   ⏭️  Ya tiene checklist ITA, se omite.')
      continue
    }

    let creados = 0
    let errores = 0

    for (const item of items) {
      try {
        await payload.create({
          collection: 'ita-checklist',
          data: {
            idPregunta: item.idPregunta,
            categoria: item.categoria,
            subcategoria: item.subcategoria ?? '',
            pregunta: item.pregunta,
            explicacion: item.explicacion ?? '',
            cumplimiento: esReferencia ? item.cumplimiento : 'pendiente',
            observacion: '',
            urlEvidencia: esReferencia ? (item.urlEvidencia ?? '') : '',
            fechaVerificacion: esReferencia ? '2025-08-29' : null,
            tenant: tenantId,
          } as any,
        })
        creados++
        process.stdout.write(`\r   ✅ ${creados}/${items.length}`)
      } catch (err) {
        errores++
        console.error(`\n   ❌ Error ítem ${item.idPregunta}:`, err)
      }
    }
    console.log(`\n   🎉 ${creados} creados, ${errores} errores`)
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})
