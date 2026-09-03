import type { Block } from 'payload'

// Bloque especial: conecta un componente a una API externa
// Útil para contratación SECOP, trámites, datos abiertos, etc.
export const ApiExternaBlock: Block = {
  slug: 'api-externa',
  labels: {
    singular: 'Datos externos',
    plural: 'Bloques de datos externos',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título de la sección',
    },
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      label: 'URL del endpoint',
      admin: {
        description: 'Ej: https://www.datos.gov.co/api/... o https://secop.gov.co/api/...',
      },
    },
    {
      name: 'tipoVisualizacion',
      type: 'select',
      label: 'Tipo de visualización',
      defaultValue: 'tabla',
      options: [
        { label: 'Tabla', value: 'tabla' },
        { label: 'Tarjetas', value: 'cards' },
        { label: 'Lista', value: 'lista' },
        { label: 'Gráfica', value: 'grafica' },
      ],
    },
    {
      name: 'camposVisibles',
      type: 'text',
      label: 'Campos a mostrar',
      admin: {
        description: 'Separados por coma. Ej: nombre,valor,fecha',
      },
    },
    {
      name: 'limiteRegistros',
      type: 'number',
      label: 'Límite de registros',
      defaultValue: 10,
      min: 1,
      max: 100,
    },
    {
      name: 'encabezados',
      type: 'json',
      label: 'Headers HTTP (opcional)',
      admin: {
        description: 'JSON con headers adicionales. Ej: {"Authorization": "Bearer token"}',
      },
    },
  ],
}