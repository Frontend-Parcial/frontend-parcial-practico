import { useEffect, useState } from 'react'
import { listStudents } from '../../lib/estudiantes-data'
import { useNavigate } from 'react-router-dom'

//! ESTE ES EL PUNTO DE ENTRADA DE LOS ESTUDIANTES
export function ListadoEstudiantes() {
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await listStudents()
      setDatos(data)
    }

    fetchData()
  }, [])

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Gestión de Estudiantes</h1>
        <button
          className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2'
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

      <div className='bg-white rounded-xl shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-700 mb-6'>Listado de Estudiantes</h2>

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
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
              />
            </svg>
            <p className='mt-4 text-gray-500'>No hay estudiantes registrados</p>
            <button
              className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all'
              onClick={() => navigate('/estudiantes/nuevo')}
            >
              Registrar Primer Estudiante
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {datos.map(estudiante => (
              <div
                key={estudiante._id}
                className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => navigate(`/estudiantes/${estudiante._id}`)}
              >
                <div className='p-5'>
                  <div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 text-blue-600'
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
                  <span className='text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors'>
                    Ver detalles →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
