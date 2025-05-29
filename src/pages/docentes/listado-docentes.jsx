import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listDocentes } from '../../lib/docentes-data'
import PageWrapper from '../../components/PageWrapper'

//! ESTE ES EL PUNTO DE ENTRADA DE LOS DOCENTES
export function ListadoDocentes() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await listDocentes()
      setDatos(data)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <PageWrapper>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Gestión de Docentes</h1>
          <button
            className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2'
            onClick={() => navigate('/docentes/nuevo')}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Nuevo Docente
          </button>
        </div>

        <div className='bg-white rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6'>Listado de Docentes</h2>

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
              <p className='mt-4 text-gray-500'>No hay docentes registrados</p>
              <button
                className='mt-4 bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg transition-all'
                onClick={() => navigate('/docentes/nuevo')}
              >
                Registrar Primer Docente
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {datos.map(docente => (
                <div
                  key={docente._id}
                  className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() => navigate(`/docentes/${docente._id}`)}
                >
                  <div className='p-5'>
                    <div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-claro rounded-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-oscuro'
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
                    <h3 className='text-lg font-medium text-center text-gray-800 mb-1'>{docente.nombre_completo}</h3>
                    <p className='text-sm text-center text-gray-500'>ID: {docente.documento_identidad}</p>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 text-right'>
                    <span className='text-xs font-medium text-claro hover:text-primario transition-colors'>
                      Ver detalles →
                    </span>
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
