import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
const userToken = localStorage.getItem('site')

const ListaSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    pages: 1,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const cargarSolicitudes = async () => {
      const apiUrl = import.meta.env.VITE_API_URL
      try {
        setLoading(true)
        const response = await fetch(`${apiUrl}/solicitudes/?page=${pagination.page}&per_page=${pagination.perPage}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        const data = await response.json()
        console.log(data.solicitudes[0].solicitante)
        if (!response.ok) throw new Error(data.message || 'Error al cargar solicitudes')

        setSolicitudes(data.solicitudes || [])
        setPagination({
          page: data.page || 1,
          perPage: data.per_page || 10,
          total: data.total || 0,
          pages: data.pages || 1,
        })
      } catch (err) {
        console.error('Error al cargar solicitudes:', err)
        setError(err.message || 'Error al cargar las solicitudes')
      } finally {
        setLoading(false)
      }
    }
    cargarSolicitudes()
  }, [pagination.page])

  const handleVerSeguimiento = id => {
    localStorage.setItem('id_solicitud_seleccionada', id)
    window.location.href = '/seguimiento'
  }

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const formatFecha = fechaString => {
    const fechaReal = fechaString?.$date ? fechaString.$date : fechaString
    const fecha = new Date(fechaReal)
    if (isNaN(fecha)) return 'Fecha inválida'

    return (
      <div>
        <div>
          {fecha.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </div>
        <div className='text-xs text-gray-600'>
          {fecha.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    )
  }

  const getEstadoColor = estado => {
    switch (estado.toLowerCase()) {
      case 'aprobado':
        return 'bg-green-100 text-green-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en revision':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <PageWrapper>
      <div className='min-h-screen flex flex-col'>
        <main className='flex-grow bg-gray-100 p-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-800'>Listado de Solicitudes</h2>
                <a
                  href='/solicitudes/nuevo'
                  className='bg-primario text-white px-4 py-2 rounded hover:bg-primario/90 transition'
                >
                  Crear Solicitud
                </a>
              </div>

              {loading ? (
                <div className='flex justify-center items-center p-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primario'></div>
                </div>
              ) : error ? (
                <div className='p-4 text-red-500 text-center'>{error}</div>
              ) : solicitudes.length === 0 ? (
                <div className='p-4 text-gray-500 text-center'>No hay solicitudes registradas</div>
              ) : (
                <>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Estudiante
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Convenio
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Periodo
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Fecha
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Estado
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {solicitudes.map(solicitud => (
                          <tr key={solicitud._id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='font-medium text-gray-900'>{solicitud.solicitante.nombre}</div>
                              <div className='text-sm text-gray-500'>{solicitud.solicitante.programa}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='font-medium text-gray-900'>{solicitud.convenio.nombre_institucion}</div>
                              <div className='text-sm text-gray-500'>
                                {solicitud.convenio.pais} ({solicitud.convenio.tipo})
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {solicitud.periodo_academico}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {formatFecha(solicitud.fecha_solicitud)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                                  solicitud.estado_solicitud,
                                )}`}
                              >
                                {solicitud.estado_solicitud}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              <button
                                onClick={() => handleVerSeguimiento(solicitud._id)}
                                className='text-primario hover:text-oscuro mr-3'
                              >
                                Ver Seguimiento
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginación */}
                  <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
                    <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                      <div>
                        <p className='text-sm text-gray-700'>
                          Mostrando{' '}
                          <span className='font-medium'>{(pagination.page - 1) * pagination.perPage + 1}</span> a{' '}
                          <span className='font-medium'>
                            {Math.min(pagination.page * pagination.perPage, pagination.total)}
                          </span>{' '}
                          de <span className='font-medium'>{pagination.total}</span> resultados
                        </p>
                      </div>
                      <div>
                        <nav
                          className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                          aria-label='Pagination'
                        >
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                              pagination.page === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span className='sr-only'>Anterior</span>
                            <svg
                              className='h-5 w-5'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                              aria-hidden='true'
                            >
                              <path
                                fillRule='evenodd'
                                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>

                          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum
                            if (pagination.pages <= 5) {
                              pageNum = i + 1
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1
                            } else if (pagination.page >= pagination.pages - 2) {
                              pageNum = pagination.pages - 4 + i
                            } else {
                              pageNum = pagination.page - 2 + i
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  pagination.page === pageNum
                                    ? 'z-10 bg-primario border-primario text-complementario'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          })}

                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                              pagination.page === pagination.pages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span className='sr-only'>Siguiente</span>
                            <svg
                              className='h-5 w-5'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                              aria-hidden='true'
                            >
                              <path
                                fillRule='evenodd'
                                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}

export default ListaSolicitudes
