// Tipos que reflejan la estructura de la API de Payload

export type MenuLink = {
  etiqueta: string
  enlace: string
  submenu?: { etiqueta: string; enlace: string }[]
}

export type RedSocial = {
  red: 'facebook' | 'x' | 'instagram' | 'youtube' | 'linkedin' | 'tiktok' | 'whatsapp'
  url: string
}

export type EnlaceLegal = {
  etiqueta: string
  enlace: string
}

export type LogoFooter = {
  imagen: Media
  ancho?: number
  alto?: number
  enlace?: string
}

// Bloques genéricos del constructor visual del footer — ninguno conoce el
// significado de su contenido (no hay un blockType "direccion" o "pqrs"):
// el editor combina estos bloques libremente dentro de cada celda.
export type FooterBlockTexto = { blockType: 'texto'; contenido: string }
export type FooterBlockTitulo = { blockType: 'titulo'; contenido: string }
export type FooterBlockImagen = { blockType: 'imagen'; imagen: Media; ancho?: number; alto?: number; enlace?: string }
export type FooterBlockEnlace = { blockType: 'enlace'; etiqueta: string; enlace: string }
export type FooterBlockListaEnlaces = { blockType: 'lista-enlaces'; subtitulo?: string; enlaces?: EnlaceLegal[] }
export type FooterBlockLogos = { blockType: 'logos'; logos?: LogoFooter[] }
export type FooterBlockRedesSociales = { blockType: 'redes-sociales'; redes?: RedSocial[] }
export type FooterBlockSeparador = { blockType: 'separador' }
export type FooterBlockEspaciador = { blockType: 'espaciador'; alto?: number }
export type FooterBlockHtml = { blockType: 'html'; contenido: string }

export type FooterBlock =
  | FooterBlockTexto
  | FooterBlockTitulo
  | FooterBlockImagen
  | FooterBlockEnlace
  | FooterBlockListaEnlaces
  | FooterBlockLogos
  | FooterBlockRedesSociales
  | FooterBlockSeparador
  | FooterBlockEspaciador
  | FooterBlockHtml

// Una columna define su ancho por nombre (no por número de 1 a 12) — se
// acomoda sola junto a las demás y pasa de línea automáticamente. El
// contenido vive en sus bloques hijos.
export type FooterColumn = {
  id: string
  ancho?: 'pequena' | 'mediana' | 'grande' | 'completa'
  align?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'center' | 'bottom'
  direccionContenido?: 'columna' | 'fila'
  children?: FooterBlock[]
}

export type TenantFooter = {
  colorFondo?: string
  anchoMaximo?: string
  layout?: {
    columnas?: FooterColumn[]
  }
}

export type Tenant = {
  id: number
  nombre: string
  nit?: string
  slug: string
  dominio?: string
  configuracion?: {
    colorPrimario: string
    colorSecundario: string
    fuente: string
  }
  logo?: Media
  menuPrincipal?: MenuLink[]
  accesosRapidos?: EnlaceLegal[]
  menuHamburguesa?: {
    titulo?: string
    icono?: Media
  }
  footer?: TenantFooter
}

export type ITAResumen = {
  total: number
  cumple: number
  noAplica: number
  aplicables: number
  porcentaje: number
}

export type Media = {
  id: number
  url: string
  alt: string
  width?: number
  height?: number
}

export type RichTextBlockType = {
  blockType: 'rich-text'
  contenido: unknown
  ancho: 'normal' | 'amplio' | 'completo'
}

export type CardItem = {
  id: string
  titulo: string
  descripcion?: string
  imagen?: Media
  enlace?: string
  icono?: string
}

export type CardsBlockType = {
  blockType: 'cards'
  titulo?: string
  columnas: '2' | '3' | '4'
  items: CardItem[]
}

export type GaleriaBlockType = {
  blockType: 'galeria'
  titulo?: string
  tipo: 'grid' | 'carrusel' | 'masonry'
  columnas?: '2' | '3' | '4' | '5'
  imagenes: { imagen?: Media; caption?: string }[]
}

export type FAQItem = {
  id: string
  pregunta: string
  respuesta: string
}

export type AccordionFAQBlockType = {
  blockType: 'accordion-faq'
  titulo?: string
  descripcion?: string
  items: FAQItem[]
}

export type Noticia = {
  id: number
  titulo: string
  slug: string
  resumen: string
  contenido?: unknown
  imagen?: Media
  categoria: 'noticia' | 'aviso' | 'comunicado' | 'evento'
  fechaPublicacion: string
  destacado?: boolean
}

export type NoticiasBlockType = {
  blockType: 'noticias'
  titulo?: string
  descripcion?: string
  cantidad: '3' | '6' | '9'
  soloDestacadas?: boolean
}

export type ContactoBlockType = {
  blockType: 'contacto'
  titulo?: string
  descripcion?: string
  mostrarInfoContacto?: boolean
}

export type ITABannerBlockType = {
  blockType: 'ita-banner'
  titulo?: string
  descripcion?: string
  enlace?: string
}

export type ProcesoContratacion = {
  id: string
  nombre: string
  modalidad?: 'licitacion' | 'directa' | 'minima-cuantia' | 'seleccion-abreviada' | 'concurso-meritos'
  estado: 'abierto' | 'evaluacion' | 'adjudicado' | 'cerrado'
  fechaPublicacion?: string
  valor?: string
  enlaceSecop?: string
}

