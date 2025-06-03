import { useEffect, useState } from 'react'
import { listStudents, listStudentsPaginate } from '../../lib/estudiantes-data'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'

//! ESTE ES EL PUNTO DE ENTRADA DE LOS ESTUDIANTES
export function ListadoEstudiantes() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    pages: 1,
  })
  useEffect(() => {
    const fetchData = async () => {
      const data = await listStudentsPaginate(`?page=${pagination.page}&per_page=${pagination.perPage}`)
      setDatos(data.estudiantes)
      setPagination({
          page: data.page || 1,
          perPage: data.per_page || 10,
          total: data.total || 0,
          pages: data.pages || 1,
        })
      setLoading(false)
    }

    fetchData()
  }, [pagination.page])
  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  return (
    <PageWrapper>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Gestión de Estudiantes</h1>
          <div className="flex items-center gap-4">
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='cursor-pointer bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 font-medium text-base shadow-md hover:shadow-lg transition-all'
            >
              Atrás
            </button>
            <button
              className='cursor-pointer bg-primario text-white py-2 px-6 rounded-lg hover:bg-oscuro font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center'
              onClick={() => navigate('/estudiantes/nuevo')}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Nuevo Estudiante
            </button>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6'>Listado de Estudiantes</h2>

          {loading ? (
            <div className='flex justify-center items-center p-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primario'></div>
            </div>
          ) : datos.length === 0 ? (
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
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
              <p className='mt-4 text-gray-500'>No hay estudiantes registrados</p>
              <button
                className='mt-4 bg-oscuro hover:bg-primario text-white px-6 py-2 rounded-lg transition-all'
                onClick={() => navigate('/estudiantes/nuevo')}
              >
                Registrar Primer Estudiante
              </button>
            </div>
          ) : (
            <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {datos.map(estudiante => (
                <div
                  key={estudiante._id}
                  className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() => navigate(`/estudiantes/${estudiante._id}`)}
                >
                  <div className='p-5'>
                    <div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-claro rounded-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-primario'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-lg font-medium text-center text-gray-800 mb-1'>{estudiante.nombre_completo}</h3>
                    <p className='text-sm text-center text-gray-500'>ID: {estudiante.documento_identidad}</p>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 text-right'>
                    <span className='text-xs font-medium text-primario hover:text-claro transition-colors'>
                      Ver detalles →
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
                                    ? 'z-10 bg-primario border-primario text-white'
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
    </PageWrapper>
  )
}
