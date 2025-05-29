import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { listStudents } from '../../../lib/estudiantes-data' // Ajusta la ruta según tu estructura

const TasaMovilidad = ({ isExpanded }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setLoading(true)
        const estudiantes = await listStudents()

        // Contar estudiantes por programa académico
        const programaCounts = estudiantes.reduce((acc, estudiante) => {
          const programa = estudiante.programa_academico
          acc[programa] = (acc[programa] || 0) + 1
          return acc
        }, {})

        // Convertir a formato para el gráfico y calcular porcentajes
        const totalEstudiantes = estudiantes.length
        const chartData = Object.entries(programaCounts)
          .map(([programa, cantidad]) => ({
            programa: programa.length > 15 ? `${programa.substring(0, 12)}...` : programa,
            programaCompleto: programa, // Para mostrar en tooltip
            cantidad,
            porcentaje: ((cantidad / totalEstudiantes) * 100).toFixed(1),
          }))
          .sort((a, b) => b.cantidad - a.cantidad) // Ordenar por cantidad descendente

        setData(chartData)
        setError(null)
      } catch (err) {
        console.error('Error al cargar datos de estudiantes:', err)
        setError('Error al cargar los datos')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudentsData()
  }, [])

  // Tooltip personalizado para mostrar información completa
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-semibold'>{data.programaCompleto}</p>
          <p className='text-sm text-gray-600'>
            Estudiantes: {data.cantidad} ({data.porcentaje}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2'></div>
          <p className='text-sm text-gray-600'>Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='text-center text-red-500'>
          <p className='text-sm'>{error}</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='h-full flex items-center justify-center'>
        <p className='text-sm text-gray-600'>No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className='h-full'>
      <h3 className='text-sm font-semibold mb-2'>Tasa Mobilidad por Programa</h3>
      <ResponsiveContainer width='100%' height={isExpanded ? 400 : 150}>
        <BarChart data={data} layout='vertical' margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis type='number' />
          <YAxis type='category' dataKey='programa' width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey='cantidad' fill='#22c55e' />
        </BarChart>
      </ResponsiveContainer>
      {isExpanded && (
        <div className='mt-4 text-xs text-gray-600'>
          <p>Total de estudiantes: {data.reduce((sum, item) => sum + item.cantidad, 0)}</p>
        </div>
      )}
    </div>
  )
}

export default TasaMovilidad
