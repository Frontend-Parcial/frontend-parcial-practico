import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStudents, updateStudent } from '../../lib/estudiantes-data'
import PageWrapper from '../../components/PageWrapper'

export function ActualizarEstudiante() {
  const { id } = useParams()
  const [datosOriginales, setDatosOriginales] = useState({})
  const [cambios, setCambios] = useState({})
  const [cargando, setCargando] = useState(true)
  const [errores, setErrores] = useState({})

  const tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' },
  ]

  const estadosEstudiante = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'graduado', label: 'Graduado' },
    { value: 'retirado', label: 'Retirado' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudents(id)
        setDatosOriginales({
          ...data,
          sanciones_academicas: data.sanciones_academicas || false,
          sanciones_disciplinarias: data.sanciones_disciplinarias || false,
        })
        setCargando(false)
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error)
        alert('Error al cargar los datos del estudiante')
        setCargando(false)
      }
    }
    fetchData()
  }, [id])

  // Función para validar campos de solo texto
  const validarSoloTexto = valor => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return regex.test(valor) || valor === ''
  }

  const handleInput = e => {
    const { name, value, type, checked } = e.target

    // Validación para campos que solo deben contener texto
    if (['nombre_completo', 'programa_academico', 'facultad'].includes(name)) {
      if (!validarSoloTexto(value) && value !== '') {
        setErrores(prev => ({
          ...prev,
          [name]: 'Este campo solo puede contener letras y espacios',
        }))
        return
      } else {
        setErrores(prev => {
          const newErrores = { ...prev }
          delete newErrores[name]
          return newErrores
        })
      }
    }

    setCambios(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmitEvent = async e => {
    e.preventDefault()

    if (Object.keys(errores).length > 0) {
      alert('Por favor corrige los errores en el formulario')
      return
    }

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
    return (
      <PageWrapper>
        <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center'>
          Cargando datos del estudiante...
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-2'>Actualizar Estudiante</h1>
        <form className='space-y-4' onSubmit={handleSubmitEvent}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Columna 1 */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre Completo</label>
                <input
                  className={`w-full px-3 py-2 border ${
                    errores.nombre_completo ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={handleInput}
                  name='nombre_completo'
                  defaultValue={datosOriginales.nombre_completo || ''}
                />
                {errores.nombre_completo && <p className='mt-1 text-sm text-red-600'>{errores.nombre_completo}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='tipo_documento'
                  defaultValue={datosOriginales.tipo_documento || ''}
                >
                  <option value=''>Seleccione...</option>
                  {tiposDocumento.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Documento</label>
                <input
                  type='number'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='documento_identidad'
                  defaultValue={datosOriginales.documento_identidad || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha Nacimiento</label>
                <input
                  type='date'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='fecha_nacimiento'
                  defaultValue={datosOriginales.fecha_nacimiento || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='email'
                  defaultValue={datosOriginales.email || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='telefono'
                  defaultValue={datosOriginales.telefono || ''}
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className='space-y-4'>
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
                <label className='block text-sm font-medium text-gray-700 mb-1'>Programa Académico</label>
                <input
                  className={`w-full px-3 py-2 border ${
                    errores.programa_academico ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={handleInput}
                  name='programa_academico'
                  defaultValue={datosOriginales.programa_academico || ''}
                />
                {errores.programa_academico && (
                  <p className='mt-1 text-sm text-red-600'>{errores.programa_academico}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad</label>
                <input
                  className={`w-full px-3 py-2 border ${
                    errores.facultad ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={handleInput}
                  name='facultad'
                  defaultValue={datosOriginales.facultad || ''}
                />
                {errores.facultad && <p className='mt-1 text-sm text-red-600'>{errores.facultad}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Semestre</label>
                <input
                  type='number'
                  min='1'
                  max='20'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='semestre'
                  defaultValue={datosOriginales.semestre || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Créditos Cursados</label>
                <input
                  type='number'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='creditos_cursados'
                  defaultValue={datosOriginales.creditos_cursados || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Promedio Académico</label>
                <input
                  type='number'
                  step='0.01'
                  min='0'
                  max='5'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='promedio_academico'
                  defaultValue={datosOriginales.promedio_academico || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={handleInput}
                  name='estado'
                  defaultValue={datosOriginales.estado || 'activo'}
                >
                  {estadosEstudiante.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='sanciones_academicas'
                name='sanciones_academicas'
                onChange={handleInput}
                defaultChecked={datosOriginales.sanciones_academicas || false}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label htmlFor='sanciones_academicas' className='ml-2 block text-sm text-gray-700'>
                ¿Tiene sanciones académicas?
              </label>
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                id='sanciones_disciplinarias'
                name='sanciones_disciplinarias'
                onChange={handleInput}
                defaultChecked={datosOriginales.sanciones_disciplinarias || false}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label htmlFor='sanciones_disciplinarias' className='ml-2 block text-sm text-gray-700'>
                ¿Tiene sanciones disciplinarias?
              </label>
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
    </PageWrapper>
  )
}
