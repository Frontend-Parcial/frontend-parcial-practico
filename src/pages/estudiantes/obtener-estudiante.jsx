import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStudents } from '../../lib/estudiantes-data'
import PageWrapper from '../../components/PageWrapper'

export function ObtenerEstudiante() {
  const { id } = useParams()
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudents(id)
      setDatos([data])
    }
    fetchData()
  }, [id])

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Detalles del Estudiante</h1>
            <p className='text-gray-600'>
              ID de Estudiante: <span className='font-mono bg-gray-100 px-2 py-1 rounded'>{id}</span>
            </p>
          </div>
          <button
            type='button'
            className='cursor-pointer bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition-all'
            onClick={() => navigate(`/estudiantes/actualizar/${id}`)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
            </svg>
            Actualizar Datos
          </button>
        </div>

        {datos.map(estudiante => (
          <div key={estudiante._id} className='bg-white rounded-xl shadow-md overflow-hidden'>
            <div className='bg-gradient-to-r from-oscuro to-claro p-6 text-white'>
              <div className='flex items-center gap-6'>
                <div className='w-20 h-20 rounded-full bg-primario flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-10 w-10'
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
                <div>
                  <h2 className='text-2xl font-bold'>{estudiante.nombre_completo}</h2>
                  <p className='text-gris-claro'>{estudiante.programa_academico}</p>
                  <p className='text-gris-claro'>{estudiante.facultad}</p>
                </div>
              </div>
            </div>

            {/* Información detallada */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Información Personal</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Documento:</span> {estudiante.documento_identidad}
                    </p>
                    <p>
                      <span className='font-medium'>Tipo Documento:</span> {estudiante.tipo_documento}
                    </p>
                    <p>
                      <span className='font-medium'>Fecha Nacimiento:</span> {estudiante.fecha_nacimiento}
                    </p>
                    <p>
                      <span className='font-medium'>Email:</span> {estudiante.email}
                    </p>
                    <p>
                      <span className='font-medium'>Teléfono:</span> {estudiante.telefono}
                    </p>
                    <p>
                      <span className='font-medium'>Dirección:</span> {estudiante.direccion}
                    </p>
                    <p>
                      <span className='font-medium'>Facultad:</span> {estudiante.facultad}
                    </p>
                    <p>
                      <span className='font-medium'>Programa Academico:</span> {estudiante.programa_academico}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Información Académica</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Semestre:</span> {estudiante.semestre}
                    </p>
                    <p>
                      <span className='font-medium'>Créditos Cursados:</span> {estudiante.creditos_cursados}
                    </p>
                    <p>
                      <span className='font-medium'>Promedio Académico:</span> {estudiante.promedio_academico}
                    </p>
                    <p>
                      <span className='font-medium'>Estado:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          estudiante.estado === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : estudiante.estado === 'Inactivo'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {estudiante.estado}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Sanciones</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Sanciones Académicas:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          estudiante.sanciones_academicas ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {estudiante.sanciones_academicas || 'Ninguna'}
                      </span>
                    </p>
                    <p>
                      <span className='font-medium'>Sanciones Disciplinarias:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          estudiante.sanciones_disciplinarias ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {estudiante.sanciones_disciplinarias || 'Ninguna'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className='bg-gray-50 px-6 py-4 flex justify-end gap-4'>
              <button
                type='button'
                className='cursor-pointer text-gray-700 hover:text-gray-900 font-medium'
                onClick={() => navigate(-1)}
              >
                Volver al listado
              </button>
              <button
                type='button'
                className='cursor-pointer bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition-all'
                onClick={() => navigate(`/estudiantes/actualizar/${id}`)}
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                </svg>
                Editar Estudiante
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
