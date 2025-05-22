import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const EstudiantesCursos = ({ isExpanded }) => {
  const data = [
    { programa: 'Enfermería', estudiantes: 29 },
    { programa: 'Microbiología', estudiantes: 27 },
    { programa: 'Ingeniería Ag...', estudiantes: 25 },
    { programa: 'Ingeniería A...', estudiantes: 24 },
    { programa: 'Ingeniería de...', estudiantes: 23 },
    { programa: 'Instrumentac...', estudiantes: 23 },
    { programa: 'Administració...', estudiantes: 21 },
    { programa: 'Licenciatura ...', estudiantes: 21 },
    { programa: 'Administració...', estudiantes: 18 },
    { programa: 'Comercio Int...', estudiantes: 18 }
  ];

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Estudiantes con cursos de idiomas según su programa</h3>
      <ResponsiveContainer width="100%" height={isExpanded ? 400 : 150}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="programa" />
          <Bar dataKey="estudiantes" fill="#107b42" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EstudiantesCursos;