import { useState, useEffect } from 'react'
import { getConvenios } from '../../lib/reportes/convenios'
import { listStudents, listStudentsFilter } from '../../lib/estudiantes-data'
import { crearSolicitud } from '../../lib/solicitudes-data'
import PageWrapper from '../../components/PageWrapper'
import { useNavigate } from 'react-router-dom'

const StudentAutocomplete = ({ onSelect, error }) => {
  const [query, setQuery] = useState('')
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadStudents = async () => {
      if (query.trim().length < 3) return

      setIsLoading(true)
      try {
        const data = await listStudentsFilter(query)
        setStudents(data.estudiantes || [])
      } catch (err) {
        console.error('Error cargando estudiantes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      loadStudents()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredStudents([])
      return
    }

    const filtered = students.filter(
      student =>
        student.nombre_completo.toLowerCase().includes(query.toLowerCase()) ||
        student.documento_identidad.includes(query),
    )
    setFilteredStudents(filtered.slice(0, 5))
  }, [query, students])

  const handleSelect = student => {
    setSelectedStudent(student)
    setQuery(`${student.nombre_completo} (${student.documento_identidad})`)
    setShowDropdown(false)
    onSelect(student)
  }

  const handleInputChange = e => {
    setQuery(e.target.value)
    setSelectedStudent(null)
    if (e.target.value.trim() !== '') {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
      onSelect(null)
    }
  }

  const handleClear = () => {
    setQuery('')
    setSelectedStudent(null)
    setShowDropdown(false)
    onSelect(null)
  }

  return (
    <div className='relative w-full'>
      <label className='block mb-1 font-medium'>Seleccionar Estudiante</label>
      <div className='relative'>
        <input
          type='text'
          value={query}
          onChange={handleInputChange}
          placeholder='Buscar por nombre o documento...'
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
          onFocus={() => query.trim() !== '' && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {query && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}
      </div>

      {isLoading && query.trim() !== '' && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2'>
          <div className='flex justify-center items-center py-2'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primario'></div>
          </div>
        </div>
      )}

      {showDropdown && filteredStudents.length > 0 && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto'>
          {filteredStudents.map(student => (
            <div
              key={student._id}
              className='p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0'
              onMouseDown={() => handleSelect(student)}
            >
              <div className='font-medium'>{student.nombre_completo}</div>
              <div className='text-sm text-gray-600'>
                <span>Documento: {student.documento_identidad}</span>
                <span className='mx-2'>|</span>
                <span>{student.programa_academico}</span>
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                <span>Promedio: {student.promedio_academico}</span>
                <span className='mx-2'>|</span>
                <span>Créditos: {student.creditos_cursados}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && query.trim() !== '' && filteredStudents.length === 0 && !isLoading && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-gray-500'>
          No se encontraron estudiantes
        </div>
      )}

      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  )
}

const SolicitudIntercambioForm = () => {
  const [convenios, setConvenios] = useState([])
  const [loadingConvenios, setLoadingConvenios] = useState(true)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id_solicitante: '',
    estudiante_completo: null,
    fecha_creacion_estudiante: '',
    id_convenio: '',
    periodo_academico: '2025-2',
    modalidad: 'presencial',
    tipo_intercambio: 'internacional',
    duracion: 1,
    asignaturas: [
      {
        codigo_asignatura_origen: '',
        nombre_asignatura_origen: '',
        creditos_asignatura_origen: '',
        codigo_asignatura_destino: '',
        nombre_asignatura_destino: '',
        creditos_asignatura_destino: '',
      },
    ],
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        const data = await getConvenios()
        setConvenios(data.convenios || [])
      } catch (error) {
        console.error('Error cargando convenios:', error)
      } finally {
        setLoadingConvenios(false)
      }
    }
    fetchConvenios()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAsignaturaChange = (index, e) => {
    const { name, value } = e.target
    const newAsignaturas = [...formData.asignaturas]
    newAsignaturas[index] = {
      ...newAsignaturas[index],
      [name]: value,
    }
    setFormData(prev => ({
      ...prev,
      asignaturas: newAsignaturas,
    }))
  }

  const addAsignatura = () => {
    setFormData(prev => ({
      ...prev,
      asignaturas: [
        ...prev.asignaturas,
        {
          codigo_asignatura_origen: '',
          nombre_asignatura_origen: '',
          creditos_asignatura_origen: '',
          codigo_asignatura_destino: '',
          nombre_asignatura_destino: '',
          creditos_asignatura_destino: '',
        },
      ],
    }))
  }

  const removeAsignatura = index => {
    const newAsignaturas = formData.asignaturas.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      asignaturas: newAsignaturas,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.id_solicitante) {
      newErrors.id_solicitante = 'Debe seleccionar un estudiante'
    }
    if (!formData.id_convenio) {
      newErrors.id_convenio = 'Debe seleccionar un convenio'
    }
    if (!formData.periodo_academico) {
      newErrors.periodo_academico = 'El periodo académico es requerido'
    }
    if (!formData.duracion || formData.duracion <= 0) {
      newErrors.duracion = 'La duración debe ser mayor a 0'
    }

    formData.asignaturas.forEach((asig, index) => {
      if (!asig.codigo_asignatura_origen) {
        newErrors[`asignatura_${index}_codigo_origen`] = 'Código de asignatura origen requerido'
      }
      if (!asig.nombre_asignatura_origen) {
        newErrors[`asignatura_${index}_nombre_origen`] = 'Nombre de asignatura origen requerido'
      }
      if (!asig.codigo_asignatura_destino) {
        newErrors[`asignatura_${index}_codigo_destino`] = 'Código de asignatura destino requerido'
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        const solicitud = {
          ...formData,
          fecha_solicitud: new Date().toISOString(),
        }

        await crearSolicitud(solicitud)

        setSubmitSuccess(true)
        setTimeout(() => {
          setFormData({
            id_solicitante: '',
            estudiante_completo: null,
            fecha_creacion_estudiante: '',
            id_convenio: '',
            periodo_academico: '2025-2',
            modalidad: 'presencial',
            tipo_intercambio: 'internacional',
            duracion: 1,
            asignaturas: [
              {
                codigo_asignatura_origen: '',
                nombre_asignatura_origen: '',
                creditos_asignatura_origen: '',
                codigo_asignatura_destino: '',
                nombre_asignatura_destino: '',
                creditos_asignatura_destino: '',
              },
            ],
          })
          setSubmitSuccess(false)
        }, 3000)
      } catch (error) {
        console.error('Error al enviar la solicitud:', error)
        setErrors({ submit: error.message || 'Error al enviar la solicitud' })
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
              <h2 className='p-4 text-center text-oscuro text-xl font-bold'>Nueva Solicitud de Intercambio</h2>
              <div className='bg-claro h-1'></div>

              <form className='p-6 space-y-6' onSubmit={handleSubmit}>
                {/* Sección de información del solicitante */}
                <div className='space-y-4'>
                  <h3 className='text-oscuro font-semibold text-lg border-b pb-2'>Información del Solicitante</h3>

                  <StudentAutocomplete
                    onSelect={student => {
                      if (student) {
                        setFormData(prev => ({
                          ...prev,
                          id_solicitante: student._id,
                          estudiante_completo: student,
                          fecha_creacion_estudiante: student.fecha_creacion || new Date().toISOString(),
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          id_solicitante: '',
                          estudiante_completo: null,
                          fecha_creacion_estudiante: '',
                        }))
                      }
                    }}
                    error={errors.id_solicitante}
                  />

                  <div>
                    <label className='block mb-1 font-medium'>Convenio</label>
                    <select
                      name='id_convenio'
                      value={formData.id_convenio}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-lg ${
                        errors.id_convenio ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loadingConvenios}
                    >
                      <option value=''>Seleccione un convenio</option>
                      {convenios.map(convenio => (
                        <option key={convenio._id} value={convenio._id}>
                          {convenio.nombre_institucion} ({convenio.pais_institucion}) - Cupos:{' '}
                          {convenio.cupos_disponibles}
                        </option>
                      ))}
                    </select>
                    {errors.id_convenio && <p className='text-red-500 text-xs mt-1'>{errors.id_convenio}</p>}
                    {loadingConvenios && <p className='text-gray-500 text-xs mt-1'>Cargando convenios...</p>}
                  </div>
                </div>

                {/* Sección de detalles de la solicitud */}
                <div className='space-y-4'>
                  <h3 className='text-oscuro font-semibold text-lg border-b pb-2'>Detalles de la Solicitud</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Periodo Académico</label>
                      <select
                        name='periodo_academico'
                        value={formData.periodo_academico}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${
                          errors.periodo_academico ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value='2025-1'>2025-1</option>
                        <option value='2025-2'>2025-2</option>
                        <option value='2026-1'>2026-1</option>
                        <option value='2026-2'>2026-2</option>
                      </select>
                      {errors.periodo_academico && (
                        <p className='text-red-500 text-xs mt-1'>{errors.periodo_academico}</p>
                      )}
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Modalidad</label>
                      <select
                        name='modalidad'
                        value={formData.modalidad}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                      >
                        <option value='presencial'>Presencial</option>
                        <option value='virtual'>Virtual</option>
                        <option value='hibrido'>Híbrido</option>
                      </select>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-1 font-medium'>Tipo de Intercambio</label>
                      <select
                        name='tipo_intercambio'
                        value={formData.tipo_intercambio}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-lg'
                      >
                        <option value='internacional'>Internacional</option>
                        <option value='nacional'>Nacional</option>
                        <option value='regional'>Regional</option>
                      </select>
                    </div>

                    <div>
                      <label className='block mb-1 font-medium'>Duración (semestres)</label>
                      <input
                        type='number'
                        name='duracion'
                        value={formData.duracion}
                        onChange={handleChange}
                        min='1'
                        max='2'
                        className={`w-full p-2 border rounded-lg ${
                          errors.duracion ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.duracion && <p className='text-red-500 text-xs mt-1'>{errors.duracion}</p>}
                    </div>
                  </div>
                </div>

                {/* Sección de asignaturas */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <h3 className='text-oscuro font-semibold text-lg'>Asignaturas a Homologar</h3>
                    <button
                      type='button'
                      onClick={addAsignatura}
                      className='bg-primario text-white py-2 px-3 rounded-lg hover:bg-oscuro font-medium text-base shadow-md hover:shadow-lg transition-all flex items-center'
                    >
                      <span className='mr-1'>+</span> Añadir Asignatura
                    </button>
                  </div>

                  {formData.asignaturas.map((asignatura, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg p-4 bg-white shadow-sm'>
                      <div className='flex justify-between items-center mb-3'>
                        <h4 className='font-medium text-gray-700'>Asignatura #{index + 1}</h4>
                        {formData.asignaturas.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeAsignatura(index)}
                            className='text-red-500 hover:text-red-700 text-sm flex items-center'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-4 w-4 mr-1'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                              />
                            </svg>
                            Eliminar
                          </button>
                        )}
                      </div>

                      <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <label className='block mb-1 text-sm font-medium'>Código asignatura origen</label>
                            <input
                              type='text'
                              name='codigo_asignatura_origen'
                              value={asignatura.codigo_asignatura_origen}
                              onChange={e => handleAsignaturaChange(index, e)}
                              className={`w-full p-2 border rounded-lg ${
                                errors[`asignatura_${index}_codigo_origen`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder='IS-4501'
                            />
                            {errors[`asignatura_${index}_codigo_origen`] && (
                              <p className='text-red-500 text-xs mt-1'>{errors[`asignatura_${index}_codigo_origen`]}</p>
                            )}
                          </div>

                          <div>
                            <label className='block mb-1 text-sm font-medium'>Nombre asignatura origen</label>
                            <input
                              type='text'
                              name='nombre_asignatura_origen'
                              value={asignatura.nombre_asignatura_origen}
                              onChange={e => handleAsignaturaChange(index, e)}
                              className={`w-full p-2 border rounded-lg ${
                                errors[`asignatura_${index}_nombre_origen`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder='Inteligencia Artificial'
                            />
                            {errors[`asignatura_${index}_nombre_origen`] && (
                              <p className='text-red-500 text-xs mt-1'>{errors[`asignatura_${index}_nombre_origen`]}</p>
                            )}
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <label className='block mb-1 text-sm font-medium'>Créditos origen</label>
                            <input
                              type='number'
                              name='creditos_asignatura_origen'
                              value={asignatura.creditos_asignatura_origen}
                              onChange={e => handleAsignaturaChange(index, e)}
                              className='w-full p-2 border border-gray-300 rounded-lg'
                              min='1'
                              placeholder='4'
                            />
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <label className='block mb-1 text-sm font-medium'>Código asignatura destino</label>
                            <input
                              type='text'
                              name='codigo_asignatura_destino'
                              value={asignatura.codigo_asignatura_destino}
                              onChange={e => handleAsignaturaChange(index, e)}
                              className={`w-full p-2 border rounded-lg ${
                                errors[`asignatura_${index}_codigo_destino`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder='IA-3420'
                            />
                            {errors[`asignatura_${index}_codigo_destino`] && (
                              <p className='text-red-500 text-xs mt-1'>
                                {errors[`asignatura_${index}_codigo_destino`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className='block mb-1 text-sm font-medium'>Nombre asignatura destino</label>
                            <input
                              type='text'
                              name='nombre_asignatura_destino'
                              value={asignatura.nombre_asignatura_destino}
                              onChange={e => handleAsignaturaChange(index, e)}
                              className='w-full p-2 border border-gray-300 rounded-lg'
                              placeholder='Inteligencia Artificial y Aprendizaje Automático'
                            />
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <label className='block mb-1 text-sm font-medium'>Créditos destino</label>
                            <input
                              type='number'
                              name='creditos_asignatura_destino'
                              value={asignatura.creditos_asignatura_destino}
                              onChange={e => handleAsignaturaChange(index, e)}
                              className='w-full p-2 border border-gray-300 rounded-lg'
                              min='1'
                              placeholder='6'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.submit && <div className='text-red-500 text-center py-2'>{errors.submit}</div>}

                {submitSuccess && (
                  <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center'>
                    Solicitud enviada exitosamente!
                  </div>
                )}

                <div className='pt-6 flex justify-between gap-4'>
                  {/* Botones */}
                  <button
                    type='button'
                    onClick={() => navigate('/solicitudes')}
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
                        Enviando...
                      </span>
                    ) : (
                      'Enviar Solicitud'
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

export default SolicitudIntercambioForm
