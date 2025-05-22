import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStudents, updateStudent } from '../../lib/estudiantes-data'

export function ActualizarEstudiante() {
  const { id } = useParams()
  const [datosOriginales, setDatosOriginales] = useState({})
  const [cambios, setCambios] = useState({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudents(id)
        setDatosOriginales(data)
        setCargando(false)
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error)
        alert('Error al cargar los datos del estudiante')
        setCargando(false)
      }
    }
    fetchData()
  }, [id])

  const handleInput = e => {
    const { name, value } = e.target
    setCambios(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitEvent = async e => {
    e.preventDefault()

    if (Object.keys(cambios).length === 0) {
      alert('No has realizado ningún cambio')
      return
    }

    try {
      await updateStudent(cambios, id)
      alert('Estudiante actualizado correctamente')
      setDatosOriginales({ ...datosOriginales, ...cambios })
      setCambios({})
    } catch (error) {
      alert(error.message || 'Error al actualizar estudiante')
    }
  }

  if (cargando) {
    return <div>Cargando datos del estudiante...</div>
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-2'>Actualizar Estudiante</h1>
      <form className='space-y-4' onSubmit={handleSubmitEvent}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Columna 1 */}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre Completo</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='nombre_completo'
                defaultValue={datosOriginales.nombre_completo || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='tipo_documento'
                defaultValue={datosOriginales.tipo_documento || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='email'
                defaultValue={datosOriginales.email || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Dirección</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='direccion'
                defaultValue={datosOriginales.direccion || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Semestre</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='semestre'
                defaultValue={datosOriginales.semestre || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Promedio Académico</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='promedio_academico'
                defaultValue={datosOriginales.promedio_academico || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Sanciones Académicas</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='sanciones_academicas'
                defaultValue={datosOriginales.sanciones_academicas || ''}
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Documento</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='documento_identidad'
                defaultValue={datosOriginales.documento_identidad || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha Nacimiento</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='fecha_nacimiento'
                defaultValue={datosOriginales.fecha_nacimiento || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='telefono'
                defaultValue={datosOriginales.telefono || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Programa Académico</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='programa_academico'
                defaultValue={datosOriginales.programa_academico || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='facultad'
                defaultValue={datosOriginales.facultad || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Créditos Cursados</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='creditos_cursados'
                defaultValue={datosOriginales.creditos_cursados || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='estado'
                defaultValue={datosOriginales.estado || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Sanciones Disciplinarias</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInput}
                name='sanciones_disciplinarias'
                defaultValue={datosOriginales.sanciones_disciplinarias || ''}
              />
            </div>
          </div>
        </div>

        <div className='pt-6'>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium'
          >
            Actualizar Datos del Estudiante
          </button>
        </div>
      </form>
    </div>
  )
}
