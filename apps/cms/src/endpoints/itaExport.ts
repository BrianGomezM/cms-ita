import type { Endpoint, PayloadRequest } from 'payload'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
import { CATEGORIAS_ITA } from '../collections/ITAChecklist'

const ETIQUETAS_CUMPLIMIENTO: Record<string, string> = {
  si: 'Sí cumple',
  no: 'No cumple',
  na: 'No aplica',
  pendiente: 'Pendiente',
}

type UserWithRole = {
  rol?: 'superadmin' | 'admin_cliente' | 'editor' | 'visualizador'
  tenant?: number | { id: number }
}

// Checklist ITA es exclusivo de superadmin (ver collections/ITAChecklist.ts)
// — solo superadmin puede exportar su reporte, de cualquier tenant.
function resolverTenantAutorizado(req: PayloadRequest, tenantParam?: string | string[]): number | null {
  const user = req.user as UserWithRole | null
  if (!user || user.rol !== 'superadmin') return null

  const tenantId = Array.isArray(tenantParam) ? tenantParam[0] : tenantParam
  return tenantId ? Number(tenantId) : null
}

async function obtenerDatosReporte(req: PayloadRequest, tenantId: number) {
  const [{ docs: items }, tenant] = await Promise.all([
    req.payload.find({
      collection: 'ita-checklist',
      where: { tenant: { equals: tenantId } },
      limit: 500,
      depth: 0,
      sort: 'idPregunta',
      overrideAccess: true,
    }),
    req.payload.findByID({ collection: 'tenants', id: tenantId, overrideAccess: true }).catch(() => null),
  ])

  const porCategoria = CATEGORIAS_ITA.map((cat) => {
    const catItems = items.filter((i: any) => i.categoria === cat.value)
    const total = catItems.length
    const cumple = catItems.filter((i: any) => i.cumplimiento === 'si').length
    const noAplica = catItems.filter((i: any) => i.cumplimiento === 'na').length
    const aplicables = total - noAplica
    return {
      ...cat,
      total,
      cumple,
      noCumple: catItems.filter((i: any) => i.cumplimiento === 'no').length,
      pendiente: catItems.filter((i: any) => i.cumplimiento === 'pendiente').length,
      noAplica,
      porcentaje: aplicables > 0 ? Math.round((cumple / aplicables) * 100) : 0,
    }
  })

  const total = items.length
  const cumple = items.filter((i: any) => i.cumplimiento === 'si').length
  const noAplica = items.filter((i: any) => i.cumplimiento === 'na').length
  const aplicables = total - noAplica

  return {
    nombreTenant: (tenant as any)?.nombre ?? 'Entidad',
    items,
    porCategoria,
    resumen: {
      total,
      cumple,
      aplicables,
      porcentaje: aplicables > 0 ? Math.round((cumple / aplicables) * 100) : 0,
    },
  }
}

