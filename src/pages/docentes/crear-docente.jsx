import { useState } from 'react'
import { createDocentes } from '../../lib/docentes-data'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper'
import { email, onlyEntireNumbers, onlyLetters, address, lenguageLevel, decimalNumber } from '../../utils/patterns'

const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
]

const EDUCATION_LEVELS = [
  { value: 'Pregrado', label: 'Pregrado' },
  { value: 'Especialización', label: 'Especialización' },
  { value: 'Maestría', label: 'Maestría' },
  { value: 'Doctorado', label: 'Doctorado' },
  { value: 'Postdoctorado', label: 'Postdoctorado' },
]

const TEACHER_CATEGORIES = [
  { value: 'Instructor', label: 'Instructor' },
  { value: 'Asistente', label: 'Asistente' },
  { value: 'Asociado', label: 'Asociado' },
  { value: 'Titular', label: 'Titular' },
]

const CONTRACT_TYPES = [
  { value: 'Planta', label: 'Planta' },
  { value: 'Contratista', label: 'Contratista' },
  { value: 'Ocasional', label: 'Ocasional' },
  { value: 'Cátedra', label: 'Cátedra' },
]

const STATUS_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'licencia', label: 'En licencia' },
  { value: 'jubilado', label: 'Jubilado' },
]

const FACULTADES = [
  {
    value: 'Facultad de Ciencias Administrativas, Contables y Economicas',
    label: 'Facultad de Ciencias Administrativas, Contables y Economicas',
    departamentos: [
      { value: 'Administracion de Empresas', label: 'Administracion de Empresas' },
      {
        value: 'Administracion de Empresas Turisticas y Hoteleras',
        label: 'Administracion de Empresas Turisticas y Hoteleras',
      },
      { value: 'Comercio Internacional', label: 'Comercio Internacional' },
      { value: 'Contaduria Publica', label: 'Contaduria Publica' },
      { value: 'Economia', label: 'Economia' },
    ],
  },
  {
    value: 'Facultad de Bellas Artes',
    label: 'Facultad de Bellas Artes',
    departamentos: [
      { value: 'Licenciatura en Artes', label: 'Licenciatura en Artes' },
      { value: 'Musica', label: 'Musica' },
    ],
  },
  {
    value: 'Facultad de Derecho, Ciencias Politicas y Sociales',
    label: 'Facultad de Derecho, Ciencias Politicas y Sociales',
    departamentos: [
      { value: 'Derecho', label: 'Derecho' },
      { value: 'Psicologia', label: 'Psicologia' },
      { value: 'Sociologia', label: 'Sociologia' },
    ],
  },
  {
    value: 'Facultad de Ciencias Basicas',
    label: 'Facultad de Ciencias Basicas',
    departamentos: [{ value: 'Microbiologia', label: 'Microbiologia' }],
  },
  {
    value: 'Facultad de Ingenierías y Tecnologías',
    label: 'Facultad de Ingenierías y Tecnologías',
    departamentos: [
      { value: 'Ingenieria Agroindustrial', label: 'Ingenieria Agroindustrial' },
      { value: 'Ingenieria Ambiental y Sanitaria', label: 'Ingenieria Ambiental y Sanitaria' },
      { value: 'Ingenieria de Sistemas', label: 'Ingenieria de Sistemas' },
      { value: 'Ingenieria Electronica', label: 'Ingenieria Electronica' },
    ],
  },
  {
    value: 'Facultad de Ciencias de la Salud',
    label: 'Facultad de Ciencias de la Salud',
    departamentos: [
      { value: 'Enfermeria', label: 'Enfermeria' },
      { value: 'Instrumentacion Quirurgica', label: 'Instrumentacion Quirurgica' },
    ],
  },
  {
    value: 'Facultad de Educacion',
    label: 'Facultad de Educacion',
    departamentos: [
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
    ],
  },
]

