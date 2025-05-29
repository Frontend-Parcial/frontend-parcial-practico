import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDocentesXid } from '../../lib/docentes-data'
import PageWrapper from '../../components/PageWrapper'

export function ObtenerDocentes() {
  const { id } = useParams()
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocentesXid(id)
      setDatos([data]) // Convertimos a array con []
    }
    fetchData()
  }, [id])

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Detalles del Docente</h1>
            <p className='text-gray-600'>
              ID del Docente: <span className='font-mono bg-gray-100 px-2 py-1 rounded'>{id}</span>
            </p>
          </div>
          <button
            type='button'
            className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition-all'
            onClick={() => navigate(`/docentes/actualizar/${id}`)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
            </svg>
            Actualizar Datos
          </button>
        </div>

        {datos.map(docente => (
          <div key={docente._id} className='bg-white rounded-xl shadow-md overflow-hidden'>
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
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <div>
                  <h2 className='text-2xl font-bold'>{docente.nombre_completo}</h2>
                  <p className='text-gris-claro'>{docente.departamento}</p>
                  <p className='text-gris-claro'>{docente.facultad}</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Información Personal</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Documento:</span> {docente.documento_identidad}
                    </p>
                    <p>
                      <span className='font-medium'>Tipo Documento:</span> {docente.tipo_documento}
                    </p>
                    <p>
                      <span className='font-medium'>Fecha Nacimiento:</span> {docente.fecha_nacimiento}
                    </p>
                    <p>
                      <span className='font-medium'>Email:</span> {docente.email}
                    </p>
                    <p>
                      <span className='font-medium'>Teléfono:</span> {docente.telefono}
                    </p>
                    <p>
                      <span className='font-medium'>Dirección:</span> {docente.direccion}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Formación Académica</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Pregrado:</span> {docente.titulo_pregrado}
                    </p>
                    <p>
                      <span className='font-medium'>Posgrado:</span> {docente.titulo_posgrado}
                    </p>
                    <p>
                      <span className='font-medium'>Nivel Formación:</span> {docente.nivel_formacion}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Experiencia y Categoría</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Categoría Docente:</span> {docente.categoria_docente}
                    </p>
                    <p>
                      <span className='font-medium'>Tipo de Vinculación:</span> {docente.tipo_vinculacion}
                    </p>
                    <p>
                      <span className='font-medium'>Años de Experiencia:</span> {docente.anos_experiencia}
                    </p>
                    <p>
                      <span className='font-medium'>En la Institución:</span> {docente.anos_experiencia_institucion}
                    </p>
                    <p>
                      <span className='font-medium'>Escalafón:</span> {docente.escalafon}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Evaluación y Estado</h3>
                  <div className='mt-2 space-y-3'>
                    <p>
                      <span className='font-medium'>Evaluación Promedio:</span> {docente.evaluacion_docente_promedio}
                    </p>
                    <p>
                      <span className='font-medium'>Estado:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          docente.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {docente.estado}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-6 pb-6 space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500'>Idiomas</h3>
                <ul className='list-disc list-inside text-sm text-gray-700'>
                  {docente.idiomas.map((idioma, index) => (
                    <li key={index}>
                      {idioma.idioma} - Nivel: {idioma.nivel}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>Áreas de Conocimiento</h3>
                <ul className='list-disc list-inside text-sm text-gray-700'>
                  {docente.areas_conocimiento.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>Participación en Investigación</h3>
                <p>
                  <span className='font-medium'>Publicaciones:</span> {docente.publicaciones}
                </p>
                <p>
                  <span className='font-medium'>Proyectos:</span> {docente.proyectos_investigacion}
                </p>
                <p>
                  <span className='font-medium'>Grupos:</span>
                </p>
                <ul className='list-disc list-inside text-sm text-gray-700'>
                  {docente.participacion_grupos_investigacion.map((grupo, index) => (
                    <li key={index}>{grupo}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-500'>Redes Internacionales</h3>
                <ul className='list-disc list-inside text-sm text-gray-700'>
                  {docente.redes_internacionales.map((red, index) => (
                    <li key={index}>{red}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='bg-gray-50 px-6 py-4 flex justify-end gap-4'>
              <button
                type='button'
                className='text-gray-700 hover:text-gray-900 font-medium'
                onClick={() => navigate('/docentes')}
              >
                Volver al listado
              </button>
              <button
                type='button'
                className='bg-primario hover:bg-oscuro text-white px-6 py-2 rounded-lg shadow flex items-center gap-2 transition-all'
                onClick={() => navigate(`/docentes/actualizar/${id}`)}
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                </svg>
                Editar Docente
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
