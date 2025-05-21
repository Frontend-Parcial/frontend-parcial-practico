import { useEffect, useState } from 'react'
import { listStudents } from '../../lib/estudiantes-data'
import { useNavigate } from 'react-router-dom'

export function ListadoEstudiantes() {
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await listStudents()
      setDatos(data)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Crear Estudiante</h1>

      <div className='flex flex-wrap gap-2 mt-4'>
        {datos.map(estudiante => (
          <button
            key={estudiante._id}
            type='button'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
            onClick={() => navigate(`/estudiantes/${estudiante._id}`)}
          >
            {estudiante.nombre_completo}
          </button>
        ))}
      </div>
    </div>
  )
}
