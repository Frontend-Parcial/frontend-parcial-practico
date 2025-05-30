import { useState } from 'react'
import { createStudent } from '../../lib/estudiantes-data'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { address, onlyLetters, onlyEntireNumbers, decimalNumber } from '../../utils/patterns'

export function CrearEstudiante() {
  const navigate = useNavigate()
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
    estado: 'activo', // Valor por defecto según el fetch
    sanciones_academicas: false, // Valor por defecto según el fetch
    sanciones_disciplinarias: false, // Valor por defecto según el fetch
  })

  const handleBeforeInput = (e, pattern) => {
    if (pattern && !pattern.test(e.data)) {
      e.preventDefault()
    }
  }

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
      estudiante.promedio_academico !== ''
    ) {
      try {
        await createStudent(estudiante)
        alert('Estudiante creado exitosamente')
      } catch (error) {
        alert(error.message)
      }
      return
    }
    alert('Todos los campos son obligatorios')
  }

  const handleInput = e => {
    const { name, value, type, checked } = e.target
    setEstudiante(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' },
  ]

  const estadosEstudiante = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'graduado', label: 'Graduado' },
    { value: 'retirado', label: 'Retirado' },
  ]

  return (
    <PageWrapper>
      <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Crear Estudiante</h1>
        <form className='space-y-4' onSubmit={handleSubmitEvent}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre Completo*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: Juan Pérez'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='nombre_completo'
                  value={estudiante.nombre_completo}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  onChange={handleInput}
                  name='tipo_documento'
                  value={estudiante.tipo_documento}
                  required
                >
                  <option value=''>Seleccione...</option>
                  {tiposDocumento.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Documento de Identidad*</label>
                <input
                  type='number'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: 123456789'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='documento_identidad'
                  value={estudiante.documento_identidad}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha Nacimiento*</label>
                <input
                  type='date'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  onChange={handleInput}
                  name='fecha_nacimiento'
                  value={estudiante.fecha_nacimiento}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email*</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: estudiante@universidad.edu'
                  onChange={handleInput}
                  name='email'
                  value={estudiante.email}
                  required
                />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono*</label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: 3001234567'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='telefono'
                  value={estudiante.telefono}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Dirección*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: Calle 123 #45-67'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, address.format)}
                  name='direccion'
                  value={estudiante.direccion}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Programa Académico*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: Ingeniería de Sistemas'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='programa_academico'
                  value={estudiante.programa_academico}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: Ingeniería'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='facultad'
                  value={estudiante.facultad}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Semestre*</label>
                <input
                  type='number'
                  min='1'
                  max='20'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: 5'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='semestre'
                  value={estudiante.semestre}
                  required
                />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Créditos Cursados*</label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                placeholder='Ej: 45'
                onChange={handleInput}
                name='creditos_cursados'
                onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                value={estudiante.creditos_cursados}
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Promedio Académico*</label>
              <input
                type='number'
                step='0.1'
                min='0'
                max='5'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                placeholder='Ej: 4.2'
                onChange={handleInput}
                onBeforeInput={e => handleBeforeInput(e, decimalNumber.format)}
                name='promedio_academico'
                value={estudiante.promedio_academico}
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Estado*</label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                onChange={handleInput}
                name='estado'
                value={estudiante.estado}
                required
              >
                {estadosEstudiante.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='sanciones_academicas'
                name='sanciones_academicas'
                checked={estudiante.sanciones_academicas}
                onChange={handleInput}
                className='h-4 w-4 text-indigo-600 focus:ring-claro border-gray-300 rounded'
              />
              <label htmlFor='sanciones_academicas' className='ml-2 block text-sm text-gray-700'>
                ¿Tiene sanciones académicas?
              </label>
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                id='sanciones_disciplinarias'
                name='sanciones_disciplinarias'
                checked={estudiante.sanciones_disciplinarias}
                onChange={handleInput}
                className='h-4 w-4 text-primario focus:ring-oscuro border-gray-300 rounded'
              />
              <label htmlFor='sanciones_disciplinarias' className='ml-2 block text-sm text-gray-700'>
                ¿Tiene sanciones disciplinarias?
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className='pt-6 flex justify-between gap-4'>
            <button
              type='button'
              onClick={() => navigate('/estudiantes')}
              className='bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 font-medium text-lg shadow-md hover:shadow-lg transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='bg-primario text-white py-2 px-6 rounded-lg hover:bg-oscuro font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center'
            >
              Registrar Estudiante
            </button>
          </div>
          <p className='text-xs text-gray-500 mt-2'>* Campos obligatorios</p>
        </form>
      </div>
    </PageWrapper>
  )
}
