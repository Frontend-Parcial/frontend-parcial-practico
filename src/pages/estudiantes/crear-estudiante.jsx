import { useState } from 'react'
import { createStudent } from '../../lib/estudiantes-data'

export function CrearEstudiante() {
  const [estudiante, setEstudiante] = useState({
    nombre_completo: '',
    documento_identidad: '',
    tipo_documento: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    direccion: '',
    programa_academico: '',
    facultad: '',
    semestre: '',
    creditos_cursados: '',
    promedio_academico: '',
    estado: '',
    sanciones_academicas: '',
    sanciones_disciplinarias: '',
  })

  const handleSubmitEvent = async e => {
    e.preventDefault()
    if (
      estudiante.nombre_completo !== '' &&
      estudiante.tipo_documento !== '' &&
      estudiante.documento_identidad !== '' &&
      estudiante.fecha_nacimiento !== '' &&
      estudiante.email !== '' &&
      estudiante.telefono !== '' &&
      estudiante.direccion !== '' &&
      estudiante.programa_academico !== '' &&
      estudiante.facultad !== '' &&
      estudiante.semestre !== '' &&
      estudiante.creditos_cursados !== '' &&
      estudiante.promedio_academico !== '' &&
      estudiante.estado !== '' &&
      estudiante.sanciones_academicas !== '' &&
      estudiante.sanciones_disciplinarias !== ''
    ) {
      try {
        await createStudent(estudiante)
      } catch (error) {
        alert(error.message)
      }
      return
    }
    alert('Todos los campos son obligatorios')
  }

  const handleInput = e => {
    const { name, value } = e.target
    setEstudiante(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div>
      <h1>Crear Estudiante</h1>
      <form className='flex flex-col' onSubmit={handleSubmitEvent}>
        <label>Nombre Completo</label>
        <input placeholder='-' onChange={handleInput} name='nombre_completo' />
        <label>Documento</label>
        <input placeholder='-' onChange={handleInput} name='documento_identidad' />
        <label>tipo de documento</label>
        <input placeholder='-' onChange={handleInput} name='tipo_documento' />
        <label>Fecha nacimiento</label>
        <input placeholder='-' onChange={handleInput} name='fecha_nacimiento' />
        <label>Email</label>
        <input placeholder='-' onChange={handleInput} name='email' />
        <label>Telefono</label>
        <input placeholder='-' onChange={handleInput} name='telefono' />
        <label>Direccion</label>
        <input placeholder='-' onChange={handleInput} name='direccion' />
        <label>Programa Academico</label>
        <input placeholder='-' onChange={handleInput} name='programa_academico' />
        <label>facultad</label>
        <input placeholder='-' onChange={handleInput} name='facultad' />
        <label>Semestre</label>
        <input placeholder='-' onChange={handleInput} name='semestre' />
        <label>Creditos cursados</label>
        <input placeholder='-' onChange={handleInput} name='creditos_cursados' />
        <label>Promedio Academico</label>
        <input placeholder='-' onChange={handleInput} name='promedio_academico' />
        <label>Estado</label>
        <input placeholder='-' onChange={handleInput} name='estado' />
        <label>Sanciones Academicas</label>
        <input placeholder='-' onChange={handleInput} name='sanciones_academicas' />
        <label>Sanciones Disciplinarias</label>
        <input placeholder='-' onChange={handleInput} name='sanciones_disciplinarias' />

        <button type='submit'>Enviar</button>
      </form>
    </div>
  )
}
