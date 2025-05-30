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
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Validación nombre institución (máximo 45 caracteres)
    if (!formData.nombre_institucion) {
      newErrors.nombre_institucion = 'El nombre de la institución es requerido'
    } else if (formData.nombre_institucion.length > 45) {
      newErrors.nombre_institucion = 'El nombre no debe exceder 45 caracteres'
    }

    // Validación país (solo letras, máximo 30 caracteres)
    if (!formData.pais_institucion) {
      newErrors.pais_institucion = 'El país es requerido'
    } else if (formData.pais_institucion.length > 30) {
      newErrors.pais_institucion = 'El país no debe exceder 30 caracteres'
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.pais_institucion)) {
      newErrors.pais_institucion = 'El país solo debe contener letras'
    }

    // Validación ciudad (solo letras, máximo 30 caracteres)
    if (!formData.ciudad_institucion) {
      newErrors.ciudad_institucion = 'La ciudad es requerida'
    } else if (formData.ciudad_institucion.length > 30) {
      newErrors.ciudad_institucion = 'La ciudad no debe exceder 30 caracteres'
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.ciudad_institucion)) {
      newErrors.ciudad_institucion = 'La ciudad solo debe contener letras'
    }

    // Validación fecha de inicio (no fechas futuras)
    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida'
    } else {
      const fechaInicio = new Date(formData.fecha_inicio)
      if (fechaInicio > today) {
        newErrors.fecha_inicio = 'La fecha de inicio no puede ser futura'
      }
    }

    // Validación fecha de fin (no fechas pasadas)
    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida'
    } else {
      const fechaFin = new Date(formData.fecha_fin)
      if (fechaFin < today) {
        newErrors.fecha_fin = 'La fecha de fin no puede ser pasada'
      }
    }

    // Validación fechas coherentes
    if (formData.fecha_inicio && formData.fecha_fin && new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    // Validación descripción (máximo 45 caracteres)
    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es requerida'
    } else if (formData.descripcion.length > 45) {
      newErrors.descripcion = 'La descripción no debe exceder 45 caracteres'
    }

    // Validación requisitos específicos (máximo 45 caracteres)
    if (formData.requisitos_especificos.length > 45) {
      newErrors.requisitos_especificos = 'Los requisitos no deben exceder 45 caracteres'
    }

    // Validación beneficios (máximo 45 caracteres)
    if (formData.beneficios.length > 45) {
      newErrors.beneficios = 'Los beneficios no deben exceder 45 caracteres'
    }

    // Validación cupos disponibles
    if (formData.cupos_disponibles < 1) {
      newErrors.cupos_disponibles = 'Debe haber al menos 1 cupo disponible'
    }

    // Validación nombre contacto (máximo 35 caracteres)
    if (formData.contacto_institucion.nombre.length > 35) {
      newErrors.contacto_nombre = 'El nombre no debe exceder 35 caracteres'
    }

    // Validación cargo contacto (máximo 35 caracteres)
    if (formData.contacto_institucion.cargo.length > 35) {
      newErrors.contacto_cargo = 'El cargo no debe exceder 35 caracteres'
    }

    // Validación email (máximo 45 caracteres y formato válido)
    if (formData.contacto_institucion.email) {
      if (formData.contacto_institucion.email.length > 45) {
        newErrors.contacto_email = 'El email no debe exceder 45 caracteres'
      } else if (!formData.contacto_institucion.email.includes('@')) {
        newErrors.contacto_email = 'El email debe contener @'
      }
    }

    // Validación teléfono (solo números, máximo 15 dígitos)
    if (formData.contacto_institucion.telefono) {
      if (!/^\d+$/.test(formData.contacto_institucion.telefono)) {
        newErrors.contacto_telefono = 'El teléfono solo debe contener números'
      } else if (formData.contacto_institucion.telefono.length > 15) {
        newErrors.contacto_telefono = 'El teléfono no debe exceder 15 números'
      }
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
                      <label className='block mb-1 font-medium'>Nombre de la Institución* (máx 45 caracteres)</label>
                      <input
                        type='text'
                        name='nombre_institucion'
                        value={formData.nombre_institucion}
                        onChange={handleChange}
                        maxLength={45}
                        className={`w-full p-2 border rounded-lg ${
                          errors.nombre_institucion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Universidad Nacional Autónoma de México'
                      />
                      <small className='text-gray-500 text-xs'>
                        {formData.nombre_institucion.length}/45 caracteres
                      </small>
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
                      <label className='block mb-1 font-medium'>País* (máx 30 caracteres, solo letras)</label>
                      <input
                        type='text'
                        name='pais_institucion'
                        value={formData.pais_institucion}
                        onChange={handleChange}
                        maxLength={30}
                        className={`w-full p-2 border rounded-lg ${
                          errors.pais_institucion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='México'
                      />
                      <small className='text-gray-500 text-xs'>{formData.pais_institucion.length}/30 caracteres</small>
                      {errors.pais_institucion && (
                        <p className='text-red-500 text-xs mt-1'>{errors.pais_institucion}</p>
                      )}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Ciudad* (máx 30 caracteres, solo letras)</label>
                      <input
                        type='text'
                        name='ciudad_institucion'
                        value={formData.ciudad_institucion}
                        onChange={handleChange}
                        maxLength={30}
                        className={`w-full p-2 border rounded-lg ${
                          errors.ciudad_institucion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Ciudad de México'
                      />
                      <small className='text-gray-500 text-xs'>
                        {formData.ciudad_institucion.length}/30 caracteres
                      </small>
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
                      <label className='block mb-1 font-medium'>Fecha de Inicio* (no fechas futuras)</label>
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
                      <label className='block mb-1 font-medium'>Fecha de Fin* (no fechas pasadas)</label>
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
                    <label className='block mb-1 font-medium'>Descripción* (máx 45 caracteres)</label>
                    <textarea
                      name='descripcion'
                      value={formData.descripcion}
                      onChange={handleChange}
                      maxLength={45}
                      rows={3}
                      className={`w-full p-2 border rounded-lg ${
                        errors.descripcion ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Convenio de cooperación académica...'
                    />
                    <small className='text-gray-500 text-xs'>{formData.descripcion.length}/45 caracteres</small>
                    {errors.descripcion && <p className='text-red-500 text-xs mt-1'>{errors.descripcion}</p>}
                  </div>

                  <div>
                    <label className='block mb-1 font-medium'>Requisitos Específicos (máx 45 caracteres)</label>
                    <textarea
                      name='requisitos_especificos'
                      value={formData.requisitos_especificos}
                      onChange={handleChange}
                      maxLength={45}
                      rows={2}
                      className={`w-full p-2 border rounded-lg ${
                        errors.requisitos_especificos ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Promedio mínimo de 4.0...'
                    />
                    <small className='text-gray-500 text-xs'>
                      {formData.requisitos_especificos.length}/45 caracteres
                    </small>
                    {errors.requisitos_especificos && (
                      <p className='text-red-500 text-xs mt-1'>{errors.requisitos_especificos}</p>
                    )}
                  </div>

                  <div>
                    <label className='block mb-1 font-medium'>Beneficios (máx 45 caracteres)</label>
                    <textarea
                      name='beneficios'
                      value={formData.beneficios}
                      onChange={handleChange}
                      maxLength={45}
                      rows={3}
                      className={`w-full p-2 border rounded-lg ${
                        errors.beneficios ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Exención de matrícula...'
                    />
                    <small className='text-gray-500 text-xs'>{formData.beneficios.length}/45 caracteres</small>
                    {errors.beneficios && <p className='text-red-500 text-xs mt-1'>{errors.beneficios}</p>}
                  </div>
                </div>

                {/* Sección de contacto */}
                <div className='space-y-4'>
                  <h3 className='text-oscuro font-semibold text-lg border-b pb-2'>Contacto en la Institución</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Nombre (máx 35 caracteres)</label>
                      <input
                        type='text'
                        name='contacto_nombre'
                        value={formData.contacto_institucion.nombre}
                        onChange={handleChange}
                        maxLength={35}
                        className={`w-full p-2 border rounded-lg ${
                          errors.contacto_nombre ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Dr. Javier Martínez'
                      />
                      <small className='text-gray-500 text-xs'>
                        {formData.contacto_institucion.nombre.length}/35 caracteres
                      </small>
                      {errors.contacto_nombre && <p className='text-red-500 text-xs mt-1'>{errors.contacto_nombre}</p>}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Cargo (máx 35 caracteres)</label>
                      <input
                        type='text'
                        name='contacto_cargo'
                        value={formData.contacto_institucion.cargo}
                        onChange={handleChange}
                        maxLength={35}
                        className={`w-full p-2 border rounded-lg ${
                          errors.contacto_cargo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Director de Relaciones...'
                      />
                      <small className='text-gray-500 text-xs'>
                        {formData.contacto_institucion.cargo.length}/35 caracteres
                      </small>
                      {errors.contacto_cargo && <p className='text-red-500 text-xs mt-1'>{errors.contacto_cargo}</p>}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Email (máx 45 caracteres, debe contener @)</label>
                      <input
                        type='email'
                        name='contacto_email'
                        value={formData.contacto_institucion.email}
                        onChange={handleChange}
                        maxLength={45}
                        className={`w-full p-2 border rounded-lg ${
                          errors.contacto_email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='javier.martinez@unam.mx'
                      />
                      <small className='text-gray-500 text-xs'>
                        {formData.contacto_institucion.email.length}/45 caracteres
                      </small>
                      {errors.contacto_email && <p className='text-red-500 text-xs mt-1'>{errors.contacto_email}</p>}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Teléfono (solo números, máx 15 dígitos)</label>
                      <input
                        type='text'
                        name='contacto_telefono'
                        value={formData.contacto_institucion.telefono}
                        onChange={handleChange}
                        maxLength={15}
                        pattern='\d*'
                        className={`w-full p-2 border rounded-lg ${
                          errors.contacto_telefono ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='5512345678'
                      />
                      <small className='text-gray-500 text-xs'>
                        {formData.contacto_institucion.telefono.length}/15 números
                      </small>
                      {errors.contacto_telefono && (
                        <p className='text-red-500 text-xs mt-1'>{errors.contacto_telefono}</p>
                      )}
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
