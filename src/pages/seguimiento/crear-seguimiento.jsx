import { useState, useEffect } from 'react'
import PageWrapper from '../../components/PageWrapper'
import { getSolicitudXid } from '../../lib/solicitudes-data'
import { crearSeguimiento } from '../../lib/seguimientos-data'

export default function CrearSeguimiento() {
  const [form, setForm] = useState({
    id_solicitud: '',
    estado_actual: '',
    evaluaciones_recibidas: [],
    documentos_soporte: [],
    observaciones: 'El estudiante iniciará el intercambio en la fecha programada',
    responsable_seguimiento: 'María Castro - Coordinadora ORPI',
    reporte_avance: [],
    fecha_inicio: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
    fecha_actualizacion: new Date().toISOString()
  })

  const [validSolicitud, setValidSolicitud] = useState(null)
  const [solicitudInfo, setSolicitudInfo] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Validación en tiempo real del ID de solicitud
  useEffect(() => {
    const validar = async () => {
      if (form.id_solicitud.length >= 6) {
        try {
          const data = await getSolicitudXid(form.id_solicitud)
          if (data) {
            setValidSolicitud(true)
            setSolicitudInfo(data)
          } else {
            setValidSolicitud(false)
            setSolicitudInfo(null)
          }
        } catch {
          setValidSolicitud(false)
          setSolicitudInfo(null)
        }
      }
    }
    validar()
  }, [form.id_solicitud])

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0]
    if (!file) return
    const key = tipo === 'eval' ? 'evaluaciones_recibidas' : 'documentos_soporte'
    setForm(prev => ({ ...prev, [key]: [...prev[key], file.name] }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const fechaActual = new Date().toISOString()
    const seguimiento = {
      ...form,
      fecha_creacion: solicitudInfo?.fecha_creacion ?? fechaActual,
      fecha_actualizacion: fechaActual,
      fecha_fin: form.estado_actual === 'culminado' ? fechaActual : null
    }

    try {
      const result = await crearSeguimiento(seguimiento)
      if (result?._id) {
        alert(`✅ Seguimiento creado correctamente.\nID: ${result._id}`)
      }
    } catch (error) {
      alert('❌ Error al crear el seguimiento')
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear Seguimiento</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID de Solicitud */}
          <div>
            <label className="block text-sm font-medium text-gray-700">ID de la Solicitud</label>
            <input type="text" name="id_solicitud" value={form.id_solicitud} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" required />
            {validSolicitud === true && <p className="text-green-600 text-sm">✅ Solicitud válida</p>}
            {validSolicitud === false && <p className="text-red-600 text-sm">❌ Solicitud no encontrada</p>}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Fecha de Inicio</label>
              <input type="text" readOnly className="w-full bg-gray-100 border px-3 py-2 rounded" value={new Date(form.fecha_inicio).toLocaleString()} />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Fecha de Actualización</label>
              <input type="text" readOnly className="w-full bg-gray-100 border px-3 py-2 rounded" value={new Date(form.fecha_actualizacion).toLocaleString()} />
            </div>

            {form.estado_actual === 'culminado' && (
              <div>
                <label className="block text-sm text-gray-600">Fecha de Fin</label>
                <input type="text" readOnly className="w-full bg-gray-100 border px-3 py-2 rounded" value={new Date().toLocaleString()} />
              </div>
            )}

            {solicitudInfo?.fecha_creacion && (
              <div>
                <label className="block text-sm text-gray-600">Fecha de Creación de Solicitud</label>
                <input type="text" readOnly className="w-full bg-gray-100 border px-3 py-2 rounded" value={new Date(solicitudInfo.fecha_creacion).toLocaleString()} />
              </div>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado Actual</label>
            <select name="estado_actual" value={form.estado_actual} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
              <option value="">Seleccione...</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="culminado">Culminado</option>
            </select>
          </div>

          {/* Documentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Evaluaciones Recibidas</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'eval')} />
              <ul className="mt-1 text-sm text-gray-600">
                {form.evaluaciones_recibidas.map((f, i) => <li key={i}>📄 {f}</li>)}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Documentos Soporte</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'doc')} />
              <ul className="mt-1 text-sm text-gray-600">
                {form.documentos_soporte.map((f, i) => <li key={i}>📎 {f}</li>)}
              </ul>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange}
              className="w-full border px-3 py-2 rounded" rows={3}></textarea>
          </div>

          {/* Contacto Fijo */}
          <div className="mt-4 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-2">Responsable en Institución Destino</h3>
            <p><strong>Nombre:</strong> Dra. Ana Sánchez</p>
            <p><strong>Cargo:</strong> Coordinadora de Estudiantes Internacionales</p>
            <p><strong>Email:</strong> ana.sanchez@unam.mx</p>
            <p><strong>Teléfono:</strong> +52 55 8765 4321</p>
          </div>

          <button type="submit" className="w-full mt-4 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Registrar Seguimiento
          </button>
        </form>
      </div>
    </PageWrapper>
  )
}
