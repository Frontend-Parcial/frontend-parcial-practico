import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerAsignaturas } from '../../lib/asignaturas-data'
import PageWrapper from '../../components/PageWrapper'

export function ListadoAsignaturas() {
  const [datos, setDatos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const idGuardado = localStorage.getItem('id_solicitud_seleccionada')
    if (idGuardado) {
      setForm(prev => ({ ...prev, id_solicitud: idGuardado }))
      localStorage.removeItem('id_solicitud_seleccionada')
    }
  }, [])

  useEffect(() => {
    if (!form.id_solicitud) return
    const cargarAsignaturas = async () => {
      try {
        setLoading(true)
        setError(null)

        const asignaturas = await obtenerAsignaturas(form.id_solicitud)

        // Si la respuesta es un array directo
        if (Array.isArray(asignaturas)) {
          setDatos(asignaturas)
        }
        // Si la respuesta viene dentro de un objeto con una propiedad específica
        else if (asignaturas.data && Array.isArray(asignaturas.data)) {
          setDatos(asignaturas.data)
        }
        // Si es un solo objeto, lo convertimos en array
        else if (asignaturas && typeof asignaturas === 'object') {
          setDatos([asignaturas])
        } else {
          setDatos([])
        }
      } catch (error) {
        console.error('Error al cargar asignaturas:', error)
        if (error.message.includes('404')) {
          setError('No hay equivalencia')
        } else {
          setError(error.message || 'No se pudieron cargar las asignaturas')
        }
        setDatos([])
      } finally {
        setLoading(false)
      }
    }

    cargarAsignaturas()
  }, [form.id_solicitud])

  if (loading) {
    return (
      <PageWrapper>
        <div className='max-w-6xl mx-auto p-6'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primario'></div>
            <span className='ml-3 text-gray-600'>Cargando asignaturas...</span>
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
            <button
              onClick={() => window.location.reload()}
              className='mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm'
            >
              Reintentar
            </button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Gestión de Asignaturas</h1>
          <button
            className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2'
            onClick={() => navigate('/asignaturas/nueva')}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
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
                onClick={() => navigate('/asignaturas/nueva')}
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
                  onClick={() => navigate(`/asignaturas/${asignatura._id}`)}
                >
                  <div className='p-5'>
                    <h3 className='text-lg font-medium text-center text-gray-800 mb-1'>
                      {asignatura.nombre_asignatura_origen}
                    </h3>
                    <p className='text-sm text-center text-gray-500'>ID solicitud: </p>
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