export function CrearDocente() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [departamentosDisponibles, setDepartamentosDisponibles] = useState([])
  const [form, setForm] = useState({
    nombre_completo: '',
    documento_identidad: '',
    tipo_documento: 'CC',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    titulo_pregrado: '',
    titulo_posgrado: '',
    nivel_formacion: '',
    departamento: '',
    facultad: '',
    categoria_docente: '',
    tipo_vinculacion: '',
    anos_experiencia: '',
    anos_experiencia_institucion: '',
    escalafon: '',
    idiomas: [],
    nuevo_idioma: { idioma: '', nivel: '' },
    areas_conocimiento: [],
    nueva_area: '',
    publicaciones: '',
    proyectos_investigacion: '',
    participacion_grupos_investigacion: [],
    nuevo_grupo: '',
    estado: 'activo',
    sanciones_academicas: false,
    sanciones_disciplinarias: false,
    evaluacion_docente_promedio: '',
    experiencia_internacional: false,
    intercambios_previos: [],
    redes_internacionales: [],
    nueva_red: '',
  })

  const validateEmail = email => {
    const institutionalEmailRegex = /^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/
    return institutionalEmailRegex.test(email)
  }

  const validateBirthDate = date => {
    const today = new Date()
    const birthDate = new Date(date)
    return birthDate <= today
  }

  const validateMaxLength = (value, maxLength) => {
    return value.length <= maxLength
  }

  const validateTextInput = (value, maxLength = 35) => {
    const textOnly = value.replace(/[0-9]/g, '')
    return textOnly.slice(0, maxLength)
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'nombre_completo':
        if (!validateMaxLength(value, 35)) {
          newErrors[name] = 'El nombre no puede exceder 35 caracteres'
        } else {
          delete newErrors[name]
        }
        break
      case 'email':
        if (value && !validateEmail(value)) {
          newErrors[name] = 'El email debe ser institucional (@unicesar.edu.co)'
        } else {
          delete newErrors[name]
        }
        break
      case 'fecha_nacimiento':
        if (value && !validateBirthDate(value)) {
          newErrors[name] = 'La fecha de nacimiento no puede ser futura'
        } else {
          delete newErrors[name]
        }
        break
      case 'titulo_pregrado':
      case 'titulo_posgrado':
        if (value && !validateMaxLength(value, 35)) {
          newErrors[name] = 'Este campo no puede exceder 35 caracteres'
        } else {
          delete newErrors[name]
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target

    let processedValue = value
    if (['nombre_completo', 'titulo_pregrado', 'titulo_posgrado', 'departamento', 'facultad'].includes(name)) {
      processedValue = validateTextInput(value, 35)
    }

    if (name === 'facultad') {
      const facultadSeleccionada = FACULTADES.find(f => f.value === value)
      const nuevosDepartamentos = facultadSeleccionada ? facultadSeleccionada.departamentos : []

      setDepartamentosDisponibles(nuevosDepartamentos)

      setForm(prev => ({
        ...prev,
        [name]: processedValue,
        departamento: '',
      }))
      return
    }

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }))

    // Validar el campo en tiempo real
    validateField(name, type === 'checkbox' ? checked : processedValue)
  }

  // Funciones para manejar arrays (idiomas, áreas, grupos, redes)
  const agregarIdioma = () => {
    if (form.nuevo_idioma.idioma && form.nuevo_idioma.nivel) {
      setForm(prev => ({
        ...prev,
        idiomas: [...prev.idiomas, prev.nuevo_idioma],
        nuevo_idioma: { idioma: '', nivel: '' },
      }))
    }
  }

  const eliminarIdioma = index => {
    setForm(prev => ({
      ...prev,
      idiomas: prev.idiomas.filter((_, i) => i !== index),
    }))
  }

  const agregarArea = () => {
    if (form.nueva_area) {
      setForm(prev => ({
        ...prev,
        areas_conocimiento: [...prev.areas_conocimiento, prev.nueva_area],
        nueva_area: '',
      }))
    }
  }

  const eliminarArea = index => {
    setForm(prev => ({
      ...prev,
      areas_conocimiento: prev.areas_conocimiento.filter((_, i) => i !== index),
    }))
  }

  const agregarGrupo = () => {
    if (form.nuevo_grupo) {
      setForm(prev => ({
        ...prev,
        participacion_grupos_investigacion: [...prev.participacion_grupos_investigacion, prev.nuevo_grupo],
        nuevo_grupo: '',
      }))
    }
  }

  const eliminarGrupo = index => {
    setForm(prev => ({
      ...prev,
      participacion_grupos_investigacion: prev.participacion_grupos_investigacion.filter((_, i) => i !== index),
    }))
  }

  const agregarRed = () => {
    if (form.nueva_red) {
      setForm(prev => ({
        ...prev,
        redes_internacionales: [...prev.redes_internacionales, prev.nueva_red],
        nueva_red: '',
      }))
    }
  }

  const eliminarRed = index => {
    setForm(prev => ({
      ...prev,
      redes_internacionales: prev.redes_internacionales.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const requiredFields = {
      nombre_completo: 'Nombre completo es obligatorio',
      documento_identidad: 'Documento de identidad es obligatorio',
      email: 'Email es obligatorio',
      telefono: 'Teléfono es obligatorio',
      fecha_nacimiento: 'Fecha de nacimiento es obligatoria',
      direccion: 'Dirección es obligatoria',
      nivel_formacion: 'Nivel de formación es obligatorio',
      departamento: 'Departamento es obligatorio',
      facultad: 'Facultad es obligatoria',
      categoria_docente: 'Categoría docente es obligatoria',
      tipo_vinculacion: 'Tipo de vinculación es obligatorio',
      anos_experiencia: 'Años de experiencia es obligatorio',
      anos_experiencia_institucion: 'Años en la institución es obligatorio',
    }

    const newErrors = {}
    Object.keys(requiredFields).forEach(field => {
      if (!form[field]) {
        newErrors[field] = requiredFields[field]
      }
    })

    // Validaciones específicas
    if (form.email && !validateEmail(form.email)) {
      newErrors.email = 'El email debe ser institucional (@unicesar.edu.co)'
    }

    if (form.fecha_nacimiento && !validateBirthDate(form.fecha_nacimiento)) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Por favor, corrija los errores en el formulario')
      return
    }

    const { nuevo_idioma, nueva_area, nuevo_grupo, nueva_red, ...formulario } = form

    formulario.anos_experiencia = Number(formulario.anos_experiencia)
    formulario.anos_experiencia_institucion = Number(formulario.anos_experiencia_institucion)
    formulario.publicaciones = Number(formulario.publicaciones)
    formulario.proyectos_investigacion = Number(formulario.proyectos_investigacion)
    formulario.evaluacion_docente_promedio = Number(formulario.evaluacion_docente_promedio)

    try {
      await createDocentes(formulario)
      alert('Docente creado exitosamente')
      navigate('/docentes')
    } catch (error) {
      alert(error.message || 'Error al crear el docente')
    }
  }

  const handleBeforeInput = (e, pattern) => {
    if (pattern && !pattern.test(e.data)) {
      e.preventDefault()
    }
  }

  const ErrorMessage = ({ error }) => {
    if (!error) return null
    return <p className='text-red-500 text-xs mt-1'>{error}</p>
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Registrar Docente</h1>
        <form className='space-y-4' onSubmit={handleSubmit}>
          {/* Información Personal */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Información Personal</h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nombre Completo* (máx. 35 caracteres)
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.nombre_completo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: Juan Pérez'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='nombre_completo'
                  value={form.nombre_completo}
                  maxLength={35}
                  required
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.nombre_completo} />
                  <span className='text-xs text-gray-400'>{form.nombre_completo.length}/35</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario'
                  onChange={handleChange}
                  name='tipo_documento'
                  value={form.tipo_documento}
                  required
                >
                  {DOCUMENT_TYPES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Documento de Identidad*</label>
                <input
                  type='text'
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.documento_identidad ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: 123456789'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='documento_identidad'
                  value={form.documento_identidad}
                  maxLength={10}
                  required
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.documento_identidad} />
                  <span className='text-xs text-gray-400'>{form.documento_identidad.length}/10</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de Nacimiento*</label>
                <input
                  type='date'
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  name='fecha_nacimiento'
                  value={form.fecha_nacimiento}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                <ErrorMessage error={errors.fecha_nacimiento} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email Institucional*</label>
                <input
                  type='email'
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: docente@unicesar.edu.co'
                  onChange={handleChange}
                  name='email'
                  value={form.email}
                  maxLength={35}
                  required
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.email} />
                  <span className='text-xs text-gray-400'>{form.email.length}/35</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono*</label>
                <input
                  type='tel'
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: 3001234567'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='telefono'
                  value={form.telefono}
                  maxLength={10}
                  required
                />

                <div className='flex justify-between'>
                  <ErrorMessage error={errors.telefono} />
                  <span className='text-xs text-gray-400'>{form.telefono.length}/10</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Dirección*</label>
                <input
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: Calle 123 #45-67'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, address.format)}
                  name='direccion'
                  value={form.direccion}
                  maxLength={35}
                  required
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.nombre_completo} />
                  <span className='text-xs text-gray-400'>{form.direccion.length}/35</span>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Información Académica</h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Título de Pregrado (máx. 35 caracteres)
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.titulo_pregrado ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: Licenciado en Matemáticas'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='titulo_pregrado'
                  value={form.titulo_pregrado}
                  maxLength={35}
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.titulo_pregrado} />
                  <span className='text-xs text-gray-400'>{form.titulo_pregrado.length}/35</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Título de Posgrado (máx. 35 caracteres)
                </label>
                <input
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.titulo_posgrado ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Ej: Magíster en Educación'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyLetters.format)}
                  name='titulo_posgrado'
                  value={form.titulo_posgrado}
                  maxLength={35}
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.titulo_posgrado} />
                  <span className='text-xs text-gray-400'>{form.titulo_posgrado.length}/35</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nivel de Formación*</label>
                <select
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.nivel_formacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  name='nivel_formacion'
                  value={form.nivel_formacion}
                  required
                >
                  <option value=''>Seleccione...</option>
                  {EDUCATION_LEVELS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.nivel_formacion} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad*</label>
                <select
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.facultad ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  name='facultad'
                  value={form.facultad}
                  required
                >
                  <option value=''>Seleccione una facultad</option>
                  {FACULTADES.map(facultad => (
                    <option key={facultad.value} value={facultad.value}>
                      {facultad.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.facultad} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Departamento*</label>
                <select
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.departamento ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  name='departamento'
                  value={form.departamento}
                  required
                  disabled={!form.facultad}
                >
                  <option value=''>
                    {!form.facultad ? 'Primero seleccione una facultad' : 'Seleccione un departamento'}
                  </option>
                  {departamentosDisponibles.map(departamento => (
                    <option key={departamento.value} value={departamento.value}>
                      {departamento.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.departamento} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Categoría Docente*</label>
                <select
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.categoria_docente ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  name='categoria_docente'
                  value={form.categoria_docente}
                  required
                >
                  <option value=''>Seleccione...</option>
                  {TEACHER_CATEGORIES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.categoria_docente} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Vinculación*</label>
                <select
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.tipo_vinculacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  name='tipo_vinculacion'
                  value={form.tipo_vinculacion}
                  required
                >
                  <option value=''>Seleccione...</option>
                  {CONTRACT_TYPES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.tipo_vinculacion} />
              </div>
            </div>
          </div>

          {/* Experiencia Profesional */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Experiencia Profesional</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Años de Experiencia*</label>
                <input
                  type='text'
                  min='0'
                  maxLength={2}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.anos_experiencia ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='anos_experiencia'
                  value={form.anos_experiencia}
                  required
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.anos_experiencia} />
                  <span className='text-xs text-gray-400'>{form.anos_experiencia.length}/2</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Años en la Institución*</label>
                <input
                  type='text'
                  maxLength={2}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario ${
                    errors.anos_experiencia_institucion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='anos_experiencia_institucion'
                  value={form.anos_experiencia_institucion}
                  required
                />
                <div className='flex justify-between'>
                  <ErrorMessage error={errors.anos_experiencia_institucion} />
                  <span className='text-xs text-gray-400'>{form.anos_experiencia_institucion.length}/2</span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Escalafón</label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primario focus:border-primario'
                  onChange={handleChange}
                  onBeforeInput={e => handleBeforeInput(e, onlyEntireNumbers.format)}
                  name='escalafon'
                  maxLength={2}
                  value={form.escalafon}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className='pt-6 flex justify-between gap-4'>
            <button
              type='button'
              onClick={() => navigate(`/docentes`)}
              className='cursor-pointer bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 font-medium text-lg shadow-md hover:shadow-lg transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={Object.keys(errors).length > 0}
              className={`cursor-pointer w-full py-2 px-4 rounded-md font-medium transition-colors ${
                Object.keys(errors).length > 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-primario text-white hover:bg-oscuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario'
              }`}
            >
              Registrar Docente
            </button>
          </div>
          <p className='text-xs text-gray-500 mt-2'>* Campos obligatorios</p>
        </form>
      </div>
    </PageWrapper>
  )
}
