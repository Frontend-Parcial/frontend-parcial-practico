import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { actualizarAsignatura, obtenerAsignaturaPorId } from '../../lib/asignaturas-data'

export function EditarAsignatura() {
  const { id } = useParams() // ID de la asignatura desde la URL
  const navigate = useNavigate()
  const location = useLocation()
  const [asignatura, setAsignatura] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  // Estado del formulario para editar solo la asignatura de destino
  const [form, setForm] = useState({
    codigo_asignatura_destino: '',
    nombre_asignatura_destino: '',
    creditos_asignatura_destino: '',
    descripcion_asignatura_destino: '',
    estado_equivalencia: 'propuesta',
    observaciones: '',
  })

  const [erroresValidacion, setErroresValidacion] = useState({})

  // Función helper para extraer el ID de solicitud de forma segura
  const obtenerIdSolicitud = id_solicitud => {
    if (!id_solicitud) return null

    // Si es un objeto con $oid
    if (typeof id_solicitud === 'object' && id_solicitud.$oid) {
      return id_solicitud.$oid
    }

    // Si es un string
    if (typeof id_solicitud === 'string') {
      return id_solicitud
    }

    return null
  }

  useEffect(() => {
    const cargarAsignatura = async () => {
      try {
        setLoading(true)
        setError(null)

        let asignaturaData = null

        // Método 1: Intentar obtener de los datos de navegación (React Router state)
        if (location.state?.asignatura) {
          console.log('Cargando desde navigation state')
          asignaturaData = location.state.asignatura
        }
        // Método 2: Intentar obtener del localStorage (backup)
        else {
          const asignaturaGuardada = localStorage.getItem('asignatura_seleccionada')
          if (asignaturaGuardada) {
            console.log('Cargando desde localStorage')
            asignaturaData = JSON.parse(asignaturaGuardada)
            // Limpiar localStorage después de usarlo
            localStorage.removeItem('asignatura_seleccionada')
          }
        }

        // Método 3: Si no hay datos, hacer llamada a la API
        if (!asignaturaData && id) {
          console.log('Cargando desde API')
          asignaturaData = await obtenerAsignaturaPorId(id)
        }

        if (asignaturaData) {
          setAsignatura(asignaturaData)

          // IMPORTANTE: Guardar el id_solicitud en localStorage para futuras navegaciones
          const idSolicitud = obtenerIdSolicitud(asignaturaData.id_solicitud)
          if (idSolicitud) {
            localStorage.setItem('id_solicitud_seleccionada', idSolicitud)
            console.log('ID solicitud guardado en localStorage:', idSolicitud)
          }

          // Pre-llenar el formulario con los datos actuales
          setForm({
            codigo_asignatura_destino: asignaturaData.codigo_asignatura_destino || '',
            nombre_asignatura_destino: asignaturaData.nombre_asignatura_destino || '',
            creditos_asignatura_destino: asignaturaData.creditos_asignatura_destino || '',
            descripcion_asignatura_destino: asignaturaData.descripcion_asignatura_destino || '',
            estado_equivalencia: asignaturaData.estado_equivalencia || 'propuesta',
            observaciones: asignaturaData.observaciones || '',
          })
        } else {
          throw new Error('No se encontraron datos de la asignatura')
        }
      } catch (error) {
        console.error('Error al cargar asignatura:', error)
        setError(error.message || 'Error al cargar los datos de la asignatura')

        // Si hay error de autenticación, redirigir al login
        if (error.message.includes('No autorizado') || error.message.includes('401')) {
          localStorage.removeItem('userToken')
          localStorage.removeItem('site')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    cargarAsignatura()
  }, [id, location.state, navigate])

  // Validar campo individual
  const validarCampo = (name, value) => {
    const errores = { ...erroresValidacion }

    switch (name) {
      case 'creditos_asignatura_destino':
        if (value && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 10)) {
          errores[name] = 'Los créditos deben ser un número entre 1 y 10'
        } else {
          delete errores[name]
        }
        break
      case 'codigo_asignatura_destino':
        if (!value || value.trim() === '') {
          errores[name] = 'Este campo es requerido'
        } else if (value.length < 3) {
          errores[name] = 'El código debe tener al menos 3 caracteres'
        } else {
          delete errores[name]
        }
        break
      case 'nombre_asignatura_destino':
        if (!value || value.trim() === '') {
          errores[name] = 'Este campo es requerido'
        } else if (value.length < 5) {
          errores[name] = 'El nombre debe tener al menos 5 caracteres'
        } else {
          delete errores[name]
        }
        break
      default:
        delete errores[name]
        break
    }

    setErroresValidacion(errores)
  }

  // Manejar cambios en el formulario
  const handleInputChange = e => {
    const { name, value } = e.target

    // Aplicar límites de caracteres
    let valorLimitado = value

    switch (name) {
      case 'nombre_asignatura_destino':
        if (value.length > 35) return
        break
      case 'codigo_asignatura_destino':
        if (value.length > 7) return
        break
      case 'descripcion_asignatura_destino':
      case 'observaciones':
        if (value.length > 100) return
        break
      case 'creditos_asignatura_destino':
        if (value !== '' && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 10)) {
          return
        }
        break
    }

    setForm(prev => ({
      ...prev,
      [name]: valorLimitado,
    }))

    // Validar en tiempo real
    validarCampo(name, valorLimitado)

    // Limpiar mensaje de error general
    if (error) {
      setError(null)
    }
  }

  // Validar formulario completo
  const validarFormulario = () => {
    const errores = {}
    const camposRequeridos = ['codigo_asignatura_destino', 'nombre_asignatura_destino', 'creditos_asignatura_destino']

    camposRequeridos.forEach(campo => {
      if (!form[campo] || form[campo].toString().trim() === '') {
        errores[campo] = 'Este campo es requerido'
      }
    })

    if (
      form.creditos_asignatura_destino &&
      (isNaN(form.creditos_asignatura_destino) ||
        parseInt(form.creditos_asignatura_destino) < 1 ||
        parseInt(form.creditos_asignatura_destino) > 10)
    ) {
      errores.creditos_asignatura_destino = 'Los créditos deben ser un número entre 1 y 10'
    }

    if (form.nombre_asignatura_destino && form.nombre_asignatura_destino.length < 5) {
      errores.nombre_asignatura_destino = 'El nombre debe tener al menos 5 caracteres'
    }

    if (form.codigo_asignatura_destino && form.codigo_asignatura_destino.length < 3) {
      errores.codigo_asignatura_destino = 'El código debe tener al menos 3 caracteres'
    }

    setErroresValidacion(errores)
    return Object.keys(errores).length === 0
  }

  // Guardar cambios
  const handleSubmit = async e => {
    e.preventDefault()

    if (!validarFormulario()) {
      setError('Por favor, corrija los errores en el formulario')
      return
    }

    try {
      setGuardando(true)
      setError(null)
      setMensaje(null)

      const resultado = await actualizarAsignatura(asignatura._id, form)

      if (resultado.success) {
        setMensaje({
          tipo: 'success',
          texto: resultado.message || 'Asignatura actualizada exitosamente',
        })

        // Asegurar que el id_solicitud esté en localStorage antes de navegar
        const idSolicitud = obtenerIdSolicitud(asignatura.id_solicitud)
        if (idSolicitud) {
          localStorage.setItem('id_solicitud_seleccionada', idSolicitud)
        }

        // Redirigir después de un breve delay al listado de solicitudes
        setTimeout(() => {
          // Navegar directamente al listado de solicitudes
          navigate('/solicitudes')
        }, 2000)
      }
    } catch (error) {
      console.error('Error al actualizar asignatura:', error)
      setError(error.message || 'No se pudo actualizar la asignatura')

      if (error.message.includes('No autorizado')) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('site')
        navigate('/login')
      }
    } finally {
      setGuardando(false)
    }
  }

  // Función para manejar la cancelación
  const handleCancelar = () => {
    // Navegar directamente al listado de solicitudes
    navigate('/solicitudes')
  }

  // Componente para mostrar errores
  const MostrarError = ({ campo }) => {
    if (erroresValidacion[campo]) {
      return <div className='text-red-500 text-sm mt-1'>{erroresValidacion[campo]}</div>
    }
    return null
  }

  // Contador de caracteres
  const ContadorCaracteres = ({ actual, maximo }) => {
    const restantes = maximo - actual
    const colorClase = restantes < 10 ? 'text-red-500' : restantes < 20 ? 'text-yellow-500' : 'text-gray-500'

    return (
      <div className={`text-xs mt-1 ${colorClase}`}>
        {actual}/{maximo} caracteres
      </div>
    )
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className='max-w-4xl mx-auto p-6'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primario'></div>
            <span className='ml-3 text-gray-600'>Cargando datos...</span>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!asignatura) {
    return (
      <PageWrapper>
        <div className='max-w-4xl mx-auto p-6'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex items-center'>
              <svg className='h-5 w-5 text-red-400 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-red-800'>{error || 'No se pudieron cargar los datos'}</span>
            </div>
          </div>
          <div className='mt-4'>
            <button
              onClick={() => navigate('/asignaturas')}
              className='bg-primario hover:bg-oscuro text-white px-4 py-2 rounded-lg transition-all'
            >
              Volver al listado
            </button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Editar Asignatura</h1>
            <p className='text-gray-600'>
              ID: <span className='font-mono bg-gray-100 px-2 py-1 rounded'>{asignatura._id}</span>
            </p>
          </div>
          <button
            className='bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition-all'
            onClick={handleCancelar}
          >
            Cancelar
          </button>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center'>
              <svg className='h-5 w-5 text-red-400 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-red-800'>{error}</span>
            </div>
          </div>
        )}

        {mensaje && (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center'>
              <svg className='h-5 w-5 text-green-400 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-green-800'>{mensaje.texto}</span>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Información de la Asignatura de Origen (Solo lectura) */}
          <div className='bg-gray-50 rounded-xl shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-blue-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              Asignatura de Origen (No editable)
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Nombre</label>
                <p className='text-gray-800 bg-white p-3 rounded-lg border'>{asignatura.nombre_asignatura_origen}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Código</label>
                <p className='text-gray-800 bg-white p-3 rounded-lg border font-mono'>
                  {asignatura.codigo_asignatura_origen}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Créditos</label>
                <p className='text-gray-800 bg-white p-3 rounded-lg border'>{asignatura.creditos_asignatura_origen}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Universidad</label>
                <p className='text-gray-800 bg-white p-3 rounded-lg border'>{asignatura.universidad_origen}</p>
              </div>
            </div>
          </div>

          {/* Formulario de Edición - Asignatura de Destino */}
          <div className='bg-white rounded-xl shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-green-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
              Editar Asignatura Equivalente
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Nombre de la Asignatura <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='nombre_asignatura_destino'
                  value={form.nombre_asignatura_destino}
                  onChange={handleInputChange}
                  required
                  maxLength={35}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.nombre_asignatura_destino ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <ContadorCaracteres actual={form.nombre_asignatura_destino.length} maximo={35} />
                <MostrarError campo='nombre_asignatura_destino' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Código de la Asignatura <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='codigo_asignatura_destino'
                  value={form.codigo_asignatura_destino}
                  onChange={handleInputChange}
                  required
                  maxLength={7}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.codigo_asignatura_destino ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <ContadorCaracteres actual={form.codigo_asignatura_destino.length} maximo={7} />
                <MostrarError campo='codigo_asignatura_destino' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Créditos <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='creditos_asignatura_destino'
                  value={form.creditos_asignatura_destino}
                  onChange={handleInputChange}
                  required
                  min='1'
                  max='10'
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.creditos_asignatura_destino ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <MostrarError campo='creditos_asignatura_destino' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Estado de Equivalencia</label>
                <select
                  name='estado_equivalencia'
                  value={form.estado_equivalencia}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primario'
                >
                  <option value='propuesta'>Propuesta</option>
                  <option value='aprobada'>Aprobada</option>
                  <option value='rechazada'>Rechazada</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Descripción (opcional)</label>
                <textarea
                  name='descripcion_asignatura_destino'
                  value={form.descripcion_asignatura_destino}
                  onChange={handleInputChange}
                  rows='3'
                  maxLength={100}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primario'
                  placeholder='Descripción del contenido de la asignatura equivalente...'
                />
                <ContadorCaracteres actual={form.descripcion_asignatura_destino.length} maximo={100} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Observaciones (opcional)</label>
                <textarea
                  name='observaciones'
                  value={form.observaciones}
                  onChange={handleInputChange}
                  rows='3'
                  maxLength={100}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primario'
                  placeholder='Observaciones sobre la equivalencia...'
                />
                <ContadorCaracteres actual={form.observaciones.length} maximo={100} />
              </div>

              {/* Botones */}
              <div className='flex justify-end space-x-4 pt-4'>
                <button
                  type='button'
                  onClick={handleCancelar}
                  className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all'
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  disabled={guardando || Object.keys(erroresValidacion).length > 0}
                  className='px-6 py-2 bg-primario hover:bg-oscuro text-white rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  {guardando && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>}
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
