import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getStudents, updateStudent } from '../../lib/estudiantes-data'
import PageWrapper from '../../components/PageWrapper'
import { address, decimalNumber, email, onlyEntireNumbers, onlyLetters } from '../../utils/patterns'

export function ActualizarEstudiante() {
  const { id } = useParams()
  const [programasAcademicos, setProgramasAcademicos] = useState([])
  const [datosOriginales, setDatosOriginales] = useState({})
  const [cambios, setCambios] = useState({})
  const [cargando, setCargando] = useState(true)
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()

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

  const facultades = [
    {
      value: 'Facultad de Ciencias Administrativas, Contables y Economicas',
      label: 'Facultad de Ciencias Administrativas, Contables y Economicas',
    },
    { value: 'Facultad de Bellas Artes', label: 'Facultad de Bellas Artes' },
    {
      value: 'Facultad de Derecho, Ciencias Politicas y Sociales',
      label: 'Facultad de Derecho, Ciencias Politicas y Sociales',
    },
    { value: 'Facultad de Ciencias Basicas', label: 'Facultad de Ciencias Basicas' },
    { value: 'Facultad de Ingenierías y Tecnologías', label: 'Facultad de Ingenierías y Tecnologías' },
    { value: 'Facultad de Ciencias de la Salud', label: 'Facultad de Ciencias de la Salud' },
    { value: 'Facultad de Educacion', label: 'Facultad de Educacion' },
  ]

  const programasCiencias = [
    { value: 'Administracion de Empresas', label: 'Administracion de Empresas' },
    {
      value: 'Administracion de Empresas Turisticas y Hoteleras',
      label: 'Administracion de Empresas Turisticas y Hoteleras',
    },
    { value: 'Comercio Internacional', label: 'Comercio Internacional' },
    { value: 'Contaduria Publica', label: 'Contaduria Publica' },
    { value: 'Economia', label: 'Economia' },
  ]

  const programasBellasArtes = [
    { value: 'Licenciatura en Artes', label: 'Licenciatura en Artes' },
    { value: 'Musica', label: 'Musica' },
  ]

  const programasDerecho = [
    { value: 'Derecho', label: 'Derecho' },
    { value: 'Psicologia', label: 'Psicologia' },
    { value: 'Sociologia', label: 'Sociologia' },
  ]

  const programasCienciasBasicas = [{ value: 'Microbiologia', label: 'Microbiologia' }]

  const programasIngenierias = [
    { value: 'Ingenieria Agroindustrial', label: 'Ingenieria Agroindustrial' },
    { value: 'Ingenieria Ambiental y Sanitaria', label: 'Ingenieria Ambiental y Sanitaria' },
    { value: 'Ingenieria de Sistemas', label: 'Ingenieria de Sistemas' },
    { value: 'Ingenieria Electronica', label: 'Ingenieria Electronica' },
  ]

  const programasCienciasSalud = [
    { value: 'Enfermeria', label: 'Enfermeria' },
    { value: 'Instrumentacion Quirurgica', label: 'Instrumentacion Quirurgica' },
  ]

  const programasEducacion = [
    {
      value: 'Licenciatura en Ciencias Naturales y Educacion Ambiental',
      label: 'Ciencias Naturales y Educacion Ambiental',
    },
    { value: 'Licenciatura en Literatura y Lengua Castellana', label: 'Literatura y Lengua Castellana' },
    { value: 'Licenciatura en Matematicas', label: 'Matematicas' },
    { value: 'Licenciatura en Español e Ingles', label: 'Español e Ingles' },
    {
      value: 'Licenciatura en Educacion Fisica, Recreacion y Deportes',
      label: 'Educacion Fisica, Recreacion y Deportes',
    },
  ]

  function handleProgramas(facultad) {
    switch (facultad) {
      case 'Facultad de Ciencias Administrativas, Contables y Economicas':
        setProgramasAcademicos(programasCiencias)
        break
      case 'Facultad de Bellas Artes':
        setProgramasAcademicos(programasBellasArtes)
        break
      case 'Facultad de Derecho, Ciencias Politicas y Sociales':
        setProgramasAcademicos(programasDerecho)
        break
      case 'Facultad de Ciencias Basicas':
        setProgramasAcademicos(programasCienciasBasicas)
        break
      case 'Facultad de Ingenierías y Tecnologías':
        setProgramasAcademicos(programasIngenierias)
        break
      case 'Facultad de Ciencias de la Salud':
        setProgramasAcademicos(programasCienciasSalud)
        break
      case 'Facultad de Educacion':
        setProgramasAcademicos(programasEducacion)
        break
      default:
        setProgramasAcademicos([])
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudents(id)
        const datosCompletos = {
          ...data,
          sanciones_academicas: data.sanciones_academicas || false,
          sanciones_disciplinarias: data.sanciones_disciplinarias || false,
        }
        setDatosOriginales(datosCompletos)

        if (datosCompletos.facultad) {
          handleProgramas(datosCompletos.facultad)
        }

        setCargando(false)
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error)
        alert('Error al cargar los datos del estudiante')
        setCargando(false)
      }
    }
    fetchData()
  }, [id])

  const validarSoloTexto = valor => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return regex.test(valor) || valor === ''
  }

  const handleBeforeInput = (e, pattern) => {
    if (pattern && !pattern.test(e.data)) {
      e.preventDefault()
    }
  }

  const handleInput = e => {
    const { name, value, type, checked } = e.target

    let newValue = type === 'checkbox' ? checked : value

    if (name === 'nombre_completo' && newValue.length > 35) {
      return
    }

    if (name === 'telefono') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 10) {
        return
      }
      newValue = numericValue
    }

    if (name === 'documento_identidad') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 11) {
        return
      }
      newValue = numericValue
    }

    if (name === 'direccion' && newValue.length > 35) {
      return
    }

    if (name === 'fecha_nacimiento') {
      const today = new Date().toISOString().split('T')[0]
      if (newValue > today) {
        return
      }
    }

    if (name === 'email') {
      if (newValue.length > 45) {
        return
      }
      if (newValue.includes('@') && newValue.length > 15 && !newValue.endsWith('@unicesar.edu.co')) {
        return
      }
    }

    if (name === 'semestre') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 2) {
        return
      }
      newValue = numericValue
    }

    if (name === 'creditos_cursados') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 3) {
        return
      }
      newValue = numericValue
    }

    if (name === 'promedio_academico') {
      let processedValue = newValue.replace(',', '.')
      if (processedValue && parseFloat(processedValue) > 5.0) {
        return
      }
      if (!/^\d*\.?\d*$/.test(processedValue)) {
        return
      }
      newValue = processedValue
    }

    if (name === 'facultad') {
      handleProgramas(newValue)
      setCambios(prev => ({
        ...prev,
        [name]: newValue,
        programa_academico: '',
      }))
      return
    }

    if (['nombre_completo'].includes(name)) {
      if (!validarSoloTexto(newValue) && newValue !== '') {
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
      [name]: newValue,
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
      navigate('/estudiantes')
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

  const getFieldValue = fieldName => {
    return cambios.hasOwnProperty(fieldName) ? cambios[fieldName] : datosOriginales[fieldName] || ''
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4'>
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
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario`}
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='nombre_completo'
                  maxLength='35'
                  defaultValue={datosOriginales.nombre_completo || ''}
                />
                {errores.nombre_completo && <p className='mt-1 text-sm text-red-600'>{errores.nombre_completo}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='tipo_documento'
                  value={getFieldValue('tipo_documento')}
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
                <label className='block text-sm font-medium text-gray-700 mb-1'>Documento de Identidad</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='documento_identidad'
                  defaultValue={datosOriginales.documento_identidad || ''}
                  maxLength='11'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha Nacimiento</label>
                <input
                  type='date'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='fecha_nacimiento'
                  defaultValue={datosOriginales.fecha_nacimiento || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, email.format)}
                  name='email'
                  maxLength='45'
                  defaultValue={datosOriginales.email || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='telefono'
                  defaultValue={datosOriginales.telefono || ''}
                  maxLength='10'
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Dirección</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, address.format)}
                  name='direccion'
                  maxLength='35'
                  defaultValue={datosOriginales.direccion || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='facultad'
                  value={getFieldValue('facultad')}
                >
                  <option value=''>Seleccione una facultad...</option>
                  {facultades.map(facultad => (
                    <option key={facultad.value} value={facultad.value}>
                      {facultad.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Programa Académico</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='programa_academico'
                  value={getFieldValue('programa_academico')}
                  disabled={!getFieldValue('facultad') || programasAcademicos.length === 0}
                >
                  <option value=''>
                    {!getFieldValue('facultad')
                      ? 'Primero seleccione una facultad'
                      : 'Seleccione un programa académico...'}
                  </option>
                  {programasAcademicos.map(programa => (
                    <option key={programa.value} value={programa.value}>
                      {programa.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Semestre</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='semestre'
                  maxLength='2'
                  defaultValue={datosOriginales.semestre || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Créditos Cursados</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='creditos_cursados'
                  defaultValue={datosOriginales.creditos_cursados || ''}
                  maxLength='3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Promedio Académico</label>
                <input
                  type='text'
                  maxLength='3'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, decimalNumber.format)}
                  name='promedio_academico'
                  defaultValue={datosOriginales.promedio_academico || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='estado'
                  value={getFieldValue('estado') || 'activo'}
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
                className='h-4 w-4 text-claro focus:ring-primario border-gray-300 rounded'
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
                className='h-4 w-4 text-claro focus:ring-primario border-gray-300 rounded'
              />
              <label htmlFor='sanciones_disciplinarias' className='ml-2 block text-sm text-gray-700'>
                ¿Tiene sanciones disciplinarias?
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className='pt-6 flex justify-between gap-4'>
            <button
              type='button'
              onClick={() => navigate('/estudiantes')}
              className='cursor-pointer bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 font-medium text-lg shadow-md hover:shadow-lg transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='cursor-pointer w-full bg-primario text-white py-3 px-4 rounded-md hover:bg-oscuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario transition-colors font-medium'
            >
              Actualizar Datos del Estudiante
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
