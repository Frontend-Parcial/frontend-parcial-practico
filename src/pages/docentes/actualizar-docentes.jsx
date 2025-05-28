import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDocentesXid, updateDocentes } from '../../lib/docentes-data'
import PageWrapper from '../../components/PageWrapper'
import { decimalNumber, email, onlyEntireNumbers, onlyLetters } from '../../utils/patterns'

export function ActualizarDocentes() {
  const { id } = useParams()
  const [datosOriginales, setDatosOriginales] = useState({})
  const [cambios, setCambios] = useState({})
  const [cargando, setCargando] = useState(true)

  const TEACHER_CATEGORIES = [
    { value: 'Instructor', label: 'Instructor' },
    { value: 'Asistente', label: 'Asistente' },
    { value: 'Asociado', label: 'Asociado' },
    { value: 'Titular', label: 'Titular' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDocentesXid(id)
        setDatosOriginales(data)
        setCargando(false)
      } catch (error) {
        console.error('Error al cargar datos del docente:', error)
        alert('Error al cargar los datos del docente')
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

  const handleBeforeInput = (e, pattern) => {
    if (pattern && !pattern.test(e.data)) {
      e.preventDefault()
    }
  }

  const handleNumberInput = e => {
    const { name, value } = e.target
    setCambios(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  const handleSubmitEvent = async e => {
    e.preventDefault()

    if (Object.keys(cambios).length === 0) {
      alert('No has realizado ningún cambio')
      return
    }

    try {
      await updateDocentes(cambios, id)
      alert('Docente actualizado correctamente')
      setDatosOriginales({ ...datosOriginales, ...cambios })
      setCambios({})
    } catch (error) {
      alert(error.message || 'Error al actualizar docente')
    }
  }

  if (cargando) {
    return <div>Cargando datos del docente...</div>
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-2'>Actualizar Docente</h1>
        <form className='space-y-4' onSubmit={handleSubmitEvent}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Columna 1 */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={(e) => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='telefono'
                  defaultValue={datosOriginales.telefono || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={(e) => handleBeforeInput(e, email.format)}
                  name='email'
                  defaultValue={datosOriginales.email || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Departamento</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={(e) => handleBeforeInput(e, onlyLetters.format)}
                  name='departamento'
                  defaultValue={datosOriginales.departamento || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Categoría Docente</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='categoria_docente'
                  defaultValue={datosOriginales.categoria_docente || ''}
                > 
                  <option value='asistente'>Asistente</option>
                  <option value='asociado'>Asociado</option>
                  <option value='instructor'>Instructor</option>
                  <option value='titular'>Titular</option>
                </select>
              </div>
            </div>

            {/* Columna 2 */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Evaluación Docente Promedio</label>
                <input
                  type='number'
                  step='0.1'
                  min='0'
                  max='5'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleNumberInput}
                  onBeforeInput={(e) => handleBeforeInput(e, decimalNumber.format)}
                  name='evaluacion_docente_promedio'
                  defaultValue={datosOriginales.evaluacion_docente_promedio || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Publicaciones</label>
                <input
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleNumberInput}
                  onBeforeInput={(e) => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='publicaciones'
                  defaultValue={datosOriginales.publicaciones || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Proyectos de Investigación</label>
                <input
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleNumberInput}
                  onBeforeInput={(e) => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='proyectos_investigacion'
                  defaultValue={datosOriginales.proyectos_investigacion || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='estado'
                  defaultValue={datosOriginales.estado || 'activo'}
                >
                  <option value='activo'>Activo</option>
                  <option value='inactivo'>Inactivo</option>
                  <option value='licencia'>Licencia</option>
                  <option value='jubilado'>Jubilado</option>
                </select>
              </div>
            </div>
          </div>

          <div className='pt-6'>
            <button
              type='submit'
              className='w-full bg-primario text-white py-3 px-4 rounded-md hover:bg-oscuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario transition-colors font-medium'
            >
              Actualizar Datos del Docente
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
