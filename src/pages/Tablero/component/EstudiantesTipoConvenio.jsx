import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EstudiantesTipoConvenio = ({ isExpanded }) => {
  const data = [
    { name: 'Académico', value: 259, percentage: 51.8, color: '#3b82f6' },
    { name: 'Investigación', value: 108, percentage: 21.6, color: '#1e40af' },
    { name: 'Doble Titulación', value: 70, percentage: 14.0, color: '#f97316' },
    { name: 'Intercambio', value: 63, percentage: 12.6, color: '#7e22ce' }
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
        fontSize={12}
      >
        {data[index].value}
      </text>
    );
  };

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Estudiantes por Tipo de Convenio</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={isExpanded ? 130 : 60}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} (${data.find(item => item.name === name).percentage}%)`, name]} />
          {isExpanded && <Legend />}
        </PieChart>
      </ResponsiveContainer>
      {isExpanded && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Tipo de Convenio</h4>
          {data.map((item, index) => (
            <div key={index} className="flex items-center mt-1">
              <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
              <span>{item.name}: {item.value} ({item.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstudiantesTipoConvenio;