import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

const EvolucionMovilidad = ({ isExpanded }) => {
  const data = [
    { year: '2022', estudiantes: 118 },
    { year: '2023', estudiantes: 88 },
    { year: '2024', estudiantes: 96 },
    { year: '2025', estudiantes: 86 }
  ];

  // Cálculo para la línea de tendencia
  const tendencia = [
    { year: '2022', value: 112 },
    { year: '2025', value: 88 }
  ];

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Evolución de movilidad estudiantil</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis domain={[60, 120]} ticks={[80, 100, 120]} />
          <Line type="monotone" dataKey="estudiantes" stroke="#22c55e" activeDot={{ r: 8 }} strokeWidth={2} />
          <Line type="monotone" data={tendencia} dataKey="value" stroke="#000000" strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolucionMovilidad;