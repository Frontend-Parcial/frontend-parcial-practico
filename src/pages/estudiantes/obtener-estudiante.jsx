import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStudents } from '../../lib/estudiantes-data'

export function ObtenerEstudiante() {
  const { id } = useParams()
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudents(id)
      setDatos([data]) // Convertimos a array con []
    }
    fetchData()
  }, [id])

  return (
    <div>
      <h1>Obtener Estudiante</h1>
      <p>Estudiante: {id}</p>
      {datos.map(estudiante => (
        <div key={estudiante._id}>
          <p>Nombre: {estudiante.nombre_completo}</p>
          <p>Documento: {estudiante.documento_identidad}</p>
          <p>Tipo Documento: {estudiante.tipo_documento}</p>
          <p>Fecha Nacimiento: {estudiante.fecha_nacimiento}</p>
          <p>Email: {estudiante.email}</p>
          <p>Telefono: {estudiante.telefono}</p>
          <p>Direccion: {estudiante.direccion}</p>
          <p>Programa Academico: {estudiante.programa_academico}</p>
          <p>Facultad: {estudiante.facultad}</p>
          <p>Semestre: {estudiante.semestre}</p>
          <p>Creditos Cursados: {estudiante.creditos_cursados}</p>
          <p>Promedio Academico: {estudiante.promedio_academico}</p>
          <p>Estado: {estudiante.estado}</p>
          <p>Sanciones Academicas: {estudiante.sanciones_academicas}</p>
          <p>Sanciones Disciplinarias: {estudiante.sanciones_disciplinarias}</p>
        </div>
      ))}
      <button
        type='button'
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
        onClick={() => navigate(`/estudiantes/actualizar/${id}`)}
      >
        Actualizar Datos
      </button>
    </div>
  )
}
