import { useState, useEffect } from 'react';
import { crearSolicitud } from '../../lib/solicitudes-data.js';

import equivalencias from './asignaturas-prueba'
import PageWrapper from '../../components/PageWrapper'
import { getStudents } from '../../lib/estudiantes-data'
//import { getConveniosXid } from '../../lib/convenios-data'

export default function CrearSolicitud() {

  const [form, setForm] = useState({
    id_solicitante: '',
    id_convenio: '',
    periodo_academico: '',
    modalidad: '',
    tipo_intercambio: '',
    duracion: '',
    tipo_solicitante: 'estudiante',
    documentos_adjuntos: [],
    asignaturas: [],
    nueva_asignatura: {
      codigo_asignatura_origen: '',
      nombre_asignatura_origen: '',
      creditos_asignatura_origen: '',
      codigo_asignatura_destino: '',
      nombre_asignatura_destino: '',
      creditos_asignatura_destino: ''
    },
    sugerencias: []
  })

    const [validEstudiante, setValidEstudiante] = useState(null)
  //const [validConvenio, setValidConvenio] = useState(null)

  useEffect(() => {
    const checkEstudiante = async () => {
      if (form.id_solicitante.length >= 6) {
        try {
          const data = await getStudents(form.id_solicitante)
          setValidEstudiante(data ? true : false)
        } catch {
          setValidEstudiante(false)
        }
      }
    }
    checkEstudiante()
  }, [form.id_solicitante])
/*
  useEffect(() => {
    const checkConvenio = async () => {
      if (form.id_convenio.length >= 6) {
        try {
          const data = await getConveniosXid(form.id_convenio)
          setValidConvenio(data ? true : false)
        } catch {
          setValidConvenio(false)
        }
      }
    }
    checkConvenio()
  }, [form.id_convenio])
*/
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAsignaturaChange = e => {
    const { name, value } = e.target

    let nuevaAsignatura = { ...form.nueva_asignatura, [name]: value }
    let sugerencias = []

    // Buscar equivalencias
    if (name === 'codigo_asignatura_origen') {
      const eq = equivalencias.find(eq => eq.codigo_asignatura_origen.startsWith(value))
      if (eq) {
        nuevaAsignatura = {
          ...nuevaAsignatura,
          nombre_asignatura_origen: eq.nombre_asignatura_origen,
          codigo_asignatura_destino: eq.codigo_asignatura_destino,
          nombre_asignatura_destino: eq.nombre_asignatura_destino
        }
        sugerencias.push(eq)
      }
    } else if (name === 'codigo_asignatura_destino') {
      const eq = equivalencias.find(eq => eq.codigo_asignatura_destino.startsWith(value))
      if (eq) {
        nuevaAsignatura = {
          ...nuevaAsignatura,
          nombre_asignatura_destino: eq.nombre_asignatura_destino,
          codigo_asignatura_origen: eq.codigo_asignatura_origen,
          nombre_asignatura_origen: eq.nombre_asignatura_origen
        }
        sugerencias.push(eq)
      }
    }

    setForm(prev => ({
      ...prev,
      nueva_asignatura: nuevaAsignatura,
      sugerencias
    }))
  }

  const agregarAsignatura = () => {
    if (form.asignaturas.length >= 3) return
    const a = form.nueva_asignatura
    if (a.codigo_asignatura_origen && a.codigo_asignatura_destino) {
      setForm(prev => ({
        ...prev,
        asignaturas: [...prev.asignaturas, a],
        nueva_asignatura: {
          codigo_asignatura_origen: '',
          nombre_asignatura_origen: '',
          creditos_asignatura_origen: '',
          codigo_asignatura_destino: '',
          nombre_asignatura_destino: '',
          creditos_asignatura_destino: ''
        },
        sugerencias: []
      }))
    }
  }

  const eliminarAsignatura = idx => {
    setForm(prev => ({
      ...prev,
      asignaturas: prev.asignaturas.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const fechaActual = new Date().toISOString()

    const solicitud = {
      ...form,
      duracion: Number(form.duracion),
      estado_solicitud: 'pendiente',
      fecha_solicitud: fechaActual,
      fecha_creacion: fechaActual,
      fecha_actualizacion: fechaActual,
      fecha_decision: null,
      comentarios_decision: null,
      jefe_programa_aprobacion: false,
      consejo_facultad_aprobacion: false,
      oficina_ORPI_aprobacion: false,
      asignaturas: form.asignaturas.map(asig => ({
        ...asig,
        creditos_asignatura_origen: Number(asig.creditos_asignatura_origen),
        creditos_asignatura_destino: Number(asig.creditos_asignatura_destino)
      }))
    }

    try {
      await crearSolicitud(solicitud)
      alert('✅ Solicitud creada correctamente')
    } catch (error) {
      alert('❌ Error al crear la solicitud: ' + (error.message || 'Error desconocido'))
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear Solicitud</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID del Solicitante*</label>
              <input type="text" name="id_solicitante" value={form.id_solicitante} onChange={handleChange} required placeholder="Ej: 682bd232..."
                className="w-full border border-gray-300 px-3 py-2 rounded" />
                {validEstudiante === true && <p className="text-green-600 text-sm mt-1">ID válido ✅</p>}
                {validEstudiante === false && <p className="text-red-600 text-sm mt-1">ID no válido ❌</p>}

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID del Convenio*</label>
              <input type="text" name="id_convenio" value={form.id_convenio} onChange={handleChange} required placeholder="Ej: 682bf4f4..."
                className="w-full border border-gray-300 px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Período Académico*</label>
              <select name="periodo_academico" value={form.periodo_academico} onChange={handleChange} required
                className="w-full border border-gray-300 px-3 py-2 rounded">
                <option value="">Seleccione...</option>
                <option value="2025-1">2025-1</option>
                <option value="2025-2">2025-2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Modalidad*</label>
              <select name="modalidad" value={form.modalidad} onChange={handleChange} required
                className="w-full border border-gray-300 px-3 py-2 rounded">
                <option value="">Seleccione...</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Intercambio*</label>
              <select name="tipo_intercambio" value={form.tipo_intercambio} onChange={handleChange} required
                className="w-full border border-gray-300 px-3 py-2 rounded">
                <option value="">Seleccione...</option>
                <option value="internacional">Internacional</option>
                <option value="nacional">Nacional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duración (semestres)*</label>
              <input type="number" name="duracion" value={form.duracion} onChange={handleChange} required placeholder="Ej: 1"
                className="w-full border border-gray-300 px-3 py-2 rounded" />
            </div>
            </div>

          {/* Asignaturas */}
          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Asignaturas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <input name="codigo_asignatura_origen" placeholder="Código origen" value={form.nueva_asignatura.codigo_asignatura_origen} onChange={handleAsignaturaChange} className="border border-gray-300 px-2 py-1 rounded" />
              <input name="nombre_asignatura_origen" value={form.nueva_asignatura.nombre_asignatura_origen} readOnly className="bg-gray-100 border border-gray-300 px-2 py-1 rounded" />
              <input name="creditos_asignatura_origen" type="number" placeholder="Créditos origen" value={form.nueva_asignatura.creditos_asignatura_origen} onChange={handleAsignaturaChange} className="border border-gray-300 px-2 py-1 rounded" />
              <input name="codigo_asignatura_destino" placeholder="Código destino" value={form.nueva_asignatura.codigo_asignatura_destino} onChange={handleAsignaturaChange} className="border border-gray-300 px-2 py-1 rounded" />
              <input name="nombre_asignatura_destino" value={form.nueva_asignatura.nombre_asignatura_destino} readOnly className="bg-gray-100 border border-gray-300 px-2 py-1 rounded" />
              <input name="creditos_asignatura_destino" type="number" placeholder="Créditos destino" value={form.nueva_asignatura.creditos_asignatura_destino} onChange={handleAsignaturaChange} className="border border-gray-300 px-2 py-1 rounded" />
            </div>
            <button type="button" onClick={agregarAsignatura} disabled={form.asignaturas.length >= 3} className="bg-blue-600 text-white px-4 py-1 rounded">Agregar Asignatura</button>

            {form.sugerencias.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-medium">Sugerencia basada en código:</p>
                {form.sugerencias.map((sug, i) => (
                  <p key={i}>✓ {sug.codigo_asignatura_origen} → {sug.codigo_asignatura_destino}</p>
                ))}
              </div>
            )}

            {form.asignaturas.length > 0 && (
              <ul className="mt-4 space-y-2">
                {form.asignaturas.map((a, i) => (
                  <li key={i} className="text-sm bg-gray-100 p-2 rounded flex justify-between">
                    <span>{a.codigo_asignatura_origen} → {a.codigo_asignatura_destino}</span>
                    <button type="button" onClick={() => eliminarAsignatura(i)} className="text-red-500">Eliminar</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
              Registrar Solicitud
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
} 
