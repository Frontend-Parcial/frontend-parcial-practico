import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DistribucionMovilidad = ({ isExpanded }) => {


  const data = [
    { name: 'Enfermería', value: 8.63, color: '#f59e0b' },
    { name: 'Microbiología', value: 8.04, color: '#ef4444' },
    { name: 'Ingeniería Agr...', value: 7.4, color: '#10b981' },
    { name: 'Ingeniería Am...', value: 7.1, color: '#3b82f6' },
    { name: 'Ingeniería de...', value: 6.85, color: '#8b5cf6' },
    { name: 'Instrumentac...', value: 6.85, color: '#ec4899' },
    { name: 'Administració...', value: 6.25, color: '#6366f1' },
    { name: 'Licenciatura e...', value: 6.25, color: '#14b8a6' },
    { name: 'Administració...', value: 5.36, color: '#f97316' },
    { name: 'Comercio Int...', value: 5.36, color: '#84cc16' },
    { name: 'Otros', value: 1.25, color: '#d1d5db' }
  ];

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Distribución de movilidad por programa</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={isExpanded ? 130 : 60}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {isExpanded && <Legend layout="vertical" align="right" verticalAlign="middle" />}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistribucionMovilidad;