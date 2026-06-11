import { MessageSquare, ClipboardList, Megaphone, Users, MessagesSquare, Calendar, ArrowRight } from 'lucide-react'
import type { MecanismoParticipacion, ParticipaBlockType } from '@/lib/types'

const TIPO_ICONOS: Record<MecanismoParticipacion['tipoMecanismo'], typeof MessageSquare> = {
  pqrsd: MessageSquare,
  encuesta: ClipboardList,
  'rendicion-cuentas': Megaphone,
  consulta: Users,
  foro: MessagesSquare,
}

const TIPO_LABELS: Record<MecanismoParticipacion['tipoMecanismo'], string> = {
  pqrsd: 'PQRSD',
  encuesta: 'Encuesta',
  'rendicion-cuentas': 'Rendición de cuentas',
  consulta: 'Consulta ciudadana',
  foro: 'Foro',
}

export default function ParticipaBlock({ titulo, descripcion, items }: ParticipaBlockType) {
  if (!items?.length) return null

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icono = TIPO_ICONOS[item.tipoMecanismo]
            return (
              <div key={item.id} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                    <Icono size={20} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{TIPO_LABELS[item.tipoMecanismo]}</span>
                </div>

                <h3 className="text-lg font-bold text-primary mb-2">{item.titulo}</h3>

                {item.descripcion && (
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">{item.descripcion}</p>
                )}

                {item.fechaLimite && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 mb-3">
                    <Calendar size={13} />
                    Hasta el {new Date(item.fechaLimite).toLocaleDateString('es-CO')}
                  </span>
                )}

                <a
                  href={item.enlace}
                  className="mt-auto inline-flex items-center gap-2 text-secondary font-medium text-sm hover:text-primary transition-colors group"
                >
                  Participar
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
