import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { crearAsignatura, obtenerSolicitudPorId } from '../../lib/asignaturas-data'

export function CrearAsignaturas() {
  const [idSolicitud, setIdSolicitud] = useState('')
  const [nombreEstudiante, setNombreEstudiante] = useState('')
  const [convenio, setConvenio] = useState('')
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const navigate = useNavigate()

  // Estado del formulario con validaciones
  const [form, setForm] = useState({
    nombre_asignatura_origen: '',
    codigo_asignatura_origen: '',
    creditos_asignatura_origen: '',
    nombre_asignatura_destino: '',
    codigo_asignatura_destino: '',
    creditos_asignatura_destino: '',
    descripcion_asignatura_origen: '',
    descripcion_asignatura_destino: '',
    estado_equivalencia: 'propuesta',
    observaciones: '',
    universidad_origen: '',
    universidad_destino: '',
  })

  const [erroresValidacion, setErroresValidacion] = useState({})

  // Cargar solicitud por ID
  const cargarSolicitud = async id => {
    try {
      setLoading(true)
      setError(null)

      const data = await obtenerSolicitudPorId(id)
      setSolicitud(data)

      // Pre-llenar campos del formulario basado en la solicitud
      if (data.universidad_destino) {
        setForm(prev => ({
          ...prev,
          universidad_destino: data.universidad_destino,
        }))
      }
    } catch (error) {
      console.error('Error al cargar solicitud:', error)
      setError(error.message || 'No se pudo cargar la solicitud')

      if (error.message.includes('No autorizado')) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('site')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  // Validar campo individual
  const validarCampo = (name, value) => {
    const errores = { ...erroresValidacion }

    switch (name) {
      case 'creditos_asignatura_origen':
      case 'creditos_asignatura_destino':
        if (value && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 10)) {
          errores[name] = 'Los créditos deben ser un número entre 1 y 10'
        } else {
          delete errores[name]
        }
        break
      case 'codigo_asignatura_origen':
      case 'codigo_asignatura_destino':
        if (!value || value.trim() === '') {
          // Se valida como requerido en validarFormulario
        } else if (value.length < 3) {
          errores[name] = 'El código debe tener al menos 3 caracteres'
        } else {
          delete errores[name]
        }
        break
      case 'nombre_asignatura_origen':
      case 'nombre_asignatura_destino':
        if (!value || value.trim() === '') {
          // Se valida como requerido en validarFormulario
        } else if (value.length < 5) {
          errores[name] = 'El nombre debe tener al menos 5 caracteres'
        } else {
          delete errores[name]
        }
        break
      case 'universidad_origen':
      case 'universidad_destino':
        if (!value || value.trim() === '') {
          // Se valida como requerido en validarFormulario
        } else {
          delete errores[name]
        }
        break
      case 'descripcion_asignatura_origen':
      case 'descripcion_asignatura_destino':
      case 'observaciones':
        // Campos opcionales, no requieren validación adicional ya que el límite se controla en handleInputChange
        delete errores[name]
        break
      default:
        break
    }

    setErroresValidacion(errores)
  }

  // Manejar cambios en el formulario
  const handleInputChange = e => {
    const { name, value } = e.target

    // Aplicar límites de caracteres antes de actualizar el estado
    let valorLimitado = value

    switch (name) {
      case 'nombre_asignatura_origen':
      case 'nombre_asignatura_destino':
        if (value.length > 35) return // No permitir más de 35 caracteres
        break
      case 'codigo_asignatura_origen':
      case 'codigo_asignatura_destino':
        if (value.length > 7) return // No permitir más de 7 caracteres
        break
      case 'universidad_origen':
      case 'universidad_destino':
        if (value.length > 40) return // No permitir más de 40 caracteres
        break
      case 'descripcion_asignatura_origen':
      case 'descripcion_asignatura_destino':
      case 'observaciones':
        if (value.length > 100) return // No permitir más de 100 caracteres
        break
      case 'creditos_asignatura_origen':
      case 'creditos_asignatura_destino':
        // Para créditos, validar que esté en el rango correcto
        if (value !== '' && (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 10)) {
          return // No permitir valores fuera del rango
        }
        break
    }

    setForm(prev => ({
      ...prev,
      [name]: valorLimitado,
    }))

    // Validar en tiempo real
    validarCampo(name, valorLimitado)

    // Limpiar mensaje de error general si el usuario está editando
    if (error) {
      setError(null)
    }
  }

  // Validar formulario completo
  const validarFormulario = () => {
    const errores = {}
    const camposRequeridos = [
      'nombre_asignatura_origen',
      'codigo_asignatura_origen',
      'creditos_asignatura_origen',
      'nombre_asignatura_destino',
      'codigo_asignatura_destino',
      'creditos_asignatura_destino',
      'universidad_origen',
      'universidad_destino',
    ]

    // Validar campos requeridos
    camposRequeridos.forEach(campo => {
      if (!form[campo] || form[campo].toString().trim() === '') {
        errores[campo] = 'Este campo es requerido'
      }
    })

    // Validar créditos
    if (
      form.creditos_asignatura_origen &&
      (isNaN(form.creditos_asignatura_origen) ||
        parseInt(form.creditos_asignatura_origen) < 1 ||
        parseInt(form.creditos_asignatura_origen) > 10)
    ) {
      errores.creditos_asignatura_origen = 'Los créditos deben ser un número entre 1 y 10'
    }

    if (
      form.creditos_asignatura_destino &&
      (isNaN(form.creditos_asignatura_destino) ||
        parseInt(form.creditos_asignatura_destino) < 1 ||
        parseInt(form.creditos_asignatura_destino) > 10)
    ) {
      errores.creditos_asignatura_destino = 'Los créditos deben ser un número entre 1 y 10'
    }

    // Validar longitudes máximas (ya no es necesario ya que se controla en handleInputChange)
    // Solo validamos longitudes mínimas y otros criterios específicos
    if (form.nombre_asignatura_origen && form.nombre_asignatura_origen.length < 5) {
      errores.nombre_asignatura_origen = 'El nombre debe tener al menos 5 caracteres'
    }
    if (form.nombre_asignatura_destino && form.nombre_asignatura_destino.length < 5) {
      errores.nombre_asignatura_destino = 'El nombre debe tener al menos 5 caracteres'
    }
    if (form.codigo_asignatura_origen && form.codigo_asignatura_origen.length < 3) {
      errores.codigo_asignatura_origen = 'El código debe tener al menos 3 caracteres'
    }
    if (form.codigo_asignatura_destino && form.codigo_asignatura_destino.length < 3) {
      errores.codigo_asignatura_destino = 'El código debe tener al menos 3 caracteres'
    }

    setErroresValidacion(errores)
    return Object.keys(errores).length === 0
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setForm({
      nombre_asignatura_origen: '',
      codigo_asignatura_origen: '',
      creditos_asignatura_origen: '',
      nombre_asignatura_destino: '',
      codigo_asignatura_destino: '',
      creditos_asignatura_destino: '',
      descripcion_asignatura_origen: '',
      descripcion_asignatura_destino: '',
      estado_equivalencia: 'propuesta',
      observaciones: '',
      universidad_origen: '',
      universidad_destino: solicitud?.universidad_destino || '',
    })
    setErroresValidacion({})
  }

  // Guardar nueva asignatura
  const handleSubmit = async e => {
    e.preventDefault()

    // Validar formulario antes de enviar
    if (!validarFormulario()) {
      setError('Por favor, corrija los errores en el formulario')
      return
    }

    try {
      setGuardando(true)
      setError(null)
      setMensaje(null)

      // Preparar datos para enviar
      const nuevaAsignatura = {
        id_solicitud: idSolicitud,
        codigo_asignatura_origen: form.codigo_asignatura_origen,
        nombre_asignatura_origen: form.nombre_asignatura_origen,
        creditos_asignatura_origen: form.creditos_asignatura_origen,
        codigo_asignatura_destino: form.codigo_asignatura_destino,
        nombre_asignatura_destino: form.nombre_asignatura_destino,
        creditos_asignatura_destino: form.creditos_asignatura_destino,
        descripcion_asignatura_origen: form.descripcion_asignatura_origen,
        descripcion_asignatura_destino: form.descripcion_asignatura_destino,
        estado_equivalencia: form.estado_equivalencia,
        observaciones: form.observaciones,
        universidad_origen: form.universidad_origen,
        universidad_destino: form.universidad_destino,
      }

      // Llamar a la función mejorada
      const resultado = await crearAsignatura(nuevaAsignatura)

      if (resultado.success) {
        setMensaje({
          tipo: 'success',
          texto: resultado.message || 'Asignatura creada exitosamente',
        })

        // Limpiar formulario después del éxito
        limpiarFormulario()

        // Redirigir después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          localStorage.setItem('id_solicitud_seleccionada', idSolicitud)
          navigate('/asignaturas')
        }, 2000)
      }
    } catch (error) {
      console.error('Error al crear asignatura:', error)
      setError(error.message || 'No se pudo crear la asignatura')

      if (error.message.includes('No autorizado')) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('site')
        navigate('/login')
      }
    } finally {
      setGuardando(false)
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    const idGuardado = localStorage.getItem('id_solicitud_crear')
    const nombreGuardado = localStorage.getItem('nombre_estudiante_crear')
    const convenioGuardado = localStorage.getItem('convenio_crear')
    const universidadOrigenGuardada = localStorage.getItem('universidad_origen_crear')

    console.log('Datos recuperados del localStorage:', {
      id: idGuardado,
      nombre: nombreGuardado,
      convenio: convenioGuardado,
      universidadOrigen: universidadOrigenGuardada,
    })

    if (idGuardado) {
      setIdSolicitud(idGuardado)
      setNombreEstudiante(nombreGuardado || '')
      setConvenio(convenioGuardado || '')

      if (universidadOrigenGuardada) {
        setForm(prev => ({
          ...prev,
          universidad_origen: universidadOrigenGuardada,
        }))
      }

      // Limpiar localStorage
      localStorage.removeItem('id_solicitud_crear')
      localStorage.removeItem('nombre_estudiante_crear')
      localStorage.removeItem('convenio_crear')
      localStorage.removeItem('universidad_origen_crear')

      // Cargar datos de la solicitud
      cargarSolicitud(idGuardado)
    } else {
      console.warn('No se encontró id_solicitud para crear asignatura')
      navigate('/solicitudes')
    }
  }, [navigate])

  // Componente para mostrar errores de validación
  const MostrarError = ({ campo }) => {
    if (erroresValidacion[campo]) {
      return <div className='text-red-500 text-sm mt-1'>{erroresValidacion[campo]}</div>
    }
    return null
  }

  // Función para mostrar contador de caracteres
  const ContadorCaracteres = ({ actual, maximo, nombre }) => {
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
        <div className='max-w-6xl mx-auto p-6'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primario'></div>
            <span className='ml-3 text-gray-600'>Cargando solicitud...</span>
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
            <h1 className='text-3xl font-bold text-gray-800'>Agregar Nueva Asignatura</h1>
          </div>
          <button
            className='bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition-all'
            onClick={() => navigate(-1)}
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
          <div
            className={`border rounded-lg p-4 mb-6 ${
              mensaje.tipo === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className='flex items-center'>
              <svg
                className={`h-5 w-5 mr-2 ${mensaje.tipo === 'success' ? 'text-green-400' : 'text-blue-400'}`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{mensaje.texto}</span>
            </div>
          </div>
        )}

        {/* Información de la solicitud */}
        <div className='bg-gradient-to-r from-claro to-oscuro p-6 text-white'>
          <h1 className=' font-semibold mb-3 '>Información de la Solicitud</h1>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <span className=' font-medium '>ID Solicitud:</span>
              <p className='font-semibold'>{idSolicitud}</p>
            </div>
          </div>
          {solicitud?.universidad_destino && (
            <div className='mt-3'>
              <span className='text-sm font-medium text-blue-600'>Universidad de Destino:</span>
              <p className='text-blue-800 font-semibold'>{solicitud.universidad_destino}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow-md p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Asignatura de Origen */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-700 border-b pb-2'>Asignatura de Origen</h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Nombre de la Asignatura <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='nombre_asignatura_origen'
                  value={form.nombre_asignatura_origen}
                  onChange={handleInputChange}
                  required
                  maxLength={35}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.nombre_asignatura_origen ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Ej: Arquitectura de Software'
                />
                <ContadorCaracteres
                  actual={form.nombre_asignatura_origen.length}
                  maximo={35}
                  nombre='nombre_asignatura_origen'
                />
                <MostrarError campo='nombre_asignatura_origen' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Código de la Asignatura <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='codigo_asignatura_origen'
                  value={form.codigo_asignatura_origen}
                  onChange={handleInputChange}
                  required
                  maxLength={7}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.codigo_asignatura_origen ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Ej: IS-4502'
                />
                <ContadorCaracteres
                  actual={form.codigo_asignatura_origen.length}
                  maximo={7}
                  nombre='codigo_asignatura_origen'
                />
                <MostrarError campo='codigo_asignatura_origen' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Créditos <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='creditos_asignatura_origen'
                  value={form.creditos_asignatura_origen}
                  onChange={handleInputChange}
                  required
                  min='1'
                  max='10'
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.creditos_asignatura_origen ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <MostrarError campo='creditos_asignatura_origen' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Universidad de Origen <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='universidad_origen'
                  value={form.universidad_origen}
                  onChange={handleInputChange}
                  required
                  maxLength={40}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.universidad_origen ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Ej: Universidad de Barcelona'
                />
                <ContadorCaracteres actual={form.universidad_origen.length} maximo={40} nombre='universidad_origen' />
                <MostrarError campo='universidad_origen' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Descripción (opcional)</label>
                <textarea
                  name='descripcion_asignatura_origen'
                  value={form.descripcion_asignatura_origen}
                  onChange={handleInputChange}
                  rows='3'
                  maxLength={100}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.descripcion_asignatura_origen ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Descripción del contenido de la asignatura...'
                />
                <ContadorCaracteres
                  actual={form.descripcion_asignatura_origen.length}
                  maximo={100}
                  nombre='descripcion_asignatura_origen'
                />
                <MostrarError campo='descripcion_asignatura_origen' />
              </div>
            </div>

            {/* Asignatura de Destino */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-700 border-b pb-2'>Asignatura de Destino</h3>

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
                  placeholder='Ej: Diseño y Arquitectura de Sistemas'
                />
                <ContadorCaracteres
                  actual={form.nombre_asignatura_destino.length}
                  maximo={35}
                  nombre='nombre_asignatura_destino'
                />
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
                  placeholder='Ej: ARQ-3150'
                />
                <ContadorCaracteres
                  actual={form.codigo_asignatura_destino.length}
                  maximo={7}
                  nombre='codigo_asignatura_destino'
                />
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
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Universidad de Destino <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='universidad_destino'
                  value={form.universidad_destino}
                  onChange={handleInputChange}
                  required
                  maxLength={40}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.universidad_destino ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='UNIMINUTO'
                />
                <ContadorCaracteres actual={form.universidad_destino.length} maximo={40} nombre='universidad_destino' />
                <MostrarError campo='universidad_destino' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Descripción (opcional)</label>
                <textarea
                  name='descripcion_asignatura_destino'
                  value={form.descripcion_asignatura_destino}
                  onChange={handleInputChange}
                  rows='3'
                  maxLength={100}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primario ${
                    erroresValidacion.descripcion_asignatura_destino ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Descripción del contenido de la asignatura equivalente...'
                />
                <ContadorCaracteres
                  actual={form.descripcion_asignatura_destino.length}
                  maximo={100}
                  nombre='descripcion_asignatura_destino'
                />
                <MostrarError campo='descripcion_asignatura_destino' />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className='mt-6 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Observaciones (opcional)</label>
              <textarea
                name='observaciones'
                value={form.observaciones}
                onChange={handleInputChange}
                rows='3'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primario'
                placeholder='La asignatura en la universidad de destino incluye contenidos adicionales sobre patrones arquitectónicos'
              />
            </div>
          </div>

          {/* Botones */}
          <div className='mt-8 flex justify-end space-x-4'>
            <button
              type='button'
              onClick={limpiarFormulario}
              className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all'
              disabled={guardando}
            >
              Limpiar Formulario
            </button>
            <button
              type='button'
              onClick={() => navigate('/solicitudes')}
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
              {guardando ? 'Guardando...' : 'Crear Asignatura'}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
