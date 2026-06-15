'use client'

import { useState } from 'react'
import type { ContactoBlockType, Tenant } from '@/lib/types'
import { Mail, MapPin, Phone, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

type Props = ContactoBlockType & { tenant?: Tenant }

export default function ContactoBlock({ titulo, descripcion, mostrarInfoContacto, tenant }: Props) {
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado' | 'error'>('idle')
  const footer = tenant?.footer

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!tenant?.id) {
      setEstado('error')
      return
    }

    const form = e.currentTarget
    const datos = new FormData(form)

    setEstado('enviando')

    try {
      const res = await fetch(`${CMS_URL}/api/mensajes-contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: datos.get('nombre'),
          correo: datos.get('correo'),
          telefono: datos.get('telefono'),
          asunto: datos.get('asunto'),
          mensaje: datos.get('mensaje'),
          tenant: tenant.id,
        }),
      })

      if (!res.ok) throw new Error('Error al enviar')

      setEstado('enviado')
      form.reset()
    } catch {
      setEstado('error')
    }
  }

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
            {descripcion && <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{descripcion}</p>}
          </div>
        )}

        <div className={`grid gap-10 ${mostrarInfoContacto ? 'lg:grid-cols-3' : ''}`}>

          {/* Formulario */}
          <form onSubmit={enviar} className={`card p-6 sm:p-8 flex flex-col gap-4 ${mostrarInfoContacto ? 'lg:col-span-2' : 'max-w-2xl mx-auto w-full'}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico *
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (opcional)
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto *
                </label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje *
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {estado === 'enviando' && <Loader2 size={16} className="animate-spin" />}
              {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
            </button>

            {estado === 'enviado' && (
              <p className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 size={16} /> Tu mensaje fue enviado correctamente. Te responderemos pronto.
              </p>
            )}
            {estado === 'error' && (
              <p className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle size={16} /> No se pudo enviar el mensaje. Intenta de nuevo más tarde.
              </p>
            )}
          </form>

          {/* Información de contacto */}
          {mostrarInfoContacto && (
            <div className="card p-6 sm:p-8 flex flex-col gap-4">
              <h3 className="font-bold text-primary text-lg mb-2">Información de contacto</h3>

              {footer?.direccion && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>{footer.direccion}</span>
                </div>
              )}
              {footer?.telefonoConmutador && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Phone size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>Conmutador: {footer.telefonoConmutador}</span>
                </div>
              )}
              {footer?.lineaGratuita && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Phone size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>Línea gratuita: {footer.lineaGratuita}</span>
                </div>
              )}
              {footer?.correoNotificaciones && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Mail size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>{footer.correoNotificaciones}</span>
                </div>
              )}
              {footer?.horarioAtencion && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Clock size={18} className="text-secondary shrink-0 mt-0.5" />
                  <span>{footer.horarioAtencion}</span>
                </div>
              )}

              {!footer?.direccion && !footer?.telefonoConmutador && !footer?.correoNotificaciones && (
                <p className="text-sm text-gray-400">
                  Configura los datos de contacto desde el panel (Tenant &gt; Footer).
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
