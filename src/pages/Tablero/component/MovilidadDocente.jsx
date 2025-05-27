import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { getMovilidadDocente } from '../../../lib/reportes/MovilidadDocente'

const MovilidadDocente = ({ isExpanded }) => {
  const [datos, setDatos] = useState([])
  const [facultadesAgrupadas, setFacultadesAgrupadas] = useState([])

  const agruparPorFacultad = docentes => {
    const conteo = {}

    docentes.forEach(docente => {
      const facultad = docente.facultad

      if (facultad) {
        if (conteo[facultad]) {
          conteo[facultad]++
        } else {
          conteo[facultad] = 1
        }
      }
      console.log(conteo)
    })

    return Object.entries(conteo).map(([facultad, cantidad]) => ({
      facultad,
      porcentaje: cantidad,
    }))
  }

  function calcularTamaño(datos) {
    if (datos.length <= 5) {
      return 5
    } else if (datos.length <= 10) {
      return 10
    } else if (datos.length <= 15) {
      return 15
    } else {
      return 100
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovilidadDocente()
      setDatos(data)

      const agrupado = agruparPorFacultad(data)
      setFacultadesAgrupadas(agrupado)
    }

    fetchData()
  }, [])

  // const data = [
  //   { facultad: 'Facultad de Ed...', porcentaje: 50 },
  //   { facultad: 'Facultad de Ing...', porcentaje: 100 },
  //   { facultad: 'Facultad de Cie...', porcentaje: 100 },
  //   { facultad: 'Facultad de Cie...', porcentaje: 100 },
  // ]

  return (
    <div className='h-full'>
      <h3 className='text-sm font-semibold mb-2'>Movilidad docente por facultad</h3>
      <ResponsiveContainer width='100%' height={isExpanded ? 400 : 150}>
        <BarChart data={facultadesAgrupadas} layout='vertical' margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis type='number' domain={[0, calcularTamaño(datos)]} />
          <YAxis type='category' dataKey='facultad' />
          <Bar dataKey='porcentaje' fill='#22c55e' barSize={20} />
        </BarChart>
      </ResponsiveContainer>
      {isExpanded && (
        <div className='mt-4'>
          <p className='text-sm text-gray-600'>Número de docentes: {datos.length}</p>
        </div>
      )}
    </div>
  )
}

export default MovilidadDocente
