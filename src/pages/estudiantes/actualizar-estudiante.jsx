import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStudents, updateStudent } from '../../lib/estudiantes-data'

export function ActualizarEstudiante() {
  const { id } = useParams()
  const [datosOriginales, setDatosOriginales] = useState({})
  const [cambios, setCambios] = useState({})
  const [cargando, setCargando] = useState(true)

  // Cargar los datos originales del estudiante
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudents(id)
        setDatosOriginales(data)
        setCargando(false)
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error)
        alert('Error al cargar los datos del estudiante')
        setCargando(false)
      }
    }
    fetchData()
  }, [id])

  const handleInput = e => {
    const { name, value } = e.target
    // Solo guardamos en el estado los campos que han cambiado
    setCambios(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitEvent = async e => {
    e.preventDefault()

    if (Object.keys(cambios).length === 0) {
      alert('No has realizado ningún cambio')
      return
    }

    try {
      // Solo enviamos los campos que han sido modificados
      await updateStudent(cambios, id)
      alert('Estudiante actualizado correctamente')
      // Opcional: actualizar los datos originales con los cambios
      setDatosOriginales({ ...datosOriginales, ...cambios })
      // Limpiar los cambios después de guardar
      setCambios({})
    } catch (error) {
      alert(error.message || 'Error al actualizar estudiante')
    }
  }

  if (cargando) {
    return <div>Cargando datos del estudiante...</div>
  }

  return (
    <div>
      <h1>Actualizar Estudiante</h1>
      <form className='flex flex-col' onSubmit={handleSubmitEvent}>
        <label>Nombre Completo</label>
        <input onChange={handleInput} name='nombre_completo' defaultValue={datosOriginales.nombre_completo || ''} />
        <label>Documento</label>
        <input
          onChange={handleInput}
          name='documento_identidad'
          defaultValue={datosOriginales.documento_identidad || ''}
        />
        <label>Tipo de documento</label>
        <input onChange={handleInput} name='tipo_documento' defaultValue={datosOriginales.tipo_documento || ''} />
        <label>Fecha nacimiento</label>
        <input onChange={handleInput} name='fecha_nacimiento' defaultValue={datosOriginales.fecha_nacimiento || ''} />
        <label>Email</label>
        <input onChange={handleInput} name='email' defaultValue={datosOriginales.email || ''} />
        <label>Teléfono</label>
        <input onChange={handleInput} name='telefono' defaultValue={datosOriginales.telefono || ''} />
        <label>Dirección</label>
        <input onChange={handleInput} name='direccion' defaultValue={datosOriginales.direccion || ''} />
        <label>Programa Académico</label>
        <input
          onChange={handleInput}
          name='programa_academico'
          defaultValue={datosOriginales.programa_academico || ''}
        />
        <label>Facultad</label>
        <input onChange={handleInput} name='facultad' defaultValue={datosOriginales.facultad || ''} />
        <label>Semestre</label>
        <input onChange={handleInput} name='semestre' defaultValue={datosOriginales.semestre || ''} />
        <label>Créditos cursados</label>
        <input onChange={handleInput} name='creditos_cursados' defaultValue={datosOriginales.creditos_cursados || ''} />
        <label>Promedio Académico</label>
        <input
          onChange={handleInput}
          name='promedio_academico'
          defaultValue={datosOriginales.promedio_academico || ''}
        />
        <label>Estado</label>
        <input onChange={handleInput} name='estado' defaultValue={datosOriginales.estado || ''} />
        <label>Sanciones Académicas</label>
        <input
          onChange={handleInput}
          name='sanciones_academicas'
          defaultValue={datosOriginales.sanciones_academicas || ''}
        />
        <label>Sanciones Disciplinarias</label>
        <input
          onChange={handleInput}
          name='sanciones_disciplinarias'
          defaultValue={datosOriginales.sanciones_disciplinarias || ''}
        />

        <button type='submit'>Actualizar</button>
      </form>
    </div>
  )
}
