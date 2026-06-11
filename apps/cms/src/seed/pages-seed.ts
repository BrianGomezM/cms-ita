// Script de seed: crea las páginas base del sitio institucional
// (Nosotros, Trámites, Contratación, Transparencia, Participa, Datos abiertos)
// para el tenant "Cámara de Comercio del Cauca", usando los bloques de contenido
// disponibles en el constructor de páginas. El contenido es de ejemplo/plantilla
// y debe ser editado por la entidad desde el panel.
// Ejecutar con: pnpm seed:pages
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const TENANT_SLUG = 'camara-comercio-cauca'

function parrafo(texto: string) {
  return {
    root: {
      type: 'root',
      children: texto.split('\n\n').map((p) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seed de páginas institucionales')

  const tenants = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: TENANT_SLUG } },
    limit: 1,
  })

  if (tenants.docs.length === 0) {
    console.error(`❌ No se encontró el tenant "${TENANT_SLUG}".`)
    process.exit(1)
  }

  const tenant = tenants.docs[0]
  const tenantId = tenant.id
  console.log(`🏢 Tenant: ${(tenant as any).nombre} (id: ${tenantId})`)

  const paginas: Array<{
    titulo: string
    slug: string
    descripcion: string
    layout: any[]
  }> = [
    {
      titulo: 'Nosotros',
      slug: 'nosotros',
      descripcion: 'Conoce la misión, visión y trayectoria de la entidad.',
      layout: [
        {
          blockType: 'rich-text',
          ancho: 'normal',
          contenido: parrafo(
            'La Cámara de Comercio del Cauca es una entidad privada sin ánimo de lucro que cumple funciones públicas delegadas por el Estado, encargada del registro mercantil, el registro de proponentes y otros registros públicos en su jurisdicción.\n\nNuestra misión es promover el desarrollo empresarial, la formalización y la competitividad de la región, brindando servicios registrales, de información y de articulación institucional con altos estándares de calidad y transparencia.\n\nEdita este texto desde el panel para incluir la información oficial de misión, visión, objetivos institucionales y datos de contacto de la entidad.',
          ),
        },
        {
          blockType: 'timeline',
          titulo: 'Nuestra historia',
          descripcion: 'Edita estos hitos con la información real de la entidad.',
          items: [
            {
              fecha: 'Hito 1',
              titulo: 'Creación de la entidad',
              descripcion: 'Reemplaza este texto con la fecha y descripción real de fundación.',
            },
            {
              fecha: 'Hito 2',
              titulo: 'Modernización de servicios registrales',
              descripcion: 'Reemplaza este texto con un hito relevante de la entidad.',
            },
            {
              fecha: 'Hito 3',
              titulo: 'Fortalecimiento de la transparencia y gobierno digital',
              descripcion: 'Reemplaza este texto con un hito relevante de la entidad.',
            },
          ],
        },
      ],
    },
    {
      titulo: 'Trámites',
      slug: 'tramites',
      descripcion: 'Trámites y servicios disponibles para los usuarios.',
      layout: [
        {
          blockType: 'tramite',
          titulo: 'Trámites y servicios',
          descripcion: 'Consulta los trámites disponibles, su modalidad y tiempos de respuesta.',
          items: [
            {
              nombre: 'Renovación del registro mercantil',
              descripcion: 'Renueva la matrícula mercantil de tu empresa o establecimiento de comercio.',
              tipo: 'virtual',
              tiempoRespuesta: 'Inmediato',
              costo: 'Según tarifas vigentes',
              enlace: '#',
            },
            {
              nombre: 'Certificado de existencia y representación legal',
              descripcion: 'Obtén el certificado que acredita la existencia y representación legal de tu empresa.',
              tipo: 'virtual',
              tiempoRespuesta: 'Inmediato',
              costo: 'Según tarifas vigentes',
              enlace: '#',
            },
            {
              nombre: 'Inscripción de libros de comercio',
              descripcion: 'Registra los libros contables y de actas exigidos por la ley.',
              tipo: 'mixto',
              tiempoRespuesta: '1 a 3 días hábiles',
              costo: 'Según tarifas vigentes',
              enlace: '#',
            },
          ],
        },
      ],
    },
    {
      titulo: 'Contratación',
      slug: 'contratacion',
      descripcion: 'Procesos de contratación abiertos, en evaluación y adjudicados.',
      layout: [
        {
          blockType: 'contrata',
          titulo: 'Procesos de contratación',
          descripcion: 'Edita esta lista con los procesos reales de contratación de la entidad.',
          items: [
            {
              nombre: 'Adquisición de equipos de cómputo',
              modalidad: 'minima-cuantia',
              estado: 'abierto',
              valor: 'Por definir',
              enlaceSecop: 'https://www.colombiacompra.gov.co/secop/busqueda',
            },
            {
              nombre: 'Servicio de mantenimiento de infraestructura',
              modalidad: 'seleccion-abreviada',
              estado: 'evaluacion',
              valor: 'Por definir',
              enlaceSecop: 'https://www.colombiacompra.gov.co/secop/busqueda',
            },
          ],
        },
      ],
    },
    {
      titulo: 'Transparencia y acceso a la información',
      slug: 'transparencia',
      descripcion: 'Índice de Transparencia y Acceso a la Información Pública (ITA), normativa y reportes.',
      layout: [
        {
          blockType: 'ita-banner',
        },
        {
          blockType: 'accordion-faq',
          titulo: 'Preguntas frecuentes sobre transparencia',
          descripcion: 'Edita estas preguntas con la información de tu entidad.',
          items: [
            {
              pregunta: '¿Qué es el Índice de Transparencia y Acceso a la Información (ITA)?',
              respuesta:
                'Es un instrumento de medición del cumplimiento de la Ley de Transparencia (Ley 1712 de 2014) y la Resolución MinTIC 1519 de 2020, que evalúa la disponibilidad y calidad de la información publicada por las entidades.',
            },
            {
              pregunta: '¿Cómo puedo solicitar información pública a la entidad?',
              respuesta:
                'Puedes presentar tu solicitud a través del mecanismo de Participa (PQRSD) disponible en el sitio web, o de forma presencial en nuestras oficinas.',
            },
            {
              pregunta: '¿Dónde se publican los documentos normativos y reportes de gestión?',
              respuesta:
                'Los documentos normativos, informes de gestión y reportes se publican en esta sección. Edita este bloque para enlazar los documentos oficiales vigentes.',
            },
          ],
        },
      ],
    },
    {
      titulo: 'Participa',
      slug: 'participa',
      descripcion: 'Mecanismos de participación ciudadana, PQRSD y rendición de cuentas.',
      layout: [
        {
          blockType: 'participa',
          titulo: 'Participa',
          descripcion: 'Conoce los mecanismos de participación ciudadana de la entidad.',
          items: [
            {
              titulo: 'Peticiones, quejas, reclamos, sugerencias y denuncias (PQRSD)',
              descripcion: 'Radica tus solicitudes y haz seguimiento a su respuesta.',
              tipoMecanismo: 'pqrsd',
              enlace: '#',
            },
            {
              titulo: 'Encuesta de satisfacción ciudadana',
              descripcion: 'Comparte tu opinión sobre los servicios de la entidad.',
              tipoMecanismo: 'encuesta',
              enlace: '#',
            },
            {
              titulo: 'Rendición de cuentas',
              descripcion: 'Consulta los informes y participa en los espacios de rendición de cuentas.',
              tipoMecanismo: 'rendicion-cuentas',
              enlace: '#',
            },
          ],
        },
      ],
    },
    {
      titulo: 'Datos abiertos',
      slug: 'datos-abiertos',
      descripcion: 'Conjuntos de datos abiertos publicados por la entidad.',
      layout: [
        {
          blockType: 'datos-abiertos',
          titulo: 'Datos abiertos',
          descripcion: 'Edita esta lista con los conjuntos de datos reales publicados por la entidad.',
          items: [
            {
              nombre: 'Empresas registradas',
              descripcion: 'Listado de empresas con matrícula mercantil activa.',
              formato: 'csv',
              enlaceDescarga: '#',
              enlaceCatalogo: 'https://www.datos.gov.co',
            },
            {
              nombre: 'Procesos de contratación',
              descripcion: 'Histórico de procesos de contratación de la entidad.',
              formato: 'xlsx',
              enlaceDescarga: '#',
              enlaceCatalogo: 'https://www.datos.gov.co',
            },
          ],
        },
      ],
    },
  ]

  for (const pagina of paginas) {
    const existente = await payload.find({
      collection: 'pages',
      where: {
        and: [{ tenant: { equals: tenantId } }, { slug: { equals: pagina.slug } }],
      },
      limit: 1,
    })

    if (existente.docs.length > 0) {
      console.log(`⏭️  Ya existe: /${pagina.slug}`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        titulo: pagina.titulo,
        slug: pagina.slug,
        descripcion: pagina.descripcion,
        tenant: tenantId,
        estado: 'publicado',
        layout: pagina.layout,
      },
    })
    console.log(`✅ Creada: /${pagina.slug}`)
  }

  // Actualiza el menú principal solo si está vacío, para no sobrescribir cambios manuales
  const menuActual = (tenant as any).menuPrincipal as unknown[] | undefined
  if (!menuActual || menuActual.length === 0) {
    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        menuPrincipal: [
          { etiqueta: 'Inicio', enlace: '/' },
          { etiqueta: 'Nosotros', enlace: '/nosotros' },
          { etiqueta: 'Trámites', enlace: '/tramites' },
          { etiqueta: 'Contratación', enlace: '/contratacion' },
          {
            etiqueta: 'Transparencia',
            enlace: '/transparencia',
            submenu: [
              { etiqueta: 'Normativa y reportes', enlace: '/transparencia' },
              { etiqueta: 'Participa', enlace: '/participa' },
              { etiqueta: 'Datos abiertos', enlace: '/datos-abiertos' },
            ],
          },
        ],
      },
    })
    console.log('✅ Menú principal actualizado')
  } else {
    console.log('⏭️  El menú principal ya tiene elementos, no se modifica')
  }

  console.log('\n🌱 Seed de páginas finalizado')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
