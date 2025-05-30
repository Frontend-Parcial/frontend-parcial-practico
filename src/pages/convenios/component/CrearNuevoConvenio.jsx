import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../../components/PageWrapper'

const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

const CrearConvenio = () => {
  const [formData, setFormData] = useState({
    nombre_institucion: '',
    pais_institucion: '',
    ciudad_institucion: '',
    tipo_convenio: 'internacional',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activo',
    descripcion: '',
    requisitos_especificos: '',
    beneficios: '',
    cupos_disponibles: 1,
    contacto_institucion: {
      nombre: '',
      cargo: '',
      email: '',
      telefono: '',
    },
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target

    // Manejar campos anidados
    if (name.startsWith('contacto_')) {
      const fieldName = name.replace('contacto_', '')
      setFormData(prev => ({
        ...prev,
        contacto_institucion: {
          ...prev.contacto_institucion,
          [fieldName]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = {}

    // Validaciones básicas
    if (!formData.nombre_institucion) {
      newErrors.nombre_institucion = 'El nombre de la institución es requerido'
    }
    if (!formData.pais_institucion) {
      newErrors.pais_institucion = 'El país es requerido'
    }
    if (!formData.ciudad_institucion) {
      newErrors.ciudad_institucion = 'La ciudad es requerida'
    }
    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida'
    }
    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida'
    }
    if (formData.fecha_inicio && formData.fecha_fin && new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es requerida'
    }
    if (formData.cupos_disponibles < 1) {
      newErrors.cupos_disponibles = 'Debe haber al menos 1 cupo disponible'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        const response = await fetch(`${apiUrl}/convenios/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al crear el convenio')
        }

        setSubmitSuccess(true)
        setTimeout(() => {
          navigate('/convenios')
        }, 2000)
      } catch (error) {
        console.error('Error al crear el convenio:', error)
        setErrors({ submit: error.message || 'Error al crear el convenio' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <PageWrapper>
      <div className='min-h-screen flex flex-col'>
        <main className='flex-grow bg-gray-100 p-4'>
          <div className='max-w-6xl mx-auto grid grid-cols-1 gap-4 shadow-md'>
            <div className='bg-white rounded-lg overflow-hidden shadow-md'>
              <h2 className='p-4 text-center text-oscuro text-xl font-bold'>Nuevo Convenio</h2>
              <div className='bg-claro h-1'></div>

              <form className='p-6 space-y-6' onSubmit={handleSubmit}>
                {/* Sección de información básica */}
                <div className='space-y-4'>
                  <h3 className='text-oscuro font-semibold text-lg border-b pb-2'>Información Básica</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Nombre de la Institución*</label>
                      <input
                        type='text'
                        name='nombre_institucion'
                        value={formData.nombre_institucion}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${
                          errors.nombre_institucion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Universidad Nacional Autónoma de México'
                      />
                      {errors.nombre_institucion && (
                        <p className='text-red-500 text-xs mt-1'>{errors.nombre_institucion}</p>
                      )}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Tipo de Convenio</label>
                      <select
                        name='tipo_convenio'
                        value={formData.tipo_convenio}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                      >
                        <option value='internacional'>Internacional</option>
                        <option value='nacional'>Nacional</option>
                        <option value='regional'>Regional</option>
                      </select>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>País*</label>
                      <input
                        type='text'
                        name='pais_institucion'
                        value={formData.pais_institucion}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${
                          errors.pais_institucion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='México'
                      />
                      {errors.pais_institucion && (
                        <p className='text-red-500 text-xs mt-1'>{errors.pais_institucion}</p>
                      )}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Ciudad*</label>
                      <input
                        type='text'
                        name='ciudad_institucion'
                        value={formData.ciudad_institucion}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${
                          errors.ciudad_institucion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Ciudad de México'
                      />
                      {errors.ciudad_institucion && (
                        <p className='text-red-500 text-xs mt-1'>{errors.ciudad_institucion}</p>
                      )}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Cupos Disponibles*</label>
                      <input
                        type='number'
                        name='cupos_disponibles'
                        value={formData.cupos_disponibles}
                        onChange={handleChange}
                        min='1'
                        className={`w-full p-2 border rounded-lg ${
                          errors.cupos_disponibles ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cupos_disponibles && (
                        <p className='text-red-500 text-xs mt-1'>{errors.cupos_disponibles}</p>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Fecha de Inicio*</label>
                      <input
                        type='date'
                        name='fecha_inicio'
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${
                          errors.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fecha_inicio && <p className='text-red-500 text-xs mt-1'>{errors.fecha_inicio}</p>}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Fecha de Fin*</label>
                      <input
                        type='date'
                        name='fecha_fin'
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${
                          errors.fecha_fin ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fecha_fin && <p className='text-red-500 text-xs mt-1'>{errors.fecha_fin}</p>}
                    </div>
                  </div>

                  <div>
                    <label className='block mb-1 font-medium'>Estado</label>
                    <select
                      name='estado'
                      value={formData.estado}
                      onChange={handleChange}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    >
                      <option value='activo'>Activo</option>
                      <option value='inactivo'>Inactivo</option>
                      <option value='en renovación'>En renovación</option>
                      <option value='vencido'>Vencido</option>
                    </select>
                  </div>
                </div>

                {/* Sección de descripción */}
                <div className='space-y-4'>
                  <h3 className='text-oscuro font-semibold text-lg border-b pb-2'>Descripción del Convenio</h3>

                  <div>
                    <label className='block mb-1 font-medium'>Descripción*</label>
                    <textarea
                      name='descripcion'
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full p-2 border rounded-lg ${
                        errors.descripcion ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Convenio de cooperación académica para movilidad estudiantil...'
                    />
                    {errors.descripcion && <p className='text-red-500 text-xs mt-1'>{errors.descripcion}</p>}
                  </div>

                  <div>
                    <label className='block mb-1 font-medium'>Requisitos Específicos</label>
                    <textarea
                      name='requisitos_especificos'
                      value={formData.requisitos_especificos}
                      onChange={handleChange}
                      rows={2}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                      placeholder='Promedio mínimo de 4.0, nivel de español B2...'
                    />
                  </div>

                  <div>
                    <label className='block mb-1 font-medium'>Beneficios</label>
                    <textarea
                      name='beneficios'
                      value={formData.beneficios}
                      onChange={handleChange}
                      rows={3}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                      placeholder='Exención de matrícula, acceso a bibliotecas y laboratorios...'
                    />
                  </div>
                </div>

                {/* Sección de contacto */}
                <div className='space-y-4'>
                  <h3 className='text-oscuro font-semibold text-lg border-b pb-2'>Contacto en la Institución</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Nombre</label>
                      <input
                        type='text'
                        name='contacto_nombre'
                        value={formData.contacto_institucion.nombre}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                        placeholder='Dr. Javier Martínez'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Cargo</label>
                      <input
                        type='text'
                        name='contacto_cargo'
                        value={formData.contacto_institucion.cargo}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                        placeholder='Director de Relaciones Internacionales'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Email</label>
                      <input
                        type='email'
                        name='contacto_email'
                        value={formData.contacto_institucion.email}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                        placeholder='javier.martinez@unam.mx'
                      />
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Teléfono</label>
                      <input
                        type='text'
                        name='contacto_telefono'
                        value={formData.contacto_institucion.telefono}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                        placeholder='+52 55 1234 5678'
                      />
                    </div>
                  </div>
                </div>

                {errors.submit && <div className='text-red-500 text-center py-2'>{errors.submit}</div>}

                {submitSuccess && (
                  <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center'>
                    Convenio creado exitosamente! Redirigiendo...
                  </div>
                )}

                <div className='pt-6 flex justify-end gap-4'>
                  <button
                    type='button'
                    onClick={() => navigate('/convenios')}
                    className='bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 font-medium text-lg shadow-md hover:shadow-lg transition-all'
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='bg-primario text-white py-2 px-6 rounded-lg hover:bg-oscuro font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className='flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Guardando...
                      </span>
                    ) : (
                      'Guardar Convenio'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}

export default CrearConvenio
