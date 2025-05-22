import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const DuracionMovilidadPais = ({ isExpanded }) => {
  const data = [
    { pais: 'Argentina', duracion: 12 },
    { pais: 'Chile', duracion: 7 },
    { pais: 'Ecuador', duracion: 6 },
    { pais: 'México', duracion: 6 },
    { pais: 'España', duracion: 6 },
    { pais: 'Colombia', duracion: 4 }
  ];

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Promedio de Duración de Movilidad por País (Meses)</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 14]} />
          <YAxis type="category" dataKey="pais" />
          <Tooltip />
          <Bar dataKey="duracion" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DuracionMovilidadPais;
