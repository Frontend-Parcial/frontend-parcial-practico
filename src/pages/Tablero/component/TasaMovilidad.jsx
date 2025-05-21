import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const TasaMovilidad = ({ isExpanded }) => {
  const data = [
    { programa: 'Enfermería', tasa: 8.6 },
    { programa: 'Microbiología', tasa: 8.0 },
    { programa: 'Ingeniería', tasa: 7.4 },
    { programa: 'Ingeniería Am...', tasa: 7.1 },
    { programa: 'Instrumentación', tasa: 6.8 },
    { programa: 'Administración', tasa: 6.8 },
    { programa: 'Licenciatura', tasa: 6.3 },
    { programa: 'Contaduría', tasa: 6.3 },
    { programa: 'Economía', tasa: 5.4 },
    { programa: 'Psicología', tasa: 5.4 },
    { programa: 'Ingeniería Civil', tasa: 5.4 },
    { programa: 'Derecho', tasa: 5.1 },
    { programa: 'Comercio Int...', tasa: 4.8 },
    { programa: 'Estadística', tasa: 4.8 },
    { programa: 'Contaduría', tasa: 4.5 }
  ];

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Tasa Movilidad por Programa</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 10]} />
          <YAxis type="category" dataKey="programa" width={80} />
          <Tooltip />
          <Bar dataKey="tasa" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasaMovilidad;