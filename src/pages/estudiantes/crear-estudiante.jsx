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
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Crear Estudiante</h1>
      <form className='space-y-4' onSubmit={handleSubmitEvent}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre Completo</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: Juan Pérez'
                onChange={handleInput}
                name='nombre_completo'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento</label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={handleInput}
                name='tipo_documento'
              >
                <option value=''>Seleccione...</option>
                <option value='CC'>Cédula de Ciudadanía</option>
                <option value='TI'>Tarjeta de Identidad</option>
                <option value='CE'>Cédula de Extranjería</option>
                <option value='PA'>Pasaporte</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha Nacimiento</label>
              <input
                type='date'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={handleInput}
                name='fecha_nacimiento'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
              <input
                type='tel'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: 3001234567'
                onChange={handleInput}
                name='telefono'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Programa Académico</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: Ingeniería de Sistemas'
                onChange={handleInput}
                name='programa_academico'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Semestre</label>
              <input
                type='number'
                min='1'
                max='20'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: 5'
                onChange={handleInput}
                name='semestre'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Promedio Académico</label>
              <input
                type='number'
                step='0.01'
                min='0'
                max='5'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: 4.2'
                onChange={handleInput}
                name='promedio_academico'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Documento</label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: 123456789'
                onChange={handleInput}
                name='documento_identidad'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                type='email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: estudiante@universidad.edu'
                onChange={handleInput}
                name='email'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Dirección</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: Calle 123 #45-67'
                onChange={handleInput}
                name='direccion'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad</label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: Ingeniería'
                onChange={handleInput}
                name='facultad'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Créditos Cursados</label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Ej: 45'
                onChange={handleInput}
                name='creditos_cursados'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={handleInput}
                name='estado'
              >
                <option value=''>Seleccione...</option>
                <option value='Activo'>Activo</option>
                <option value='Inactivo'>Inactivo</option>
                <option value='Graduado'>Graduado</option>
                <option value='Retirado'>Retirado</option>
              </select>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sanciones Académicas</label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              rows='2'
              placeholder='Describa las sanciones académicas si aplican'
              onChange={handleInput}
              name='sanciones_academicas'
            ></textarea>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sanciones Disciplinarias</label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              rows='2'
              placeholder='Describa las sanciones disciplinarias si aplican'
              onChange={handleInput}
              name='sanciones_disciplinarias'
            ></textarea>
          </div>
        </div>

        <div className='pt-4'>
          <button
            type='submit'
            className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
          >
            Registrar Estudiante
          </button>
        </div>
      </form>
    </div>
  )
}
