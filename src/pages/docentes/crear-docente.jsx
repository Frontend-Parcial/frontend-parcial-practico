import { useState } from 'react'
import { createDocentes } from '../../lib/docentes-data'

export function CrearDocente() {
  const [form, setForm] = useState({
    nombre_completo: '',
    documento_identidad: '',
    tipo_documento: '',
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
    estado: '',
    sanciones_academicas: false,
    sanciones_disciplinarias: false,
    evaluacion_docente_promedio: '',
    experiencia_internacional: false,
    intercambios_previos: [],
    redes_internacionales: [],
    nueva_red: '',
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

  const agregarArea = () => {
    if (form.nueva_area) {
      setForm(prev => ({
        ...prev,
        areas_conocimiento: [...prev.areas_conocimiento, prev.nueva_area],
        nueva_area: '',
      }))
    }
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

  const agregarRed = () => {
    if (form.nueva_red) {
      setForm(prev => ({
        ...prev,
        redes_internacionales: [...prev.redes_internacionales, prev.nueva_red],
        nueva_red: '',
      }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { nuevo_idioma, nueva_area, nuevo_grupo, nueva_red, ...formulario } = form
    try {
      await createDocentes(formulario)
    } catch (error) {
      console.error('Error al enviar formulario:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-4xl mx-auto p-6 bg-white shadow rounded-xl space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Registro de Docente</h2>

      {[
        ['Nombre completo', 'nombre_completo'],
        ['Documento de identidad', 'documento_identidad'],
        ['Tipo de documento', 'tipo_documento'],
        ['Email', 'email'],
        ['Teléfono', 'telefono'],
        ['Fecha de nacimiento', 'fecha_nacimiento', 'date'],
        ['Dirección', 'direccion'],
        ['Título de pregrado', 'titulo_pregrado'],
        ['Título de posgrado', 'titulo_posgrado'],
        ['Nivel de formación', 'nivel_formacion'],
        ['Departamento', 'departamento'],
        ['Facultad', 'facultad'],
        ['Categoría docente', 'categoria_docente'],
        ['Tipo de vinculación', 'tipo_vinculacion'],
        ['Años de experiencia', 'anos_experiencia', 'number'],
        ['Años experiencia en la institución', 'anos_experiencia_institucion', 'number'],
        ['Escalafón', 'escalafon'],
        ['Publicaciones', 'publicaciones', 'number'],
        ['Proyectos de investigación', 'proyectos_investigacion', 'number'],
        ['Evaluación promedio', 'evaluacion_docente_promedio', 'number'],
        ['Estado', 'estado'],
      ].map(([label, name, type = 'text']) => (
        <div key={name}>
          <label className='block font-medium'>{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>
      ))}

      {/* Booleanos */}
      {[
        ['Sanciones académicas', 'sanciones_academicas'],
        ['Sanciones disciplinarias', 'sanciones_disciplinarias'],
        ['Experiencia internacional', 'experiencia_internacional'],
      ].map(([label, name]) => (
        <div key={name} className='flex items-center space-x-2'>
          <input type='checkbox' name={name} checked={form[name]} onChange={handleChange} />
          <label>{label}</label>
        </div>
      ))}

      {/* Idiomas */}
      <div>
        <label className='font-medium block'>Idiomas</label>
        <div className='flex space-x-2'>
          <input
            placeholder='Idioma'
            value={form.nuevo_idioma.idioma}
            onChange={e =>
              setForm(prev => ({ ...prev, nuevo_idioma: { ...prev.nuevo_idioma, idioma: e.target.value } }))
            }
            className='p-2 border rounded w-1/2'
          />
          <input
            placeholder='Nivel'
            value={form.nuevo_idioma.nivel}
            onChange={e =>
              setForm(prev => ({ ...prev, nuevo_idioma: { ...prev.nuevo_idioma, nivel: e.target.value } }))
            }
            className='p-2 border rounded w-1/2'
          />
          <button type='button' onClick={agregarIdioma} className='px-4 py-2 bg-blue-500 text-white rounded'>
            +
          </button>
        </div>
        <ul className='mt-2 list-disc list-inside'>
          {form.idiomas.map((i, idx) => (
            <li key={idx}>
              {i.idioma} ({i.nivel})
            </li>
          ))}
        </ul>
      </div>

      {/* Áreas de conocimiento */}
      <div>
        <label className='font-medium block'>Áreas de conocimiento</label>
        <div className='flex space-x-2'>
          <input
            value={form.nueva_area}
            onChange={e => setForm(prev => ({ ...prev, nueva_area: e.target.value }))}
            className='p-2 border rounded w-full'
          />
          <button type='button' onClick={agregarArea} className='px-4 py-2 bg-blue-500 text-white rounded'>
            +
          </button>
        </div>
        <ul className='mt-2 list-disc list-inside'>
          {form.areas_conocimiento.map((a, idx) => (
            <li key={idx}>{a}</li>
          ))}
        </ul>
      </div>

      {/* Grupos de investigación */}
      <div>
        <label className='font-medium block'>Grupos de investigación</label>
        <div className='flex space-x-2'>
          <input
            value={form.nuevo_grupo}
            onChange={e => setForm(prev => ({ ...prev, nuevo_grupo: e.target.value }))}
            className='p-2 border rounded w-full'
          />
          <button type='button' onClick={agregarGrupo} className='px-4 py-2 bg-blue-500 text-white rounded'>
            +
          </button>
        </div>
        <ul className='mt-2 list-disc list-inside'>
          {form.participacion_grupos_investigacion.map((g, idx) => (
            <li key={idx}>{g}</li>
          ))}
        </ul>
      </div>

      {/* Redes internacionales */}
      <div>
        <label className='font-medium block'>Redes internacionales</label>
        <div className='flex space-x-2'>
          <input
            value={form.nueva_red}
            onChange={e => setForm(prev => ({ ...prev, nueva_red: e.target.value }))}
            className='p-2 border rounded w-full'
          />
          <button type='button' onClick={agregarRed} className='px-4 py-2 bg-blue-500 text-white rounded'>
            +
          </button>
        </div>
        <ul className='mt-2 list-disc list-inside'>
          {form.redes_internacionales.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>

      <button type='submit' className='w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700'>
        Enviar
      </button>
    </form>
  )
}
