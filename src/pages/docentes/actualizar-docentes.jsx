import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getDocentesXid, updateDocentes } from '../../lib/docentes-data'
import PageWrapper from '../../components/PageWrapper'
import { decimalNumber, email, onlyEntireNumbers, onlyLetters } from '../../utils/patterns'

const FACULTADES = [
  {
    value: 'Facultad de Ciencias Administrativas, Contables y Economicas',
    label: 'Facultad de Ciencias Administrativas, Contables y Economicas',
    departamentos: [
      { value: 'Administracion de Empresas', label: 'Administracion de Empresas' },
      {
        value: 'Administracion de Empresas Turisticas y Hoteleras',
        label: 'Administracion de Empresas Turisticas y Hoteleras',
      },
      { value: 'Comercio Internacional', label: 'Comercio Internacional' },
      { value: 'Contaduria Publica', label: 'Contaduria Publica' },
      { value: 'Economia', label: 'Economia' },
    ],
  },
  {
    value: 'Facultad de Bellas Artes',
    label: 'Facultad de Bellas Artes',
    departamentos: [
      { value: 'Licenciatura en Artes', label: 'Licenciatura en Artes' },
      { value: 'Musica', label: 'Musica' },
    ],
  },
  {
    value: 'Facultad de Derecho, Ciencias Politicas y Sociales',
    label: 'Facultad de Derecho, Ciencias Politicas y Sociales',
    departamentos: [
      { value: 'Derecho', label: 'Derecho' },
      { value: 'Psicologia', label: 'Psicologia' },
      { value: 'Sociologia', label: 'Sociologia' },
    ],
  },
  {
    value: 'Facultad de Ciencias Basicas',
    label: 'Facultad de Ciencias Basicas',
    departamentos: [{ value: 'Microbiologia', label: 'Microbiologia' }],
  },
  {
    value: 'Facultad de Ingenierías y Tecnologías',
    label: 'Facultad de Ingenierías y Tecnologías',
    departamentos: [
      { value: 'Ingenieria Agroindustrial', label: 'Ingenieria Agroindustrial' },
      { value: 'Ingenieria Ambiental y Sanitaria', label: 'Ingenieria Ambiental y Sanitaria' },
      { value: 'Ingenieria de Sistemas', label: 'Ingenieria de Sistemas' },
      { value: 'Ingenieria Electronica', label: 'Ingenieria Electronica' },
    ],
  },
  {
    value: 'Facultad de Ciencias de la Salud',
    label: 'Facultad de Ciencias de la Salud',
    departamentos: [
      { value: 'Enfermeria', label: 'Enfermeria' },
      { value: 'Instrumentacion Quirurgica', label: 'Instrumentacion Quirurgica' },
    ],
  },
  {
    value: 'Facultad de Educacion',
    label: 'Facultad de Educacion',
    departamentos: [
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
    ],
  },
]

const TEACHER_CATEGORIES = [
  { value: 'Instructor', label: 'Instructor' },
  { value: 'Asistente', label: 'Asistente' },
  { value: 'Asociado', label: 'Asociado' },
  { value: 'Titular', label: 'Titular' },
]

