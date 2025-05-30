import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerAsignaturas, obtenerSolicitudPorId } from '../../lib/asignaturas-data'
import PageWrapper from '../../components/PageWrapper'

export function ListadoAsignaturas() {
  const [datos, setDatos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [solicitudData, setSolicitudData] = useState(null)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    id_solicitud: '',
    estado_actual: '',
    evaluaciones_recibidas: [],
    documentos_soporte: [],
    observaciones: 'El estudiante iniciará el intercambio en la fecha programada',
    responsable_seguimiento: 'María Castro - Coordinadora ORPI',
    reporte_avance: [],
    fecha_inicio: '',
    fecha_actualizacion: '',
  })

  const handleVerAsignatura = asignatura => {
    try {
      // Método 1: Guardamos en localStorage (como backup)
      localStorage.setItem('asignatura_seleccionada', JSON.stringify(asignatura))
      console.log('Datos guardados en localStorage:', asignatura)
      console.log('Navegando a:', `/asignaturas/${asignatura._id}`)

      // Método 2: Pasamos los datos a través del estado de navegación (más confiable)
      navigate(`/asignaturas/${asignatura._id}`, {
        state: { asignatura, solicitudData },
      })
    } catch (error) {
      console.error('Error al guardar en localStorage:', error)
      navigate(`/asignaturas/${asignatura._id}`, {
        state: { asignatura, solicitudData },
      })
    }
  }

  const handleCrearAsignatura = () => {
    try {
      // Preparamos los datos completos para crear asignatura usando la estructura correcta
      const datosParaCrear = {
        id_solicitud: form.id_solicitud,
        // Datos del estudiante (desde solicitante)
        nombre_estudiante: solicitudData?.solicitante?.nombre_completo || '',
        documento_estudiante: solicitudData?.solicitante?.documento_identidad || '',
        programa_origen: solicitudData?.solicitante?.programa_academico || '',
        facultad_origen: solicitudData?.solicitante?.facultad || '',
        semestre_estudiante: solicitudData?.solicitante?.semestre || '',
        creditos_cursados: solicitudData?.solicitante?.creditos_cursados || '',
        promedio_academico: solicitudData?.solicitante?.promedio_academico || '',
        email_estudiante: solicitudData?.solicitante?.email || '',
        telefono_estudiante: solicitudData?.solicitante?.telefono || '',

        // Datos de la universidad y convenio
        nombre_universidad: solicitudData?.convenio?.nombre_institucion || '',
        pais_universidad: solicitudData?.convenio?.pais_institucion || '',
        ciudad_universidad: solicitudData?.convenio?.ciudad_institucion || '',
        tipo_convenio: solicitudData?.convenio?.tipo_convenio || '',
        convenio_descripcion: solicitudData?.convenio?.descripcion || '',
        requisitos_especificos: solicitudData?.convenio?.requisitos_especificos || '',
        beneficios: solicitudData?.convenio?.beneficios || '',

        // Datos de la solicitud
        periodo_academico: solicitudData?.periodo_academico || '',
        modalidad: solicitudData?.modalidad || '',
        tipo_intercambio: solicitudData?.tipo_intercambio || '',
        duracion: solicitudData?.duracion || '',
        estado_solicitud: solicitudData?.estado_solicitud || '',
        fecha_solicitud: solicitudData?.fecha_solicitud || '',

        // Contacto de la institución
        contacto_institucion: solicitudData?.convenio?.contacto_institucion || null,
      }

      // Guardamos todos los datos necesarios en localStorage
      localStorage.setItem('datos_crear_asignatura', JSON.stringify(datosParaCrear))
      localStorage.setItem('id_solicitud_crear', form.id_solicitud)

      console.log('Datos guardados para crear asignatura:', datosParaCrear)

      // Navegamos a la ruta de crear asignatura
      navigate('/asignaturas/crearAsignaturas', {
        state: { datosCreacion: datosParaCrear },
      })
    } catch (error) {
      console.error('Error al preparar datos para crear asignatura:', error)
      localStorage.setItem('id_solicitud_crear', form.id_solicitud)
      navigate('/asignaturas/crearAsignaturas')
    }
  }

  // Función para cargar los datos de la solicitud
  const cargarDatosSolicitud = async idSolicitud => {
    try {
      console.log('Cargando datos de solicitud:', idSolicitud)
      const solicitud = await obtenerSolicitudPorId(idSolicitud)
      console.log('Datos de solicitud obtenidos:', solicitud)
      setSolicitudData(solicitud)
      return solicitud
    } catch (error) {
      console.error('Error al cargar datos de solicitud:', error)
      setSolicitudData(null)
      return null
    }
  }

  useEffect(() => {
    const idGuardado = localStorage.getItem('id_solicitud_seleccionada')
    if (idGuardado) {
      setForm(prev => ({ ...prev, id_solicitud: idGuardado }))
      localStorage.removeItem('id_solicitud_seleccionada')
    }
  }, [])

  useEffect(() => {
    if (!form.id_solicitud) return

    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar datos de solicitud y asignaturas en paralelo
        const [solicitudPromise, asignaturasPromise] = await Promise.allSettled([
          cargarDatosSolicitud(form.id_solicitud),
          obtenerAsignaturas(form.id_solicitud),
        ])

        // Procesar resultado de asignaturas
        if (asignaturasPromise.status === 'fulfilled') {
          const response = asignaturasPromise.value
          console.log('Asignaturas obtenidas:', response.asignaturas)

          // Si la respuesta es un array directo
          if (Array.isArray(response.asignaturas)) {
            setDatos(response.asignaturas)
          }
          // Si la respuesta viene dentro de un objeto con una propiedad específica
          else if (response.data && Array.isArray(response.data)) {
            setDatos(response.data)
          }
          // Si es un solo objeto, lo convertimos en array
          else if (response && typeof response === 'object') {
            setDatos([response])
          } else {
            setDatos([])
          }
        } else {
          throw asignaturasPromise.reason
        }
      } catch (error) {
        console.error('Error al cargar datos:', error)
        setError(error.message || 'No se pudieron cargar los datos')
        setDatos([])

        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          setError('Error de conexión. Verifique su conexión a internet.')
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setError('Token de autenticación expirado')
          localStorage.removeItem('site')
          navigate('/login')
          return
        } else {
          if (error.message.includes('404')) {
            setError('No hay equivalencias registradas')
          } else {
            setError(error.message || 'No se pudieron cargar los datos')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [form.id_solicitud, navigate])

  if (loading) {
    return (
      <PageWrapper>
        <div className='max-w-6xl mx-auto p-6'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primario'></div>
            <span className='ml-3 text-gray-600'>Cargando datos...</span>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div className='max-w-6xl mx-auto p-6'>
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
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Gestión de Asignaturas</h1>
            {solicitudData && (
              <div className='mt-2 text-sm text-gray-600'>
                <p>
                  <strong>Estudiante:</strong> {solicitudData.solicitante?.nombre_completo || 'No especificado'}
                </p>
                <p>
                  <strong>Programa:</strong> {solicitudData.solicitante?.programa_academico || 'No especificado'}
                </p>
                <p>
                  <strong>Universidad destino:</strong>{' '}
                  {solicitudData.convenio?.nombre_institucion || 'No especificada'}
                </p>
                <p>
                  <strong>País:</strong> {solicitudData.convenio?.pais_institucion || 'No especificado'}
                </p>
                <p>
                  <strong>Tipo de convenio:</strong> {solicitudData.convenio?.tipo_convenio || 'No especificado'}
                </p>
                <p>
                  <strong>Estado solicitud:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs text-white ${
                      solicitudData.estado_solicitud === 'aprobada'
                        ? 'bg-green-500'
                        : solicitudData.estado_solicitud === 'pendiente'
                        ? 'bg-yellow-500'
                        : solicitudData.estado_solicitud === 'rechazada'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {solicitudData.estado_solicitud || 'No especificado'}
                  </span>
                </p>
              </div>
            )}
          </div>
          <button
            className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2'
            onClick={handleCrearAsignatura}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Nueva Asignatura
          </button>
        </div>

        <div className='bg-white rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6'>Listado de Asignaturas</h2>

          {datos.length === 0 ? (
            <div className='text-center py-12'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 mx-auto text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              <p className='mt-4 text-gray-500'>No hay asignaturas registradas</p>
              <button
                className='mt-4 bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg transition-all'
                onClick={handleCrearAsignatura}
              >
                Registrar Asignatura
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {datos.map(asignatura => (
                <div
                  key={asignatura._id}
                  className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() => handleVerAsignatura(asignatura)}
                >
                  <div className='p-5'>
                    <h3 className='text-lg font-medium text-center text-gray-800 mb-1'>
                      {asignatura.nombre_asignatura_origen}
                    </h3>

                    <p className='text-sm text-center text-gray-500'>Código: {asignatura.codigo_asignatura_origen}</p>
                    <p className='text-sm text-center text-gray-500'>
                      Equivale a: {asignatura.nombre_asignatura_destino}
                    </p>
                    <div className='mt-3 flex justify-between items-center text-xs'>
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          asignatura.estado_equivalencia === 'propuesta'
                            ? 'bg-yellow-500'
                            : asignatura.estado_equivalencia === 'aprobada'
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                        }`}
                      >
                        {asignatura.estado_equivalencia}
                      </span>
                      <span className='text-gray-500'>{asignatura.creditos_asignatura_origen} créditos</span>
                    </div>
                  </div>
                  <div className='px-6 py-4 whitespace-nowrap text-sm font-medium border-t border-gray-100'>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleVerAsignatura(asignatura)
                      }}
                      className='text-primario hover:text-oscuro mr-3 transition-colors'
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
