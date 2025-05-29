import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const RelacionDuracion = ({ isExpanded }) => {
  // Datos simulados para la gráfica de dispersión
  const data = [
    { programa: 'Administración', x: 10, y: 6.8, color: '#3b82f6' },
    { programa: 'Ingeniería Agroindustrial', x: 15, y: 7.2, color: '#ef4444' },
    { programa: 'Enfermería', x: 18, y: 5.8, color: '#f59e0b' },
    { programa: 'Microbiología', x: 14, y: 6.2, color: '#10b981' },
    { programa: 'Ingeniería Ambiental', x: 12, y: 7.0, color: '#8b5cf6' },
    { programa: 'Instrumentación', x: 20, y: 5.2, color: '#ec4899' },
    { programa: 'Licenciatura', x: 16, y: 6.0, color: '#6366f1' },
    { programa: 'Comercio Internacional', x: 22, y: 5.5, color: '#14b8a6' },
  ]

  return (
    <div className='h-full'>
      <h3 className='text-sm font-semibold mb-2'>Relación entre duración y número de estudiantes por programa</h3>
      <ResponsiveContainer width='100%' height={isExpanded ? 400 : 150}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis type='number' dataKey='x' name='Conteo estudiantes' />
          <YAxis type='number' dataKey='y' name='Duración promedio' domain={[5, 8]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          {isExpanded && <Legend />}

          {data.map((entry, index) => (
            <Scatter key={`scatter-${index}`} name={entry.programa} data={[entry]} fill={entry.color} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RelacionDuracion
