import type { DataTableBlockType } from '@/lib/types'

export default function DataTableBlock({ titulo, descripcion, columnas, filas }: DataTableBlockType) {
  if (!columnas?.length || !filas?.length) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-institucional">

        {(titulo || descripcion) && (
          <div className="text-center mb-12">
            {titulo && (
              <>
                <h2 className="section-title">{titulo}</h2>
                <div className="w-16 h-1 bg-secondary mx-auto mt-4" />
              </>
            )}
            {descripcion && <p className="text-gray-600 mt-4">{descripcion}</p>}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary text-white">
              <tr>
                {columnas.map((col) => (
                  <th key={col.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                    {col.etiqueta}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={fila.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {fila.celdas.map((celda) => (
                    <td key={celda.id} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {celda.valor}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
