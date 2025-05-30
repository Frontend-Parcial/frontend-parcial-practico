import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'

export function DetalleAsignaturas() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asignatura, setAsignatura] = useState(null)
  const [solicitudInfo, setSolicitudInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarAsignatura = () => {
      try {
        // Intentamos obtener la asignatura del localStorage
        const asignaturaGuardada = localStorage.getItem('asignatura_seleccionada')
        const solicitudGuardada = localStorage.getItem('solicitud_info_detalle')

        if (asignaturaGuardada) {
          const asignaturaData = JSON.parse(asignaturaGuardada)
          setAsignatura(asignaturaData)

          // Si hay información de la solicitud, la cargamos también
          if (solicitudGuardada) {
            const solicitudData = JSON.parse(solicitudGuardada)
            setSolicitudInfo(solicitudData)
            localStorage.removeItem('solicitud_info_detalle')
          }

          // Limpiamos el localStorage después de usar los datos
          localStorage.removeItem('asignatura_seleccionada')
        } else {
          // Si no hay datos en localStorage, podrías hacer una llamada a la API
          console.error('No se encontraron datos de la asignatura')
        }
      } catch (error) {
        console.error('Error al cargar los datos de la asignatura:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarAsignatura()
  }, [id])

  const handleCrearAsignatura = () => {
    // Guardamos todos los datos necesarios en localStorage
    localStorage.setItem('id_solicitud_crear', asignatura.id_solicitud?.$oid || asignatura.id_solicitud)

    // Si tenemos información de la solicitud, la pasamos
    if (solicitudInfo) {
      localStorage.setItem('nombre_estudiante_crear', solicitudInfo.nombre_estudiante || '')
      localStorage.setItem('convenio_crear', solicitudInfo.convenio || '')
    }

    // Pasamos también la universidad de origen de la asignatura actual
    localStorage.setItem('universidad_origen_crear', asignatura.universidad_origen || '')

    navigate('/asignaturas/crearAsignaturas')
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className='max-w-4xl mx-auto p-6'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primario'></div>
            <span className='ml-3 text-gray-600'>Cargando detalles...</span>
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
              <span className='text-red-800'>No se pudieron cargar los detalles de la asignatura</span>
            </div>
          </div>
          <div className='mt-4'>
            <button
              onClick={() => navigate('/solicitudes')}
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
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Detalles de la Asignatura</h1>
            <p className='text-gray-600'>
              ID SOLICITUD: <span className='font-mono bg-gray-100 px-2 py-1 rounded'>{asignatura._id}</span>
            </p>
            {solicitudInfo && (
              <div className='mt-2 text-sm text-gray-600'>
                <p>
                  Estudiante: <span className='font-semibold'>{solicitudInfo.nombre_estudiante}</span>
                </p>
                {solicitudInfo.convenio && (
                  <p>
                    Convenio: <span className='font-semibold'>{solicitudInfo.convenio}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Información de la Asignatura de Origen */}
          <div className='bg-white rounded-xl shadow-md p-6'>
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
              Asignatura de Origen
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Nombre</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>{asignatura.nombre_asignatura_origen}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Código</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg font-mono'>
                  {asignatura.codigo_asignatura_origen}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Créditos</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>{asignatura.creditos_asignatura_origen}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Universidad</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>{asignatura.universidad_origen}</p>
              </div>
            </div>
          </div>

          {/* Información de la Asignatura de Destino */}
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Asignatura Equivalente
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Nombre</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>{asignatura.nombre_asignatura_destino}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Código</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg font-mono'>
                  {asignatura.codigo_asignatura_destino}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Créditos</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>{asignatura.creditos_asignatura_destino}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Estado de Equivalencia</label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    asignatura.estado_equivalencia === 'propuesta'
                      ? 'bg-yellow-100 text-yellow-800'
                      : asignatura.estado_equivalencia === 'aprobada'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {asignatura.estado_equivalencia}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className='mt-6 bg-white rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>Información Adicional</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-600 mb-1'>ID Solicitud</label>
              <p className='text-gray-800 bg-gray-50 p-3 rounded-lg font-mono'>
                {asignatura.id_solicitud?.$oid || asignatura.id_solicitud}
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-600 mb-1'>Porcentaje de Equivalencia</label>
              <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>
                {asignatura.porcentaje_equivalencia ? `${asignatura.porcentaje_equivalencia}%` : 'No especificado'}
              </p>
            </div>
            {asignatura.observaciones && (
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Observaciones</label>
                <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>{asignatura.observaciones}</p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className='mt-6 flex justify-end gap-4'>
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
          <button
            onClick={() => navigate(`/asignaturas/editar/${asignatura._id}`)}
            className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
            </svg>
            Editar
          </button>
          <button
            onClick={() => navigate('/solicitudes')}
            className='bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all'
          >
            Volver al Listado
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}
