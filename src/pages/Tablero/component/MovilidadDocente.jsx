import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const MovilidadDocente = ({ isExpanded }) => {
  const data = [
    { facultad: 'Facultad de Ed...', porcentaje: 100 },
    { facultad: 'Facultad de Ing...', porcentaje: 100 },
    { facultad: 'Facultad de Cie...', porcentaje: 100 },
    { facultad: 'Facultad de Cie...', porcentaje: 100 }
  ];

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Movilidad docente por facultad</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="facultad" />
          <Bar dataKey="porcentaje" fill="#22c55e" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Número de docentes: 100</p>
        </div>
      )}
    </div>
  );
};

export default MovilidadDocente;