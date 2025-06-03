import { useState } from 'react'
import { createStudent } from '../../lib/estudiantes-data'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { address, onlyLetters, onlyEntireNumbers, decimalNumber } from '../../utils/patterns'

export function CrearEstudiante() {
  const navigate = useNavigate()
  const [programasAcademicos, setProgramasAcademicos] = useState([])
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
    estado: 'activo',
    sanciones_academicas: false,
    sanciones_disciplinarias: false,
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
        // await createStudent(estudiante)
        console.log(estudiante)
        if (await createStudent(estudiante)) {
          alert('Estudiante creado exitosamente')
        }
      } catch (error) {
        alert(error.message)
      }
      return
    }
    alert('Todos los campos son obligatorios')
  }

  const handleInput = e => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value

    // Validaciones específicas por campo
    if (name === 'nombre_completo' && newValue.length > 35) {
      return
    }

    if (name === 'telefono') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 10) {
        return
      }
      newValue = numericValue
    }

    if (name === 'documento_identidad') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 11) {
        return
      }
      newValue = numericValue
    }

    if (name === 'direccion' && newValue.length > 35) {
      return
    }

    if (name === 'programa_academico' && newValue.length > 50) {
      return
    }

    if (name === 'fecha_nacimiento') {
      const today = new Date().toISOString().split('T')[0]
      if (newValue > today) {
        return
      }
    }

    if (name === 'email') {
      if (newValue.length > 45) {
        return
      }
      if (newValue.includes('@') && newValue.length > 45 && !newValue.endsWith('@unicesar.edu.co')) {
        return
      }
    }

    if (name === 'semestre') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 2) {
        return
      }
      newValue = numericValue
    }

    if (name === 'creditos_cursados') {
      const numericValue = newValue.replace(/[^0-9]/g, '')
      if (numericValue.length > 3) {
        return
      }
      newValue = numericValue
    }

    if (name === 'promedio_academico') {
      let processedValue = newValue.replace(',', '.')
      if (processedValue && parseFloat(processedValue) > 5.0) {
        return
      }
      if (!/^\d*\.?\d*$/.test(processedValue)) {
        return
      }
      newValue = processedValue
    }

    // Lógica especial para cuando cambia la facultad
    if (name === 'facultad') {
      handleProgramas(newValue)
      // Limpiar el programa académico cuando cambia la facultad
      setEstudiante(prev => ({
        ...prev,
        [name]: newValue,
        programa_academico: '', // Resetear programa académico
      }))
      return
    }

    setEstudiante(prev => ({
      ...prev,
      [name]: newValue,
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

  const facultades = [
    {
      value: 'Facultad de Ciencias Administrativas, Contables y Economicas',
      label: 'Facultad de Ciencias Administrativas, Contables y Economicas',
    },
    { value: 'Facultad de Bellas Artes', label: 'Facultad de Bellas Artes' },
    {
      value: 'Facultad de Derecho, Ciencias Politicas y Sociales',
      label: 'Facultad de Derecho, Ciencias Politicas y Sociales',
    },
    { value: 'Facultad de Ciencias Basicas', label: 'Facultad de Ciencias Basicas' },
    { value: 'Facultad de Ingenierías y Tecnologías', label: 'Facultad de Ingenierías y Tecnologías' },
    { value: 'Facultad de Ciencias de la Salud', label: 'Facultad de Ciencias de la Salud' },
    { value: 'Facultad de Educacion', label: 'Facultad de Educacion' },
  ]

  //! Programas
  const programasCiencias = [
    { value: 'Administracion de Empresas', label: 'Administracion de Empresas' },
    {
      value: 'Administracion de Empresas Turisticas y Hoteleras',
      label: 'Administracion de Empresas Turisticas y Hoteleras',
    },
    { value: 'Comercio Internacional', label: 'Comercio Internacional' },
    { value: 'Contaduria Publica', label: 'Contaduria Publica' },
    { value: 'Economia', label: 'Economia' },
  ]

  const programasBellasArtes = [
    { value: 'Licenciatura en Artes', label: 'Licenciatura en Artes' },
    { value: 'Musica', label: 'Musica' },
  ]

  const programasDerecho = [
    { value: 'Derecho', label: 'Derecho' },
    { value: 'Psicologia', label: 'Psicologia' },
    { value: 'Sociologia', label: 'Sociologia' },
  ]

  const programasCienciasBasicas = [{ value: 'Microbiologia', label: 'Microbiologia' }]

  const programasIngenierias = [
    { value: 'Ingenieria Agroindustrial', label: 'Ingenieria Agroindustrial' },
    { value: 'Ingenieria Ambiental y Sanitaria', label: 'Ingenieria Ambiental y Sanitaria' },
    { value: 'Ingenieria de Sistemas', label: 'Ingenieria de Sistemas' },
    { value: 'Ingenieria Electronica', label: 'Ingenieria Electronica' },
  ]

  const programasCienciasSalud = [
    { value: 'Enfermeria', label: 'Enfermeria' },
    { value: 'Instrumentacion Quirurgica', label: 'Instrumentacion Quirurgica' },
  ]

  const programasEducacion = [
    {
      value: 'Licenciatura en Ciencias Naturales y Educacion Ambiental',
      label: 'Ciencias Naturales y Educacion Ambiental',
    },
    { value: 'Licenciatura en Literatura y Lengua Castellana', label: 'Literatura y Lengua Castellana' },
    { value: 'Licenciatura en Matematicas', label: 'Matematicas' },
    { value: 'Licenciatura en Español e Ingles', label: 'Español e Ingles' },
    {
      value: 'Licenciatura en Educacion Fisica, Recreacion y Deportes',
      label: 'Educacion Fisica, Recreacion y Deportes',
    },
  ]

  function handleProgramas(facultad) {
    switch (facultad) {
      case 'Facultad de Ciencias Administrativas, Contables y Economicas':
        setProgramasAcademicos(programasCiencias)
        break
      case 'Facultad de Bellas Artes':
        setProgramasAcademicos(programasBellasArtes)
        break
      case 'Facultad de Derecho, Ciencias Politicas y Sociales':
        setProgramasAcademicos(programasDerecho)
        break
      case 'Facultad de Ciencias Basicas':
        setProgramasAcademicos(programasCienciasBasicas)
        break
      case 'Facultad de Ingenierías y Tecnologías':
        setProgramasAcademicos(programasIngenierias)
        break
      case 'Facultad de Ciencias de la Salud':
        setProgramasAcademicos(programasCienciasSalud)
        break
      case 'Facultad de Educacion':
        setProgramasAcademicos(programasEducacion)
        break
      default:
        setProgramasAcademicos([])
    }
  }

  return (
    <PageWrapper>
      <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Crear Estudiante</h1>
        <form className='space-y-4' onSubmit={handleSubmitEvent}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre Completo*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: Juan Pérez'
                  onChange={handleInput}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='nombre_completo'
                  value={estudiante.nombre_completo}
                  maxLength='35'
                  required
                />
                <div className='flex justify-between'>
                  <span className='text-xs text-gray-400'>{estudiante.nombre_completo.length}/35</span>
                </div>
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
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: 123456789'
                  onChange={handleInput}
                  name='documento_identidad'
                  value={estudiante.documento_identidad}
                  maxLength='11'
                  required
                />
                <div className='flex justify-between'>
                  <span className='text-xs text-gray-400'>{estudiante.documento_identidad.length}/11</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha Nacimiento*</label>
                <input
                  type='date'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  onChange={handleInput}
                  name='fecha_nacimiento'
                  value={estudiante.fecha_nacimiento}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email*</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: estudiante@unicesar.edu.co'
                  onChange={handleInput}
                  name='email'
                  value={estudiante.email}
                  maxLength='45'
                  pattern='.*@unicesar\.edu\.co$'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>Debe ser un correo institucional @unicesar.edu.co</p>
                <div className='flex justify-between'>
                  <span className='text-xs text-gray-400'>{estudiante.email.length}/45</span>
                </div>
              </div>
            </div>

            <div className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono*</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: 3001234567'
                  onChange={handleInput}
                  name='telefono'
                  value={estudiante.telefono}
                  maxLength='10'
                  required
                />
                <div className='flex justify-between'>
                  <span className='text-xs text-gray-400'>{estudiante.telefono.length}/10</span>
                </div>
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
                  maxLength='35'
                  required
                />
                <div className='flex justify-between mb-[-20px]'>
                  <span className='text-xs text-gray-400'>{estudiante.direccion.length}/35</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad*</label>
                <select
                  className='w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  onChange={handleInput}
                  name='facultad'
                  value={estudiante.facultad}
                  required
                >
                  <option value=''>Seleccione una facultad</option>
                  {facultades.map(facultad => (
                    <option key={facultad.value} value={facultad.value}>
                      {facultad.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Programa Académico*</label>
                <select
                  className='w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  onChange={handleInput}
                  name='programa_academico'
                  value={estudiante.programa_academico}
                  required
                  disabled={!estudiante.facultad || programasAcademicos.length === 0}
                >
                  <option value=''>
                    {!estudiante.facultad ? 'Primero seleccione una facultad' : 'Seleccione un programa académico'}
                  </option>
                  {programasAcademicos.map(programa => (
                    <option key={programa.value} value={programa.value}>
                      {programa.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Semestre*</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                  placeholder='Ej: 5'
                  onChange={handleInput}
                  name='semestre'
                  value={estudiante.semestre}
                  maxLength='2'
                  required
                />
                <div className='flex justify-between'>
                  <span className='text-xs text-gray-400'>{estudiante.semestre.length}/2</span>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Créditos Cursados*</label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                placeholder='Ej: 45'
                onChange={handleInput}
                name='creditos_cursados'
                value={estudiante.creditos_cursados}
                maxLength='3'
                required
              />
              <div className='flex justify-between'>
                <span className='text-xs text-gray-400'>{estudiante.creditos_cursados.length}/3</span>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Promedio Académico*</label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-claro focus:border-oscuro'
                placeholder='Ej: 4.2'
                onChange={handleInput}
                name='promedio_academico'
                value={estudiante.promedio_academico}
                maxLength='3'
                required
              />
              <div className='flex justify-between'>
                <span className='text-xs text-gray-400'>{estudiante.promedio_academico.length}/3</span>
              </div>
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

          <div className='pt-6 flex justify-between gap-4'>
            <button
              type='button'
              onClick={() => navigate('/estudiantes')}
              className='cursor-pointer bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 font-medium text-lg shadow-md hover:shadow-lg transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='cursor-pointer bg-primario text-white py-2 px-6 rounded-lg hover:bg-oscuro font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center'
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
