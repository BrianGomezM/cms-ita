// Script de seed: importa los ítems ITA a la BD
// Ejecutar con: pnpm seed:ita
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const ITEMS_ITA = [
  // 1. ACCESIBILIDAD WEB
  { idPregunta: 2620, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'a. ¿Los elementos no textuales (imágenes, diagramas, mapas, sonidos, etc.) tienen texto alternativo?' },
  { idPregunta: 2621, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'b. ¿Los videos o elementos multimedia tienen subtítulos, audio descripción y guion en texto?' },
  { idPregunta: 2622, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'c. ¿El texto es de mínimo 12 puntos, con contraste adecuado y ampliable al 200%?' },
  { idPregunta: 2623, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'd. ¿El código está ordenado, con lenguaje de marcado bien utilizado, estructura organizada e identificación coherente de enlaces, incluyendo buscador?' },
  { idPregunta: 2624, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'e. ¿Los formularios tienen advertencias e instrucciones claras con varios canales sensoriales?' },
  { idPregunta: 2625, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'f. ¿La navegación con tabulación se hace en orden adecuado resaltando la información seleccionada?' },
  { idPregunta: 2626, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'g. ¿Se permite control de contenidos con movimientos, parpadeo y eventos temporizados?' },
  { idPregunta: 2627, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'h. ¿El lenguaje de títulos, páginas, enlaces, mensajes de error y campos de formularios es en español claro?' },
  { idPregunta: 2628, categoria: '1-accesibilidad', subcategoria: '1.1. Directrices de Accesibilidad Web', pregunta: 'i. ¿Los documentos (Word, Excel, PDF, PowerPoint) cumplen con los criterios de accesibilidad del Anexo 1?' },
  // 2. IDENTIDAD VISUAL
  { idPregunta: 2629, categoria: '2-identidad-visual', subcategoria: '2.1. Top Bar (GOV.CO)', pregunta: 'a. ¿El sitio tiene barra superior (Top Bar) que redireccione al Portal Único del Estado GOV.CO?' },
  { idPregunta: 2712, categoria: '2-identidad-visual', subcategoria: '2.2. Footer o pie de página', pregunta: '¿El sitio incluye footer con todos los ítems requeridos?' },
  { idPregunta: 2713, categoria: '2-identidad-visual', subcategoria: '2.2. Footer o pie de página', pregunta: 'a. ¿El footer incluye imagen del Portal GOV.CO y logo de la marca país CO - Colombia?' },
  { idPregunta: 2714, categoria: '2-identidad-visual', subcategoria: '2.2. Footer o pie de página', pregunta: 'b. ¿El footer incluye nombre de la entidad y dirección?' },
  { idPregunta: 2715, categoria: '2-identidad-visual', subcategoria: '2.2. Footer o pie de página', pregunta: 'c. ¿El footer incluye vínculo a redes sociales?' },
  { idPregunta: 2717, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'a. ¿El footer incluye teléfono conmutador?' },
  { idPregunta: 2718, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'b. ¿El footer incluye línea gratuita o línea de servicio al ciudadano?' },
  { idPregunta: 2719, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'c. ¿El footer incluye línea anticorrupción?' },
  { idPregunta: 2720, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'd. ¿El footer incluye canales físicos y electrónicos para atención al ciudadano?' },
  { idPregunta: 2721, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'e. ¿El footer incluye correo de notificaciones judiciales?' },
  { idPregunta: 2722, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'f. ¿El footer incluye enlace al mapa del sitio?' },
  { idPregunta: 2723, categoria: '2-identidad-visual', subcategoria: '2.2. Footer - Datos de Contacto', pregunta: 'g. ¿El footer incluye enlace a políticas de privacidad y seguridad?' },
  // 3. INFORMACIÓN DE LA ENTIDAD
  { idPregunta: 2792, categoria: '3-informacion-entidad', subcategoria: '3.1. Políticas y condiciones de uso', pregunta: 'a. ¿El sitio publica términos y condiciones?' },
  { idPregunta: 2793, categoria: '3-informacion-entidad', subcategoria: '3.1. Políticas y condiciones de uso', pregunta: 'b. ¿El sitio publica política de privacidad y tratamiento de datos personales?' },
  { idPregunta: 2794, categoria: '3-informacion-entidad', subcategoria: '3.1. Políticas y condiciones de uso', pregunta: 'c. ¿El sitio publica política de seguridad de la información?' },
  { idPregunta: 2795, categoria: '3-informacion-entidad', subcategoria: '3.2. Misión y visión', pregunta: '¿El sitio web publica la misión de la entidad?' },
  { idPregunta: 2796, categoria: '3-informacion-entidad', subcategoria: '3.2. Misión y visión', pregunta: '¿El sitio web publica la visión de la entidad?' },
  { idPregunta: 2797, categoria: '3-informacion-entidad', subcategoria: '3.3. Estructura orgánica', pregunta: '¿El sitio publica el organigrama o estructura orgánica actualizada?' },
  // 4. NORMATIVA
  { idPregunta: 2830, categoria: '4-normativa', subcategoria: '4.1. Normativa vigente', pregunta: '¿El sitio publica las normas que rigen a la entidad (leyes, decretos, resoluciones, circulares)?' },
  { idPregunta: 2831, categoria: '4-normativa', subcategoria: '4.1. Normativa vigente', pregunta: '¿Las normas publicadas están vigentes y actualizadas?' },
  // 5. CONTRATACIÓN
  { idPregunta: 2850, categoria: '5-contratacion', subcategoria: '5.1. SECOP', pregunta: '¿Los procesos contractuales están publicados en el SECOP I o SECOP II?' },
  { idPregunta: 2851, categoria: '5-contratacion', subcategoria: '5.1. SECOP', pregunta: '¿El sitio web tiene enlace directo al SECOP con los procesos de la entidad?' },
  // 6. PLANEACIÓN
  { idPregunta: 2870, categoria: '6-planeacion', subcategoria: '6.1. Plan de acción', pregunta: '¿El sitio publica el plan de acción anual de la entidad?' },
  { idPregunta: 2871, categoria: '6-planeacion', subcategoria: '6.1. Plan de acción', pregunta: '¿El plan de acción publicado está actualizado al año en curso?' },
  // 7. TRÁMITES
  { idPregunta: 2900, categoria: '7-tramites', subcategoria: '7.1. Información de trámites', pregunta: '¿El sitio publica la información de los trámites que ofrece la entidad?' },
  { idPregunta: 2901, categoria: '7-tramites', subcategoria: '7.1. Información de trámites', pregunta: '¿Los trámites están registrados en el SUIT?' },
  // 8. PARTICIPA
  { idPregunta: 2930, categoria: '8-participa', subcategoria: '8.1. Participación ciudadana', pregunta: '¿El sitio tiene sección de participación ciudadana?' },
  { idPregunta: 2931, categoria: '8-participa', subcategoria: '8.1. Participación ciudadana', pregunta: '¿Se publican las consultas ciudadanas o mecanismos de participación activos?' },
  // 9. DATOS ABIERTOS
  { idPregunta: 2960, categoria: '9-datos-abiertos', subcategoria: '9.1. Publicación de datos', pregunta: '¿El sitio publica conjuntos de datos abiertos en datos.gov.co?' },
  { idPregunta: 2961, categoria: '9-datos-abiertos', subcategoria: '9.1. Publicación de datos', pregunta: '¿Los datos publicados tienen licencia abierta?' },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Iniciando seed del Checklist ITA...')
  console.log(`📋 Total ítems a insertar: ${ITEMS_ITA.length}`)

  const tenants = await payload.find({ collection: 'tenants', limit: 1 })
  if (tenants.docs.length === 0) {
    console.error('❌ No hay tenants. Crea uno primero en el panel.')
    process.exit(1)
  }

  const tenantId = tenants.docs[0].id
  console.log(`🏢 Tenant: ${(tenants.docs[0] as any).nombre}`)

  let creados = 0
  let errores = 0

  for (const item of ITEMS_ITA) {
    try {
      await payload.create({
        collection: 'ita-checklist',
        data: {
          ...item,
          cumplimiento: 'pendiente',
          observacion: '',
          urlEvidencia: '',
          tenant: tenantId,
        } as any,
      })
      creados++
      process.stdout.write(`\r✅ ${creados}/${ITEMS_ITA.length}`)
    } catch (err) {
      console.error(`\n❌ Error ítem ${item.idPregunta}:`, err)
      errores++
    }
  }

  console.log(`\n\n🎉 Seed completado: ${creados} creados, ${errores} errores`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})