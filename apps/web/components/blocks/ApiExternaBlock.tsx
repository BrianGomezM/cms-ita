import type { ApiExternaBlockType } from '@/lib/types'

async function fetchDatos(endpoint: string, limite: number) {
  try {
    const res = await fetch(endpoint, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const data = await res.json()
    const lista = Array.isArray(data) ? data : data.results ?? data.data ?? []
    return lista.slice(0, limite)
  } catch {
    return []
  }
}

export default async function ApiExternaBlock({
  titulo,
  endpoint,
  tipoVisualizacion,
  camposVisibles,
  limiteRegistros,
}: ApiExternaBlockType) {
  const datos = await fetchDatos(endpoint, limiteRegistros)
  const campos = camposVisibles?.split(',').map((c) => c.trim()) ?? []

  if (datos.length === 0) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          {titulo && <h2 className="text-2xl font-bold mb-4">{titulo}</h2>}
          <p>No hay datos disponibles en este momento.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {titulo && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{titulo}</h2>
        )}

        {tipoVisualizacion === 'tabla' && (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-700 text-white">
                <tr>
                  {campos.map((campo) => (
                    <th key={campo} className="px-4 py-3 font-medium capitalize">
                      {campo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((fila: unknown, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {campos.map((campo) => (
                      <td key={campo} className="px-4 py-3 text-gray-700">
                        {String((fila as Record<string, unknown>)[campo] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tipoVisualizacion === 'lista' && (
          <ul className="space-y-2">
            {datos.map((item: unknown, i: number) => (
              <li key={i} className="bg-white p-4 rounded-lg border border-gray-100">
                {campos.map((campo) => (
                  <span key={campo} className="mr-4 text-gray-700">
                    <strong className="text-gray-900">{campo}:</strong> {String((item as Record<string, unknown>)[campo] ?? '—')}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}