export const itaExportExcel: Endpoint = {
  path: '/export/excel',
  method: 'get',
  handler: async (req) => {
    const tenantId = resolverTenantAutorizado(req, req.query?.tenant as string | string[] | undefined)
    if (!tenantId) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { nombreTenant, items, porCategoria, resumen } = await obtenerDatosReporte(req, tenantId)

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'CMS ITA'
    workbook.created = new Date()

    // ── Hoja resumen ──
    const resumenSheet = workbook.addWorksheet('Resumen')
    resumenSheet.columns = [
      { header: 'Categoría', key: 'nombre', width: 40 },
      { header: 'Total ítems', key: 'total', width: 12 },
      { header: 'Cumple', key: 'cumple', width: 10 },
      { header: 'No cumple', key: 'noCumple', width: 10 },
      { header: 'Pendiente', key: 'pendiente', width: 10 },
      { header: 'No aplica', key: 'noAplica', width: 10 },
      { header: '% Cumplimiento', key: 'porcentaje', width: 16 },
    ]
    resumenSheet.getRow(1).font = { bold: true }
    resumenSheet.addRow({})
    porCategoria.forEach((cat) => {
      resumenSheet.addRow({
        nombre: cat.label,
        total: cat.total,
        cumple: cat.cumple,
        noCumple: cat.noCumple,
        pendiente: cat.pendiente,
        noAplica: cat.noAplica,
        porcentaje: `${cat.porcentaje}%`,
      })
    })
    resumenSheet.addRow({})
    const filaTotal = resumenSheet.addRow({
      nombre: `TOTAL — ${nombreTenant}`,
      total: resumen.total,
      porcentaje: `${resumen.porcentaje}%`,
    })
    filaTotal.font = { bold: true }

    // ── Hoja detalle ──
    const detalleSheet = workbook.addWorksheet('Detalle')
    detalleSheet.columns = [
      { header: 'ID', key: 'idPregunta', width: 6 },
      { header: 'Categoría', key: 'categoria', width: 30 },
      { header: 'Subcategoría', key: 'subcategoria', width: 25 },
      { header: 'Pregunta', key: 'pregunta', width: 60 },
      { header: 'Cumplimiento', key: 'cumplimiento', width: 14 },
      { header: 'Observación', key: 'observacion', width: 40 },
      { header: 'URL evidencia', key: 'urlEvidencia', width: 30 },
      { header: 'Fecha verificación', key: 'fechaVerificacion', width: 16 },
    ]
    detalleSheet.getRow(1).font = { bold: true }

    const categoriaPorValor = Object.fromEntries(CATEGORIAS_ITA.map((c) => [c.value, c.label]))
    items.forEach((item: any) => {
      detalleSheet.addRow({
        idPregunta: item.idPregunta,
        categoria: categoriaPorValor[item.categoria] ?? item.categoria,
        subcategoria: item.subcategoria ?? '',
        pregunta: item.pregunta,
        cumplimiento: ETIQUETAS_CUMPLIMIENTO[item.cumplimiento] ?? item.cumplimiento,
        observacion: item.observacion ?? '',
        urlEvidencia: item.urlEvidencia ?? '',
        fechaVerificacion: item.fechaVerificacion
          ? new Date(item.fechaVerificacion).toLocaleDateString('es-CO')
          : '',
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const fecha = new Date().toISOString().slice(0, 10)

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reporte-ita-${fecha}.xlsx"`,
      },
    })
  },
}

export const itaExportPdf: Endpoint = {
  path: '/export/pdf',
  method: 'get',
  handler: async (req) => {
    const tenantId = resolverTenantAutorizado(req, req.query?.tenant as string | string[] | undefined)
    if (!tenantId) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { nombreTenant, porCategoria, resumen } = await obtenerDatosReporte(req, tenantId)

    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))

    const finished = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
    })

    doc.fontSize(18).font('Helvetica-Bold').text('Índice de Transparencia y Acceso a la Información', { align: 'center' })
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Resolución MinTIC 1519', { align: 'center' })
    doc.moveDown(1)

    doc.fillColor('#000').fontSize(13).font('Helvetica-Bold').text(nombreTenant)
    doc.fontSize(10).font('Helvetica').text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`)
    doc.moveDown(0.5)
    doc.fontSize(12).font('Helvetica-Bold')
      .text(`Cumplimiento general: ${resumen.porcentaje}%  (${resumen.cumple} de ${resumen.aplicables} ítems aplicables)`)
    doc.moveDown(1)

    doc.fontSize(13).font('Helvetica-Bold').text('Cumplimiento por categoría')
    doc.moveDown(0.5)

    const colX = { nombre: 50, total: 290, cumple: 330, noCumple: 370, pend: 415, na: 460, pct: 500 }
    doc.fontSize(8).font('Helvetica-Bold')
    doc.text('Categoría', colX.nombre, doc.y, { width: 230 })
    doc.text('Total', colX.total, doc.y - doc.heightOfString('Categoría'), { width: 35 })
    const headerY = doc.y
    doc.text('Sí', colX.cumple, headerY - doc.heightOfString('Categoría'), { width: 35 })
    doc.text('No', colX.noCumple, headerY - doc.heightOfString('Categoría'), { width: 35 })
    doc.text('Pend.', colX.pend, headerY - doc.heightOfString('Categoría'), { width: 40 })
    doc.text('N/A', colX.na, headerY - doc.heightOfString('Categoría'), { width: 35 })
    doc.text('%', colX.pct, headerY - doc.heightOfString('Categoría'), { width: 40 })
    doc.moveDown(0.3)
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke()
    doc.moveDown(0.3)

    doc.font('Helvetica').fontSize(8)
    porCategoria.forEach((cat) => {
      const y = doc.y
      doc.text(cat.label, colX.nombre, y, { width: 230 })
      doc.text(String(cat.total), colX.total, y, { width: 35 })
      doc.text(String(cat.cumple), colX.cumple, y, { width: 35 })
      doc.text(String(cat.noCumple), colX.noCumple, y, { width: 35 })
      doc.text(String(cat.pendiente), colX.pend, y, { width: 40 })
      doc.text(String(cat.noAplica), colX.na, y, { width: 35 })
      doc.text(`${cat.porcentaje}%`, colX.pct, y, { width: 40 })
      doc.moveDown(0.4)
    })

    doc.end()
    const buffer = await finished
    const fecha = new Date().toISOString().slice(0, 10)

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-ita-${fecha}.pdf"`,
      },
    })
  },
}