export type ContrataBlockType = {
  blockType: 'contrata'
  titulo?: string
  descripcion?: string
  items: ProcesoContratacion[]
}

export type Tramite = {
  id: string
  nombre: string
  descripcion?: string
  tipo: 'virtual' | 'presencial' | 'mixto'
  tiempoRespuesta?: string
  costo?: string
  enlace?: string
}

export type TramiteBlockType = {
  blockType: 'tramite'
  titulo?: string
  descripcion?: string
  items: Tramite[]
}

export type MecanismoParticipacion = {
  id: string
  titulo: string
  descripcion?: string
  tipoMecanismo: 'pqrsd' | 'encuesta' | 'rendicion-cuentas' | 'consulta' | 'foro'
  enlace: string
  fechaLimite?: string
}

export type ParticipaBlockType = {
  blockType: 'participa'
  titulo?: string
  descripcion?: string
  items: MecanismoParticipacion[]
}

export type ConjuntoDatos = {
  id: string
  nombre: string
  descripcion?: string
  formato: 'csv' | 'xlsx' | 'json' | 'xml' | 'pdf'
  fechaActualizacion?: string
  enlaceDescarga: string
  enlaceCatalogo?: string
}

export type DatosAbiertosBlockType = {
  blockType: 'datos-abiertos'
  titulo?: string
  descripcion?: string
  items: ConjuntoDatos[]
}

export type DocumentoItem = {
  id: string
  nombre: string
  descripcion?: string
  categoria?: string
  archivo: Media
  fecha?: string
}

export type DocumentListBlockType = {
  blockType: 'document-list'
  titulo?: string
  descripcion?: string
  items: DocumentoItem[]
}

export type HitoTimeline = {
  id: string
  fecha: string
  titulo: string
  descripcion?: string
}

export type TimelineBlockType = {
  blockType: 'timeline'
  titulo?: string
  descripcion?: string
  items: HitoTimeline[]
}

export type ColumnaTabla = {
  id: string
  etiqueta: string
}

export type CeldaTabla = {
  id: string
  valor?: string
}

export type FilaTabla = {
  id: string
  celdas: CeldaTabla[]
}

export type DataTableBlockType = {
  blockType: 'data-table'
  titulo?: string
  descripcion?: string
  columnas: ColumnaTabla[]
  filas: FilaTabla[]
}

export type IntegranteEquipo = {
  id: string
  foto?: Media
  nombre: string
  cargo: string
  dependencia?: string
  correo?: string
  telefono?: string
  descripcion?: string
}

export type EquipoBlockType = {
  blockType: 'equipo'
  titulo?: string
  descripcion?: string
  columnas: '2' | '3' | '4'
  integrantes: IntegranteEquipo[]
}

export type Aliado = {
  logo: Media
  nombre: string
  enlace?: string
}

export type AliadosBlockType = {
  blockType: 'aliados'
  titulo?: string
  descripcion?: string
  aliados: Aliado[]
}

export type Testimonio = {
  foto?: Media
  nombre: string
  cargo?: string
  testimonio: string
  calificacion: '3' | '4' | '5'
}

export type TestimoniosBlockType = {
  blockType: 'testimonios'
  titulo?: string
  descripcion?: string
  testimonios: Testimonio[]
}

export type ApiExternaBlockType = {
  blockType: 'api-externa'
  titulo?: string
  endpoint: string
  tipoVisualizacion: 'tabla' | 'cards' | 'lista' | 'grafica'
  camposVisibles?: string
  limiteRegistros: number
}

export type Page = {
  id: number
  titulo: string
  slug: string
  descripcion?: string
  estado: 'borrador' | 'revision' | 'publicado' | 'archivado'
  layout: Block[]
  tenant: Tenant
  imagenSeo?: Media
}


export type HeroServicio = {
  icono?: string
  label?: string
  href?: string
}

export type HeroBanner = {
  imagen?: Media  // objeto Media del CMS — puede faltar mientras se edita
  titulo?: string
  href?: string
}

export type HeroBlockType = {
  blockType: 'hero'
  titulo: string
  subtitulo?: string
  imagenPrincipal?: Media        // ← objeto Media, no string
  servicios?: HeroServicio[]
  banners?: HeroBanner[]
  // campos legacy
  imagen?: Media
  alineacion?: 'izquierda' | 'centro' | 'derecha'
  boton?: {
    texto?: string
    url?: string
    estilo: 'primario' | 'secundario' | 'outline'
  }
}

export type Block =
  | HeroBlockType
  | RichTextBlockType
  | CardsBlockType
  | GaleriaBlockType
  | ApiExternaBlockType
  | AccordionFAQBlockType
  | ITABannerBlockType
  | ContrataBlockType
  | TramiteBlockType
  | ParticipaBlockType
  | DatosAbiertosBlockType
  | DocumentListBlockType
  | TimelineBlockType
  | DataTableBlockType
  | EquipoBlockType
  | ContactoBlockType
  | NoticiasBlockType
  | AliadosBlockType
  | TestimoniosBlockType