import { useState } from 'react';
import EvolucionMovilidad from './component/EvolucionMovilidad';
import ConveniosPais from './component/ConveniosPais';
import MovilidadDocente from './component/MovilidadDocente';
import DuracionPromedio from './component/DuracionPromedio';
import EstudiantesCursos from './component/EstudiantesCursos';
import RelacionDuracion from './component/RelacionDuracion';
import DistribucionMovilidad from './component/DistribucionMovilidad';
import TasaMovilidad from './component/TasaMovilidad';
import EstudiantesTipoConvenio from './component/EstudiantesTipoConvenio';
import DuracionMovilidadPais from './component/DuracionMovilidadPais';

const DashboardTablero = () => {
  const [expanded, setExpanded] = useState(null);

  const handleExpand = (componentId) => {
    if (expanded === componentId) {
      setExpanded(null);
    } else {
      setExpanded(componentId);
    }
  };

  const renderComponent = (id, component, className = '') => {
    const isExpanded = expanded === id;
    return (
      <div 
        className={`${isExpanded ? 'col-span-3 row-span-2' : className} bg-white rounded-lg shadow-md p-2 cursor-pointer transition-all duration-300`}
        onClick={() => handleExpand(id)}
      >
        {component}
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-4">
        <h1 className="text-3xl font-bold text-green-600">Panel de Indicadores <span className="text-blue-900">ORPI</span></h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {renderComponent('evolucion', <EvolucionMovilidad isExpanded={expanded === 'evolucion'} />)}
        {renderComponent('convenios', <ConveniosPais isExpanded={expanded === 'convenios'} />)}
        {renderComponent('docente', <MovilidadDocente isExpanded={expanded === 'docente'} />)}

        {renderComponent('duracion', 
          <div className="flex flex-col items-center">
            <DuracionPromedio />
            <div className="text-xl font-bold mt-2">6.59</div>
            <div className="text-sm text-center">Total convenios internacionales</div>
          </div>
        )}

        {renderComponent('estudiantes', <EstudiantesCursos isExpanded={expanded === 'estudiantes'} />)}
        {renderComponent('relacion', <RelacionDuracion isExpanded={expanded === 'relacion'} />)}
        {renderComponent('distribucion', <DistribucionMovilidad isExpanded={expanded === 'distribucion'} />)}

        {renderComponent('tasa', 
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">9</div>
            <div className="text-sm text-center">Tasa participación eventos docente</div>
          </div>
        )}

        {renderComponent('tasaMovilidad', <TasaMovilidad isExpanded={expanded === 'tasaMovilidad'} />)}
        {renderComponent('tipoConvenio', <EstudiantesTipoConvenio isExpanded={expanded === 'tipoConvenio'} />)}
        {renderComponent('duracionPais', <DuracionMovilidadPais isExpanded={expanded === 'duracionPais'} />)}

        {renderComponent('demanda', 
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">3.64</div>
            <div className="text-sm text-center">Demanda Cursos de Idiomas (%)</div>
          </div>
        )}

        {renderComponent('docentes', 
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">100</div>
            <div className="text-sm text-center">Total Docentes Movilizados</div>
          </div>
        )}

        {renderComponent('estudiantesMovilizados', 
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">165</div>
            <div className="text-sm text-center">Estudiantes Movilizados</div>
          </div>
        )}

        {renderComponent('total', 
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">336</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTablero;