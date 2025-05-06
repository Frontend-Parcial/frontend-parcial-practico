import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// REGISTRO OBLIGATORIO DE LOS COMPONENTES
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function Reporte() {
  const [datos, setDatos] = useState([])
  const [periodoFiltrado, setPeriodoFiltrado] = useState('')

  // Simula la carga desde backend hola prueba prueba prueba prueba
  useEffect(() => {
    const datosPrueba = [
      { cedula: '123456', programa: 'Sistemas', movilidad: 5, periodo: '2024-1', pais: 'México' },
      { cedula: '987654', programa: 'Arquitectura', movilidad: 8, periodo: '2024-1', pais: 'España' },
      { cedula: '223456', programa: 'Derecho', movilidad: 10, periodo: '2024-1', pais: 'USA' },
      { cedula: '687654', programa: 'Ambiental', movilidad: 4, periodo: '2024-1', pais: 'España' },
      { cedula: '123456', programa: 'Sistemas', movilidad: 5, periodo: '2024-2', pais: 'México' },
    ]
    setDatos(datosPrueba)
  }, [])

  const datosFiltrados = periodoFiltrado ? datos.filter(d => d.periodo === periodoFiltrado) : datos

  const datosGrafica = {
    labels: datosFiltrados.map(d => d.programa),
    datasets: [
      {
        label: 'Movilidad por programa',
        data: datosFiltrados.map(d => d.movilidad),
        backgroundColor: 'rgba(75, 192, 122, 0.6)',
      },
    ],
  }

  const resumenPorPais = datosFiltrados.reduce((acc, curr) => {
    acc[curr.pais] = (acc[curr.pais] || 0) + curr.movilidad
    return acc
  }, {})

  const datosGraficaPais = {
    labels: Object.keys(resumenPorPais),
    datasets: [
      {
        label: 'Movilidad por programa',
        data: Object.values(resumenPorPais),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  return (
    <div>
      <Header />

      <h5 className='text-center text-3xl text-texto-claro font-bold mb-3'>Movilidad académica</h5>

      <div className='flex justify-center mb-4'>
        <select
          className='border p-2 rounded'
          value={periodoFiltrado}
          onChange={e => setPeriodoFiltrado(e.target.value)}
        >
          <option value=''>Todos los periodos</option>
          {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => {
            const year = new Date().getFullYear() - i
            return [`${year}-1`, `${year}-2`]
          })
            .flat()
            .map(periodo => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
        </select>
      </div>

      <div className='overflow-x-auto mx-8'>
        <table className='min-w-full border'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border px-4 py-2'>Cédula/Pasaporte</th>
              <th className='border px-4 py-2'>Programa</th>
              <th className='border px-4 py-2'>Movilidad</th>
              <th className='border px-4 py-2'>Periodo</th>
              <th className='border px-4 py-2'>País</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item, index) => (
              <tr key={index}>
                <td className='border px-4 py-2'>{item.cedula}</td>
                <td className='border px-4 py-2'>{item.programa}</td>
                <td className='border px-4 py-2'>{item.movilidad}</td>
                <td className='border px-4 py-2'>{item.periodo}</td>
                <td className='border px-4 py-2'>{item.pais}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-8 flex justify-center'>
        <div className='w-full max-w-3xl'>
          <Bar data={datosGrafica} />
        </div>
      </div>

      <div className='mt-8 flex justify-center'>
        <div className='w-full max-w-3xl'>
          <Bar data={datosGraficaPais} />
        </div>
      </div>
    </div>
  )
}
