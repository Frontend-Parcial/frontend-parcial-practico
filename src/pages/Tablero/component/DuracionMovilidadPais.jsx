import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { listConvenio } from '../../../lib/reportes/convenios';

const ConveniosPorPais = ({ isExpanded }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        setLoading(true);
        const response = await listConvenio();
        
        console.log('Respuesta completa:', response); // Debug
        
        // Validar que la respuesta tenga la estructura esperada
        if (!response) {
          throw new Error('La respuesta está vacía');
        }
        
        // Verificar diferentes posibles estructuras de respuesta
        let conveniosPorPais;
        
        if (response.conveniosPorPais && Array.isArray(response.conveniosPorPais)) {
          conveniosPorPais = response.conveniosPorPais;
        } else if (Array.isArray(response)) {
          // Si la respuesta directamente es un array
          conveniosPorPais = response;
        } else if (response.data && Array.isArray(response.data)) {
          // Si los datos están en response.data
          conveniosPorPais = response.data;
        } else {
          console.log('Estructura de respuesta inesperada:', response);
          throw new Error('La estructura de la respuesta no contiene conveniosPorPais válido');
        }
        
        // Validar que tenemos un array válido
        if (!Array.isArray(conveniosPorPais)) {
          throw new Error('conveniosPorPais no es un array válido');
        }
        
        // Los datos ya vienen organizados por país desde la función listConvenio
        const datosGrafica = conveniosPorPais.map(item => ({
          pais: item.pais || item.country || 'Sin país', // Manejar diferentes nombres de campo
          cantidad: item.cantidad || item.count || item.total || 0,
          convenios: item.convenios || item.agreements || [] // Por si necesitas acceso a los convenios individuales
        }));
        
        setData(datosGrafica);
        setError(null);
      } catch (err) {
        console.error('Error al cargar convenios:', err);
        setError(err.message);
        // Datos de respaldo en caso de error
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConvenios();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Cargando convenios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-sm">Error al cargar los datos:</p>
          <p className="text-xs mt-1">{error}</p>
          <p className="text-xs mt-2 text-gray-500">
            Revisa la consola para más detalles
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-gray-600">No hay convenios disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">
        Convenios por País ({data.reduce((total, item) => total + item.cantidad, 0)} total)
      </h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            type="category" 
            dataKey="pais" 
            width={70}
            fontSize={12}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value} convenio${value !== 1 ? 's' : ''}`, 
              'Cantidad'
            ]}
            labelFormatter={(label) => `País: ${label}`}
          />
          <Bar 
            dataKey="cantidad" 
            fill="#22c55e" 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConveniosPorPais;