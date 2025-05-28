import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getMovilidadEstudiante } from '../../../lib/reportes/MovilidadEstudiante'

const DistribucionMovilidad = ({ isExpanded }) => {
  const [datos, setDatos] = useState([])
  const [programasAgrupados, setProgramasAgrupados] = useState([])
  const coloresHex = [
    '#FF6384', // rosa
    '#36A2EB', // azul
    '#FFCE56', // amarillo
    '#4BC0C0', // turquesa
    '#9966FF', // púrpura
    '#FF9F40', // naranja
    '#C9CBCF', // gris claro
    '#8B0000', // rojo oscuro
    '#2E8B57', // verde
    '#00CED1', // azul verdoso
    '#DAA520', // dorado
    '#800080', // morado
    '#DC143C', // rojo cereza
    '#20B2AA', // aguamarina
    '#6495ED', // azul cornflower
  ]

  const agruparPorPrograma = estudiantes => {
    const conteo = {}

    estudiantes.forEach(estudiante => {
      const programa = estudiante.programa_academico
      if (programa) {
        conteo[programa] = (conteo[programa] || 0) + 1
      }
    })

    const total = estudiantes.length

    return Object.entries(conteo).map(([programa, cantidad], index) => ({
      name: programa,
      value: Number((cantidad / total) * 100),
      color: coloresHex[index % coloresHex.length],
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovilidadEstudiante()
      setDatos(data)

      const agrupado = agruparPorPrograma(data)
      setProgramasAgrupados(agrupado)
    }

    fetchData()
  }, [])

  return (
    <div className='h-full'>
      <h3 className='text-sm font-semibold mb-2'>Distribución de movilidad por programa</h3>
      <ResponsiveContainer width='100%' height={isExpanded ? 400 : 150}>
        <PieChart>
          <Pie
            data={programasAgrupados}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={isExpanded ? 130 : 60}
            dataKey='value'
          >
            {programasAgrupados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {isExpanded && <Legend layout='vertical' align='right' verticalAlign='middle' />}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DistribucionMovilidad
