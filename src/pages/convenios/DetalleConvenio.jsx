import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'

const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export function DetalleConvenio() {
  const { id } = useParams()
  const [convenio, setConvenio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiUrl}/convenios/${id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Error al obtener el convenio')
        }

        const data = await response.json()
        setConvenio(data)
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-CO', options)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primario'></div>
        </div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto mt-6'
          role='alert'
        >
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
        </div>
      </PageWrapper>
    )
  }

  if (!convenio) {
    return (
      <PageWrapper>
        <div
          className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-4xl mx-auto mt-6'
          role='alert'
        >
          <span className='block sm:inline'>No se encontró el convenio solicitado</span>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Detalles del Convenio</h1>
            <p className='text-gray-600'>
              ID del Convenio: <span className='font-mono bg-gray-100 px-2 py-1 rounded'>{id}</span>
            </p>
          </div>
          <button
            type='button'
            className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition-all'
            onClick={() => navigate(`/convenios/actualizar/${id}`)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
            </svg>
            Actualizar Convenio
          </button>
        </div>

        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='bg-gradient-to-r from-claro to-oscuro p-6 text-white'>
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
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <div>
                <h2 className='text-2xl font-bold'>{convenio.nombre_institucion}</h2>
                <p className='text-gris-claro'>
                  {convenio.ciudad_institucion}, {convenio.pais_institucion}
                </p>
                <span
                  className={`mt-2 px-3 py-1 text-xs rounded-full ${
                    convenio.tipo_convenio === 'internacional'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {convenio.tipo_convenio}
                </span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Información Básica</h3>
                <div className='mt-2 space-y-3'>
                  <p>
                    <span className='font-medium'>Estado:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        convenio.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : convenio.estado === 'vencido'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {convenio.estado}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Fecha Inicio:</span> {formatDate(convenio.fecha_inicio)}
                  </p>
                  <p>
                    <span className='font-medium'>Fecha Fin:</span> {formatDate(convenio.fecha_fin)}
                  </p>
                  <p>
                    <span className='font-medium'>Cupos Disponibles:</span> {convenio.cupos_disponibles}
                  </p>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>Descripción</h3>
                <div className='mt-2 space-y-3'>
                  <p className='text-gray-700'>{convenio.descripcion}</p>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Contacto</h3>
                <div className='mt-2 space-y-3'>
                  <p>
                    <span className='font-medium'>Nombre:</span> {convenio.contacto_institucion.nombre}
                  </p>
                  <p>
                    <span className='font-medium'>Cargo:</span> {convenio.contacto_institucion.cargo}
                  </p>
                  <p>
                    <span className='font-medium'>Email:</span> {convenio.contacto_institucion.email}
                  </p>
                  <p>
                    <span className='font-medium'>Teléfono:</span> {convenio.contacto_institucion.telefono}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='px-6 pb-6 space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Requisitos Específicos</h3>
              <div className='mt-2'>
                <p className='text-gray-700 whitespace-pre-line'>{convenio.requisitos_especificos}</p>
              </div>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>Beneficios</h3>
              <div className='mt-2'>
                <p className='text-gray-700 whitespace-pre-line'>{convenio.beneficios}</p>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 px-6 py-4 flex justify-end gap-4'>
            <button
              type='button'
              className='text-gray-700 hover:text-gray-900 font-medium'
              onClick={() => navigate(-1)}
            >
              Volver al listado
            </button>
            <button
              type='button'
              className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition-all'
              onClick={() => navigate(`/convenios/actualizar/${id}`)}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
              </svg>
              Editar Convenio
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
