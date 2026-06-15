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
      titulo: 'Inicio',
      slug: 'inicio',
      descripcion: 'Portal institucional: trámites, transparencia y noticias en un solo lugar.',
      layout: [
        {
          blockType: 'hero',
          titulo: '¡Bienvenido!',
          subtitulo: '¿Qué trámite deseas realizar?',
          servicios: [
            { icono: 'RefreshCw', label: 'Renovar matrícula', href: '/tramites' },
            { icono: 'Monitor', label: 'Trámites virtuales', href: '/tramites' },
            { icono: 'Download', label: 'Certificados', href: '/tramites' },
            { icono: 'ClipboardList', label: 'PQRSD', href: '/participa' },
            { icono: 'Megaphone', label: 'Convocatorias', href: '/contratacion' },
            { icono: 'BarChart', label: 'Datos abiertos', href: '/datos-abiertos' },
          ],
        },
        {
          blockType: 'cards',
          titulo: 'Nuestros servicios',
          columnas: '3',
          items: [
            {
              titulo: 'Registro mercantil',
              descripcion: 'Matrícula, renovación y certificados de existencia y representación legal.',
              enlace: '/tramites',
              icono: '📋',
            },
            {
              titulo: 'Contratación',
              descripcion: 'Consulta los procesos de contratación abiertos y adjudicados de la entidad.',
              enlace: '/contratacion',
              icono: '📑',
            },
            {
              titulo: 'Transparencia',
              descripcion: 'Información sobre normativa, presupuesto y gestión institucional.',
              enlace: '/transparencia',
              icono: '🔍',
            },
          ],
        },
        {
          blockType: 'noticias',
          titulo: 'Noticias y avisos',
          descripcion: 'Mantente al día con las últimas novedades de la entidad.',
          cantidad: '3',
          soloDestacadas: false,
        },
        {
          blockType: 'testimonios',
          titulo: 'Lo que dicen nuestros usuarios',
          descripcion: 'Edita estos testimonios con comentarios reales de usuarios y empresarios de la región.',
          testimonios: [
            {
              nombre: 'Nombre del empresario',
              cargo: 'Representante legal, Empresa S.A.S.',
              testimonio: 'Reemplaza este texto con un testimonio real sobre la experiencia con nuestros trámites y servicios.',
              calificacion: '5',
            },
            {
              nombre: 'Nombre del usuario',
              cargo: 'Ciudadano',
              testimonio: 'Reemplaza este texto con un testimonio real sobre la atención recibida.',
              calificacion: '5',
            },
            {
              nombre: 'Nombre del aliado',
              cargo: 'Entidad aliada',
              testimonio: 'Reemplaza este texto con un testimonio real sobre un convenio o alianza.',
              calificacion: '4',
            },
          ],
        },
      ],
    },
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
      titulo: 'Política de privacidad',
      slug: 'politicas',
      descripcion: 'Política de tratamiento de datos personales y privacidad de la información.',
      layout: [
        {
          blockType: 'rich-text',
          ancho: 'normal',
          contenido: parrafo(
            'En cumplimiento de la Ley 1581 de 2012 y sus decretos reglamentarios, esta entidad informa su política de tratamiento de datos personales.\n\nLos datos personales recolectados a través de este sitio web (formularios de contacto, PQRSD, trámites en línea, etc.) son tratados con la finalidad de atender las solicitudes de los ciudadanos, prestar los servicios institucionales y cumplir con las obligaciones legales aplicables.\n\nLos titulares de los datos tienen derecho a conocer, actualizar, rectificar y suprimir su información, así como a revocar la autorización otorgada para su tratamiento, mediante solicitud dirigida a los canales de contacto oficiales de la entidad.\n\nEdita este texto desde el panel para incluir la política de tratamiento de datos personales oficial y aprobada de la entidad.',
          ),
        },
      ],
    },
    {
      titulo: 'Términos de uso',
      slug: 'terminos',
      descripcion: 'Términos y condiciones de uso del portal institucional.',
      layout: [
        {
          blockType: 'rich-text',
          ancho: 'normal',
          contenido: parrafo(
            'El acceso y uso de este portal institucional implica la aceptación de los presentes términos de uso.\n\nLa información publicada en este sitio web es de carácter público y se ofrece como un servicio a la ciudadanía, en cumplimiento de la Ley 1712 de 2014 (Ley de Transparencia y Acceso a la Información Pública) y la Resolución MinTIC 1519 de 2020.\n\nLa entidad realiza esfuerzos razonables para mantener la información actualizada y precisa; sin embargo, no garantiza la exactitud absoluta de los contenidos y se reserva el derecho de modificarlos sin previo aviso.\n\nQueda prohibido el uso de este sitio con fines fraudulentos, ilícitos o que atenten contra los derechos de terceros.\n\nEdita este texto desde el panel para incluir los términos y condiciones oficiales aprobados por la entidad.',
          ),
        },
      ],
    },
    {
      titulo: 'Contacto',
      slug: 'contacto',
      descripcion: 'Canales de atención y formulario de contacto con la entidad.',
      layout: [
        {
          blockType: 'contacto',
          titulo: 'Contáctanos',
          descripcion: 'Escríbenos y te responderemos a la mayor brevedad posible.',
          mostrarInfoContacto: true,
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
          { etiqueta: 'Noticias', enlace: '/noticias' },
          { etiqueta: 'Contacto', enlace: '/contacto' },
        ],
      },
    })
    console.log('✅ Menú principal actualizado')
  } else {
    const enlacesExistentes = new Set((menuActual as Array<{ enlace: string }>).map((item) => item.enlace))
    const faltantes = [
      { etiqueta: 'Noticias', enlace: '/noticias' },
      { etiqueta: 'Contacto', enlace: '/contacto' },
    ].filter((item) => !enlacesExistentes.has(item.enlace))

    if (faltantes.length > 0) {
      await payload.update({
        collection: 'tenants',
        id: tenantId,
        data: {
          menuPrincipal: [...(menuActual as object[]), ...faltantes],
        },
      })
      console.log(`✅ Enlaces agregados al menú principal: ${faltantes.map((f) => f.etiqueta).join(', ')}`)
    } else {
      console.log('⏭️  El menú principal ya tiene elementos, no se modifica')
    }
  }

  console.log('\n🌱 Seed de páginas finalizado')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
