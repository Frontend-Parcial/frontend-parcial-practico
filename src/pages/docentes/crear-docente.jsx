import { useState } from 'react'
import { createDocentes } from '../../lib/docentes-data'
import PageWrapper from '../../components/PageWrapper'

// Opciones para los select
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

export function CrearDocente() {
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

  // Validar campos de texto para que no acepten números
  const validateTextInput = value => {
    return value.replace(/[0-9]/g, '')
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target

    // Aplicar validación de solo texto para campos específicos
    let processedValue = value
    if (['nombre_completo', 'titulo_pregrado', 'titulo_posgrado', 'departamento', 'facultad'].includes(name)) {
      processedValue = validateTextInput(value)
    }

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }))
  }

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
    const { nuevo_idioma, nueva_area, nuevo_grupo, nueva_red, ...formulario } = form

    // Convertir campos numéricos a número
    formulario.anos_experiencia = Number(formulario.anos_experiencia)
    formulario.anos_experiencia_institucion = Number(formulario.anos_experiencia_institucion)
    formulario.publicaciones = Number(formulario.publicaciones)
    formulario.proyectos_investigacion = Number(formulario.proyectos_investigacion)
    formulario.evaluacion_docente_promedio = Number(formulario.evaluacion_docente_promedio)

    try {
      await createDocentes(formulario)
      alert('Docente creado exitosamente')
    } catch (error) {
      alert(error.message || 'Error al crear el docente')
    }
  }

  return (
    <PageWrapper>
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Registrar Docente</h1>
        <form className='space-y-4' onSubmit={handleSubmit}>
          {/* Información Personal */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Información Personal</h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre Completo*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: Juan Pérez'
                  onChange={handleChange}
                  name='nombre_completo'
                  value={form.nombre_completo}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Documento*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: 123456789'
                  onChange={handleChange}
                  name='documento_identidad'
                  value={form.documento_identidad}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de Nacimiento*</label>
                <input
                  type='date'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='fecha_nacimiento'
                  value={form.fecha_nacimiento}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email*</label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: docente@universidad.edu'
                  onChange={handleChange}
                  name='email'
                  value={form.email}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono*</label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: 3001234567'
                  onChange={handleChange}
                  name='telefono'
                  value={form.telefono}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Dirección*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: Calle 123 #45-67'
                  onChange={handleChange}
                  name='direccion'
                  value={form.direccion}
                  required
                />
              </div>
            </div>

            {/* Información Académica */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Información Académica</h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Título de Pregrado</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: Licenciado en Matemáticas'
                  onChange={handleChange}
                  name='titulo_pregrado'
                  value={form.titulo_pregrado}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Título de Posgrado</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: Magíster en Educación'
                  onChange={handleChange}
                  name='titulo_posgrado'
                  value={form.titulo_posgrado}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nivel de Formación*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Departamento*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: Matemáticas'
                  onChange={handleChange}
                  name='departamento'
                  value={form.departamento}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Facultad*</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ej: Ciencias Exactas'
                  onChange={handleChange}
                  name='facultad'
                  value={form.facultad}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Categoría Docente*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Vinculación*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='anos_experiencia'
                  value={form.anos_experiencia}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Años en la Institución*</label>
                <input
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='anos_experiencia_institucion'
                  value={form.anos_experiencia_institucion}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Escalafón</label>
                <input
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='escalafon'
                  value={form.escalafon}
                />
              </div>
            </div>
          </div>

          {/* Idiomas */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Idiomas</h3>

            <div className='flex space-x-2'>
              <input
                placeholder='Idioma'
                value={form.nuevo_idioma.idioma}
                onChange={e =>
                  setForm(prev => ({ ...prev, nuevo_idioma: { ...prev.nuevo_idioma, idioma: e.target.value } }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              <input
                placeholder='Nivel'
                value={form.nuevo_idioma.nivel}
                onChange={e =>
                  setForm(prev => ({ ...prev, nuevo_idioma: { ...prev.nuevo_idioma, nivel: e.target.value } }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              <button
                type='button'
                onClick={agregarIdioma}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                +
              </button>
            </div>

            {form.idiomas.length > 0 && (
              <ul className='mt-2 space-y-1'>
                {form.idiomas.map((i, idx) => (
                  <li key={idx} className='flex justify-between items-center bg-gray-50 p-2 rounded-md'>
                    <span className='text-sm'>
                      {i.idioma} ({i.nivel})
                    </span>
                    <button
                      type='button'
                      onClick={() => eliminarIdioma(idx)}
                      className='text-red-500 hover:text-red-700 text-sm'
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Áreas de conocimiento */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Áreas de Conocimiento</h3>

            <div className='flex space-x-2'>
              <input
                value={form.nueva_area}
                onChange={e => setForm(prev => ({ ...prev, nueva_area: e.target.value }))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Nueva área de conocimiento'
              />
              <button
                type='button'
                onClick={agregarArea}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                +
              </button>
            </div>

            {form.areas_conocimiento.length > 0 && (
              <ul className='mt-2 space-y-1'>
                {form.areas_conocimiento.map((a, idx) => (
                  <li key={idx} className='flex justify-between items-center bg-gray-50 p-2 rounded-md'>
                    <span className='text-sm'>{a}</span>
                    <button
                      type='button'
                      onClick={() => eliminarArea(idx)}
                      className='text-red-500 hover:text-red-700 text-sm'
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Investigación */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Investigación</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Publicaciones</label>
                <input
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='publicaciones'
                  value={form.publicaciones}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Proyectos de Investigación</label>
                <input
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='proyectos_investigacion'
                  value={form.proyectos_investigacion}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Grupos de Investigación</label>
              <div className='flex space-x-2'>
                <input
                  value={form.nuevo_grupo}
                  onChange={e => setForm(prev => ({ ...prev, nuevo_grupo: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Nuevo grupo de investigación'
                />
                <button
                  type='button'
                  onClick={agregarGrupo}
                  className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  +
                </button>
              </div>

              {form.participacion_grupos_investigacion.length > 0 && (
                <ul className='mt-2 space-y-1'>
                  {form.participacion_grupos_investigacion.map((g, idx) => (
                    <li key={idx} className='flex justify-between items-center bg-gray-50 p-2 rounded-md'>
                      <span className='text-sm'>{g}</span>
                      <button
                        type='button'
                        onClick={() => eliminarGrupo(idx)}
                        className='text-red-500 hover:text-red-700 text-sm'
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Evaluación y Estado */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Evaluación y Estado</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Estado*</label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='estado'
                  value={form.estado}
                  required
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Evaluación Promedio</label>
                <input
                  type='number'
                  step='0.1'
                  min='0'
                  max='5'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={handleChange}
                  name='evaluacion_docente_promedio'
                  value={form.evaluacion_docente_promedio}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='sanciones_academicas'
                  name='sanciones_academicas'
                  checked={form.sanciones_academicas}
                  onChange={handleChange}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label htmlFor='sanciones_academicas' className='ml-2 block text-sm text-gray-700'>
                  Sanciones académicas
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='sanciones_disciplinarias'
                  name='sanciones_disciplinarias'
                  checked={form.sanciones_disciplinarias}
                  onChange={handleChange}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label htmlFor='sanciones_disciplinarias' className='ml-2 block text-sm text-gray-700'>
                  Sanciones disciplinarias
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='experiencia_internacional'
                  name='experiencia_internacional'
                  checked={form.experiencia_internacional}
                  onChange={handleChange}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label htmlFor='experiencia_internacional' className='ml-2 block text-sm text-gray-700'>
                  Experiencia internacional
                </label>
              </div>
            </div>
          </div>

          {/* Redes internacionales */}
          {form.experiencia_internacional && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>Redes Internacionales</h3>

              <div className='flex space-x-2'>
                <input
                  value={form.nueva_red}
                  onChange={e => setForm(prev => ({ ...prev, nueva_red: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Nueva red internacional'
                />
                <button
                  type='button'
                  onClick={agregarRed}
                  className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  +
                </button>
              </div>

              {form.redes_internacionales.length > 0 && (
                <ul className='mt-2 space-y-1'>
                  {form.redes_internacionales.map((r, idx) => (
                    <li key={idx} className='flex justify-between items-center bg-gray-50 p-2 rounded-md'>
                      <span className='text-sm'>{r}</span>
                      <button
                        type='button'
                        onClick={() => eliminarRed(idx)}
                        className='text-red-500 hover:text-red-700 text-sm'
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className='pt-4'>
            <button
              type='submit'
              className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
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
