import { useState } from 'react'
import EvolucionMovilidad from './component/EvolucionMovilidad'
import ConveniosPais from './component/ConveniosPais'
import MovilidadDocente from './component/MovilidadDocente'
import DuracionPromedio from './component/DuracionPromedio'
import EstudiantesCursos from './component/EstudiantesCursos'
import RelacionDuracion from './component/RelacionDuracion'
import DistribucionMovilidad from './component/DistribucionMovilidad'
import TasaMovilidad from './component/TasaMovilidad'
import EstudiantesTipoConvenio from './component/EstudiantesTipoConvenio'
import DuracionMovilidadPais from './component/DuracionMovilidadPais'
import { Header } from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'

const DashboardTablero = () => {
  const [expanded, setExpanded] = useState(null)

  const handleExpand = componentId => {
    if (expanded === componentId) {
      setExpanded(null)
    } else {
      setExpanded(componentId)
    }
  }

  // Cargar total de convenios
  useEffect(() => {
    const cargarTotalConvenios = async () => {
      try {
        setLoadingConvenios(true);
        const data = await getConvenios();
        const total = data?.convenios?.length || 0;
        setTotalConvenios(total);
      } catch (error) {
        console.error('Error al cargar total de convenios:', error);
        setTotalConvenios(0); // Valor por defecto en caso de error
      } finally {
        setLoadingConvenios(false);
      }
    };

    cargarTotalConvenios();
  }, []);

  const renderComponent = (id, component, className = '') => {
    const isExpanded = expanded === id
    return (
      <div
        className={`${
          isExpanded ? 'col-span-3 row-span-2' : className
        } bg-white rounded-lg shadow-md p-2 cursor-pointer transition-all duration-300`}
        onClick={() => handleExpand(id)}
      >
        {component}
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovilidadDocente()
      setDatos(data)
    }

    fetchData()
  }, [])

  return (
    <PageWrapper>
      <>
        <Header />

        <div className='p-4 bg-gray-100 min-h-screen'>
          <div className='flex gap-4'>
            <div className='flex-1 grid grid-cols-3 gap-4'>
              {renderComponent('evolucion', <EvolucionMovilidad isExpanded={expanded === 'evolucion'} />)}
              {renderComponent('convenios', <ConveniosPais isExpanded={expanded === 'convenios'} onToggleExpand={setIsMapExpanded} />)}
              {renderComponent('docente', <MovilidadDocente isExpanded={expanded === 'docente'} />)}

              {renderComponent('estudiantes', <EstudiantesCursos isExpanded={expanded === 'estudiantes'} />)}
              {renderComponent('relacion', <RelacionDuracion isExpanded={expanded === 'relacion'} />)}
              {renderComponent('distribucion', <DistribucionMovilidad isExpanded={expanded === 'distribucion'} />)}

              {renderComponent('tasaMovilidad', <TasaMovilidad isExpanded={expanded === 'tasaMovilidad'} />)}
              {renderComponent('tipoConvenio', <EstudiantesTipoConvenio isExpanded={expanded === 'tipoConvenio'} />)}
              {renderComponent('duracionPais', <DuracionMovilidadPais isExpanded={expanded === 'duracionPais'} />)}
            </div>

            <div className='w-64 bg-white rounded-lg shadow-md p-4'>
              <h3 className='text-lg font-semibold mb-4 text-gray-800'>Métricas Clave</h3>
              <div className='space-y-3'>
                {renderComponent(
                  'duracion',
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500'>
                    <div>
                      <div className='text-2xl font-bold text-gray-900'>
                        {loadingConvenios ? (
                          <div className="w-8 h-6 bg-gray-300 animate-pulse rounded"></div>
                        ) : (
                          totalConvenios
                        )}
                      </div>
                      <div className='text-sm text-gray-600'>Total convenios activos</div>
                    </div>
                  </div>,
                )}

                {renderComponent(
                  'tasa',
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-green-500'>
                    <div>
                      <div className='text-2xl font-bold text-gray-900'>9</div>
                      <div className='text-sm text-gray-600'>Tasa eventos docente</div>
                    </div>
                  </div>,
                )}

                {renderComponent(
                  'demanda',
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-500'>
                    <div>
                      <div className='text-2xl font-bold text-gray-900'>3.64</div>
                      <div className='text-sm text-gray-600'>Demanda Idiomas (%)</div>
                    </div>
                  </div>,
                )}

                {renderComponent(
                  'docentes',
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500'>
                    <div>
                      <div className='text-2xl font-bold text-gray-900'>{datos.length}</div>
                      <div className='text-sm text-gray-600'>Docentes Movilizados</div>
                    </div>
                  </div>,
                )}

                {renderComponent(
                  'estudiantesMovilizados',
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-red-500'>
                    <div>
                      <div className='text-2xl font-bold text-gray-900'>165</div>
                      <div className='text-sm text-gray-600'>Estudiantes Movilizados</div>
                    </div>
                  </div>,
                )}

                {renderComponent(
                  'total',
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500'>
                    <div>
                      <div className='text-2xl font-bold text-gray-900'>336</div>
                      <div className='text-sm text-gray-600'>Total General</div>
                    </div>
                  </div>,
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </PageWrapper>
  )
}

export default DashboardTablero