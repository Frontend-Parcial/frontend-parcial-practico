import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getTipoConvenio } from '../../../lib/reportes/TipoConvenio';

const EstudiantesTipoConvenio = ({ isExpanded, año = null }) => {
  const [data, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getTipoConvenio();
        console.log('Datos recibidos en componente:', result);
        
        if (Array.isArray(result)) {
          setDatos(result);
        } else {
          console.warn('Los datos no son un array:', result);
          setDatos([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setDatos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [año]); 
  const renderLabel = (entry) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, index } = entry;
    
    if (!data || !Array.isArray(data) || !data[index] || !value) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isExpanded ? 14 : 12}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };
  const customTooltipFormatter = (value, name) => {
    if (!data || !Array.isArray(data)) return [`${value}`, name];
    
    const item = data.find(item => item.name === name);
    const percentage = item?.percentage || 0;
    return [`${value} estudiantes (${percentage}%)`, name];
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-gray-500">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <h3 className="text-sm font-semibold mb-2">Estudiantes por Tipo de Convenio</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-full">
        <h3 className="text-sm font-semibold mb-2">Estudiantes por Tipo de Convenio</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-gray-500">
            No hay datos disponibles
            {año && ` para el año ${año}`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">
        Estudiantes por Tipo de Convenio
      </h3>
      
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={isExpanded ? renderLabel : false}
            outerRadius={isExpanded ? 130 : 60}
            innerRadius={isExpanded ? 40 : 0}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || '#8884d8'}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={customTooltipFormatter}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          {isExpanded && <Legend />}
        </PieChart>
      </ResponsiveContainer>
      
      {/* Información detallada cuando está expandido */}
      {isExpanded && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Detalle por Tipo de Convenio</h4>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-2 rounded-sm" 
                    style={{ backgroundColor: item.color || '#8884d8' }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {item.value} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-sm font-semibold">
                {data.reduce((sum, item) => sum + item.value, 0)} estudiantes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudiantesTipoConvenio;