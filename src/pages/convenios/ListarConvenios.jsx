import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { FiEye } from 'react-icons/fi'
import { HiOutlineBookOpen } from 'react-icons/hi'

const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

const ListaConvenios = () => {
  const [convenios, setConvenios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    pages: 1,
  })
  const [filtroTipo, setFiltroTipo] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const cargarConvenios = async () => {
      const apiUrl = import.meta.env.VITE_API_URL
      try {
        setLoading(true)

        let url = `${apiUrl}/convenios/?page=${pagination.page}&per_page=${pagination.perPage}`
        if (filtroTipo) {
          url += `&tipo=${filtroTipo}`
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message || 'Error al cargar convenios')

        setConvenios(data.convenios || [])
        setPagination({
          page: data.page || 1,
          perPage: data.per_page || 10,
          total: data.total || 0,
          pages: data.pages || 1,
        })
      } catch (err) {
        console.error('Error al cargar convenios:', err)
        setError(err.message || 'Error al cargar los convenios')
      } finally {
        setLoading(false)
      }
    }
    cargarConvenios()
  }, [pagination.page, filtroTipo])

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const formatFecha = fechaString => {
    const fecha = new Date(fechaString)
    if (isNaN(fecha)) return 'Fecha inválida'

    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getEstadoColor = estado => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800'
      case 'inactivo':
        return 'bg-red-100 text-red-800'
      case 'vencido':
        return 'bg-orange-100 text-orange-800'
      case 'en renovación':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  const handleVerConvenio = id => {
    window.location.href = `/convenios/${id}`
  }
  const handleFiltroChange = e => {
    setFiltroTipo(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 })) // Resetear a primera página al cambiar filtro
  }

  return (
    <PageWrapper>
      <div className='min-h-screen flex flex-col'>
        <main className='flex-grow bg-gray-100 p-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <h2 className='text-xl font-semibold text-gray-800'>Listado de Convenios</h2>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <select
                    value={filtroTipo}
                    onChange={handleFiltroChange}
                    className='border border-gray-300 rounded px-3 py-1 text-sm'
                  >
                    <option value=''>Todos los tipos</option>
                    <option value='nacional'>Nacional</option>
                    <option value='internacional'>Internacional</option>
                  </select>
                  <button
                    type='button'
                    onClick={() => navigate(-1)}
                    className='bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 font-medium text-base shadow-md hover:shadow-lg transition-all'
                  >
                    Atras
                  </button>
                  <a
                    href='/convenios/nuevo'
                    className='bg-primario text-white py-2 px-6 rounded-lg hover:bg-oscuro font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center'
                  >
                    Crear Convenio
                  </a>
                </div>
              </div>

              {loading ? (
                <div className='flex justify-center items-center p-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primario'></div>
                </div>
              ) : error ? (
                <div className='p-4 text-red-500 text-center'>{error}</div>
              ) : convenios.length === 0 ? (
                <div className='p-4 text-gray-500 text-center'>No hay convenios registrados</div>
              ) : (
                <>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Institución
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Ubicación
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Tipo
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Vigencia
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {convenios.map(convenio => (
                          <tr key={convenio._id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='font-medium text-gray-900'>{convenio.nombre_institucion}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-gray-900'>{convenio.ciudad_institucion}</div>
                              <div className='text-sm text-gray-500'>{convenio.pais_institucion}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  convenio.tipo_convenio === 'internacional'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {convenio.tipo_convenio}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              <div>Inicio: {formatFecha(convenio.fecha_inicio)}</div>
                              <div>Fin: {formatFecha(convenio.fecha_fin)}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                                  convenio.estado,
                                )}`}
                              >
                                {convenio.estado}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              <button
                                onClick={() => handleVerConvenio(convenio._id)}
                                title='Ver detalle'
                                className='text-primario hover:text-oscuro transition-colors duration-200'
                              >
                                <FiEye size={20} />
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

export default ListaConvenios
