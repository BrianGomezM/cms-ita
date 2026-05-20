// Tipos que reflejan la estructura de la API de Payload

export type Tenant = {
  id: number
  nombre: string
  slug: string
  dominio?: string
  configuracion?: {
    colorPrimario: string
    colorSecundario: string
    fuente: string
  }
  logo?: Media
}

export type Media = {
  id: number
  url: string
  alt: string
  width?: number
  height?: number
}

// Bloques
export type HeroBlockType = {
  blockType: 'hero'
  titulo: string
  subtitulo?: string
  imagen?: Media
  alineacion: 'izquierda' | 'centro' | 'derecha'
  boton?: {
    texto?: string
    url?: string
    estilo: 'primario' | 'secundario' | 'outline'
  }
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
  imagenes: { imagen: Media; caption?: string }[]
}

export type ApiExternaBlockType = {
  blockType: 'api-externa'
  titulo?: string
  endpoint: string
  tipoVisualizacion: 'tabla' | 'cards' | 'lista' | 'grafica'
  camposVisibles?: string
  limiteRegistros: number
}

export type Block =
  | HeroBlockType
  | RichTextBlockType
  | CardsBlockType
  | GaleriaBlockType
  | ApiExternaBlockType

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