export function ActualizarDocentes() {
  const { id } = useParams()
  const [datosOriginales, setDatosOriginales] = useState({})
  const [cambios, setCambios] = useState({})
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [departamentosDisponibles, setDepartamentosDisponibles] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDocentesXid(id)
        setDatosOriginales(data)

        if (data.facultad) {
          const facultadSeleccionada = FACULTADES.find(f => f.value === data.facultad)
          if (facultadSeleccionada) {
            setDepartamentosDisponibles(facultadSeleccionada.departamentos)
          }
        }

        setCargando(false)
      } catch (error) {
        console.error('Error al cargar datos del docente:', error)
        alert('Error al cargar los datos del docente')
        setCargando(false)
      }
    }
    fetchData()
  }, [id])

  const validateEmail = email => {
    const institutionalEmailRegex = /^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/i
    return institutionalEmailRegex.test(email)
  }

  const validateTextInput = (value, maxLength = 35) => {
    const textOnly = value.replace(/[0-9]/g, '')
    return textOnly.slice(0, maxLength)
  }

  const validateMaxLength = (value, maxLength) => {
    return value.length <= maxLength
  }

  const validateEvaluationScore = value => {
    if (value === '') return ''

    let processedValue = value.replace(',', '.')

    if (processedValue.length > 3) {
      processedValue = processedValue.slice(0, 3)
    }

    if (processedValue.endsWith('.')) {
      return processedValue
    }

    const numValue = parseFloat(processedValue)
    if (isNaN(numValue)) return ''
    if (numValue < 0) return '0.0'
    if (numValue > 5.0) return '5.0'

    return processedValue
  }

  const validatePercentage = value => {
    if (value === '') return ''

    if (value.length > 3) {
      value = value.slice(0, 3)
    }

    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return ''
    if (numValue < 0) return '0'
    if (numValue > 100) return '100'

    return value
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'email':
        if (!value) {
          newErrors[name] = 'El email es obligatorio'
        } else if (!validateEmail(value)) {
          newErrors[name] = 'El email debe ser institucional (@unicesar.edu.co)'
        } else {
          delete newErrors[name]
        }
        break
      case 'departamento':
      case 'facultad':
        if (value && !validateMaxLength(value, 35)) {
          newErrors[name] = 'Este campo no puede exceder 35 caracteres'
        } else {
          delete newErrors[name]
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleInput = e => {
    const { name, value } = e.target
    let processedValue = value

    if (name === 'facultad') {
      const facultadSeleccionada = FACULTADES.find(f => f.value === value)
      const nuevosDepartamentos = facultadSeleccionada ? facultadSeleccionada.departamentos : []

      setDepartamentosDisponibles(nuevosDepartamentos)

      setCambios(prev => ({
        ...prev,
        [name]: processedValue,
        departamento: '',
      }))
      return
    }

    if (['nombre_completo', 'titulo_pregrado', 'titulo_posgrado', 'departamento', 'facultad'].includes(name)) {
      processedValue = validateTextInput(value, 35)
    }

    if (name === 'email') {
      validateField(name, value)
    }

    setCambios(prev => ({
      ...prev,
      [name]: processedValue,
    }))
  }

  const handleBeforeInput = (e, pattern) => {
    if (pattern && !pattern.test(e.data)) {
      e.preventDefault()
    }
  }

  const handleEvaluationInput = e => {
    const { name, value } = e.target
    const validatedValue = validateEvaluationScore(value)
    setCambios(prev => ({
      ...prev,
      [name]: validatedValue === '' ? '' : validatedValue,
    }))
  }

  const handleSubmitEvent = async e => {
    e.preventDefault()

    const newErrors = {}
    const currentEmail = cambios.email !== undefined ? cambios.email : datosOriginales.email

    if (!currentEmail) {
      newErrors.email = 'El email es obligatorio'
    } else if (!validateEmail(currentEmail)) {
      newErrors.email = 'El email debe ser institucional (@unicesar.edu.co)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Por favor, corrija los errores en el formulario')
      return
    }

    if (Object.keys(cambios).length === 0) {
      alert('No has realizado ningún cambio')
      return
    }

    const cambiosProcesados = { ...cambios }
    if (
      cambiosProcesados.evaluacion_docente_promedio &&
      typeof cambiosProcesados.evaluacion_docente_promedio === 'string'
    ) {
      cambiosProcesados.evaluacion_docente_promedio = cambiosProcesados.evaluacion_docente_promedio.replace(',', '.')
    }

    try {
      await updateDocentes(cambiosProcesados, id)
      alert('Docente actualizado correctamente')
      setDatosOriginales({ ...datosOriginales, ...cambios })
      setCambios({})
      navigate('/docentes')
    } catch (error) {
      alert(error.message || 'Error al actualizar docente')
    }
  }

  const handleNumberInput = e => {
    const { name, value } = e.target
    setCambios(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  const ErrorMessage = ({ error }) => {
    if (!error) return null
    return <p className='text-red-500 text-xs mt-1'>{error}</p>
  }

  if (cargando) {
    return <div>Cargando datos del docente...</div>
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4'>
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
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='telefono'
                  maxLength={10}
                  defaultValue={datosOriginales.telefono || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email*</label>
                <input
                  type='email'
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario`}
                  onChange={handleInput}
                  onBlur={e => validateField('email', e.target.value)}
                  name='email'
                  maxLength={35}
                  defaultValue={datosOriginales.email || ''}
                  required
                />
                <ErrorMessage error={errors.email} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad</label>
                <select
                  className={`w-full px-3 py-2 border ${
                    errors.facultad ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario`}
                  onChange={handleInput}
                  name='facultad'
                  defaultValue={datosOriginales.facultad || ''}
                >
                  <option value=''>Seleccione una facultad</option>
                  {FACULTADES.map(facultad => (
                    <option key={facultad.value} value={facultad.value}>
                      {facultad.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.facultad} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Departamento</label>
                <select
                  className={`w-full px-3 py-2 border ${
                    errors.departamento ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario`}
                  onChange={handleInput}
                  name='departamento'
                  defaultValue={datosOriginales.departamento || ''}
                  disabled={!datosOriginales.facultad && !cambios.facultad}
                >
                  <option value=''>
                    {!datosOriginales.facultad && !cambios.facultad
                      ? 'Primero seleccione una facultad'
                      : 'Seleccione un departamento'}
                  </option>
                  {departamentosDisponibles.map(departamento => (
                    <option key={departamento.value} value={departamento.value}>
                      {departamento.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.departamento} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Categoría Docente</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleInput}
                  name='categoria_docente'
                  defaultValue={datosOriginales.categoria_docente || ''}
                >
                  {TEACHER_CATEGORIES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna 2 */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Evaluación Docente Promedio</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={handleEvaluationInput}
                  value={
                    cambios.evaluacion_docente_promedio !== undefined
                      ? cambios.evaluacion_docente_promedio
                      : datosOriginales.evaluacion_docente_promedio || ''
                  }
                  onKeyPress={e => {
                    const allowedChars = /[0-9.,]/
                    if (!allowedChars.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                      e.preventDefault()
                    }

                    if (
                      (e.target.value.includes('.') || e.target.value.includes(',')) &&
                      (e.key === '.' || e.key === ',')
                    ) {
                      e.preventDefault()
                    }

                    if (
                      (e.target.value.includes('.') || e.target.value.includes(',')) &&
                      e.target.value.split(/[.,]/)[1]?.length >= 1 &&
                      allowedChars.test(e.key)
                    ) {
                      e.preventDefault()
                    }
                  }}
                  name='evaluacion_docente_promedio'
                  placeholder='0.0 - 5.0'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Publicaciones</label>
                <input
                  type='number'
                  min='0'
                  max='100'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={e => {
                    const validatedValue = validatePercentage(e.target.value)
                    e.target.value = validatedValue
                    handleNumberInput({ target: { name: e.target.name, value: validatedValue } })
                  }}
                  name='publicaciones'
                  defaultValue={datosOriginales.publicaciones || ''}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Proyectos de Investigación</label>
                <input
                  type='number'
                  min='0'
                  max='100'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primario'
                  onChange={e => {
                    const validatedValue = validatePercentage(e.target.value)
                    e.target.value = validatedValue
                    handleNumberInput({ target: { name: e.target.name, value: validatedValue } })
                  }}
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

          {/* Botones */}
          <div className='pt-6 flex justify-between gap-4'>
            <button
              type='button'
              onClick={() => navigate(`/docentes/${id}`)}
              className='cursor-pointer bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 font-medium text-lg shadow-md hover:shadow-lg transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='cursor-pointer w-full bg-primario text-white py-3 px-4 rounded-md hover:bg-oscuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario transition-colors font-medium'
              disabled={Object.keys(errors).length > 0}
            >
              Actualizar Datos del Docente
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
