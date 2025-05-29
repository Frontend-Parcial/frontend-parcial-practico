import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'

export function SolicitudesAdd() {
  const [activeTab, setActiveTab] = useState('convocatoria')

  const [studentForm, setStudentForm] = useState({
    documentType: '',
    documentNumber: '',
    fullName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    program: '',
    faculty: '',
    creditsApproved: '',
    average: '',
    status: 'Activo',
    academicSanctions: 'No',
    educationalSanctions: 'No',
  })

  const [agreementForm, setAgreementForm] = useState({
    institution: '',
    country: '',
    city: '',
    type: '',
    description: '',
    status: 'Activo',
    requirements: '',
    availableSpots: '',
  })

  const [errors, setErrors] = useState({})

  const handleStudentChange = e => {
    const { name, value } = e.target
    setStudentForm({
      ...studentForm,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const handleAgreementChange = e => {
    const { name, value } = e.target
    setAgreementForm({
      ...agreementForm,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStudentForm = () => {
    const newErrors = {}

    if (!studentForm.documentType) newErrors.documentType = 'Seleccione un tipo de documento'
    if (!studentForm.documentNumber) {
      newErrors.documentNumber = 'Ingrese número de documento'
    } else if (!/^\d+$/.test(studentForm.documentNumber)) {
      newErrors.documentNumber = 'El documento debe contener solo números'
    }

    if (!studentForm.fullName) newErrors.fullName = 'Ingrese nombre completo'
    if (!studentForm.birthDate) newErrors.birthDate = 'Seleccione fecha de nacimiento'

    if (!studentForm.email) {
      newErrors.email = 'Ingrese correo electrónico'
    } else if (!isValidEmail(studentForm.email)) {
      newErrors.email = 'Formato de correo inválido'
    }

    if (!studentForm.phone) {
      newErrors.phone = 'Ingrese número telefónico'
    } else if (!/^\d{10}$/.test(studentForm.phone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos'
    }

    if (!studentForm.address) newErrors.address = 'Ingrese dirección'
    if (!studentForm.program) newErrors.program = 'Seleccione programa académico'
    if (!studentForm.faculty) newErrors.faculty = 'Seleccione facultad'

    if (!studentForm.creditsApproved) {
      newErrors.creditsApproved = 'Ingrese créditos aprobados'
    } else if (isNaN(studentForm.creditsApproved) || parseInt(studentForm.creditsApproved) < 0) {
      newErrors.creditsApproved = 'Valor no válido'
    }

    if (!studentForm.average) {
      newErrors.average = 'Ingrese promedio'
    } else if (
      isNaN(studentForm.average) ||
      parseFloat(studentForm.average) < 0 ||
      parseFloat(studentForm.average) > 5
    ) {
      newErrors.average = 'El promedio debe estar entre 0 y 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAgreementForm = () => {
    const newErrors = {}

    if (!agreementForm.institution) newErrors.institution = 'Seleccione institución'
    if (!agreementForm.country) newErrors.country = 'Seleccione país'
    if (!agreementForm.city) newErrors.city = 'Seleccione ciudad'
    if (!agreementForm.type) newErrors.type = 'Seleccione tipo de convenio'
    if (!agreementForm.description) newErrors.description = 'Ingrese descripción'
    if (!agreementForm.requirements) newErrors.requirements = 'Ingrese requisitos'

    if (!agreementForm.availableSpots) {
      newErrors.availableSpots = 'Ingrese cupos disponibles'
    } else if (isNaN(agreementForm.availableSpots) || parseInt(agreementForm.availableSpots) < 1) {
      newErrors.availableSpots = 'Debe ser un número positivo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (activeTab === 'Convenio') {
      if (validateAgreementForm()) {
        alert('Formulario de convenio enviado correctamente')
      }
    } else {
      if (validateStudentForm()) {
        alert('Formulario de estudiante enviado correctamente')
      }
    }
  }

  return (
    <PageWrapper>
      <div className='min-h-screen flex flex-col'>
        <header className='bg-claro p-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <div className='text-white mr-2'>
              <img
                src='../assets/logo.png'
                alt='Universidad Popular del Cesar Logo'
                className='w-full h-full object-contain'
              />
            </div>
          </div>
          <div className='w-30 h-30'>
            <img
              src='/src/assets/logo.png'
              alt='Universidad Popular del Cesar Logo'
              className='w-full h-full object-contain'
            />
          </div>
        </header>

        <nav className='bg-gray-200 p-2'>
          <div className='flex justify-between max-w-5xl mx-auto'>
            {['Convenio', 'Solicitudes', 'Asignatura', 'Seguimiento', 'Reporte'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-white shadow' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} ↓
              </button>
            ))}
          </div>
        </nav>

        <main className='flex-grow bg-gray-100 p-4'>
          <div className='max-w-6xl mx-auto grid grid-cols-1  gap-4'>
            <div className='bg-claro rounded-lg overflow-hidden'>
              <h2 className='p-4 text-center text-oscuro text-lg font-medium'>Información del Convenio</h2>
              <div className='bg-yellow-300 h-1'></div>
              <form className='p-4 space-y-4' onSubmit={handleSubmit}>
                <div>
                  <label className='block mb-1'>Institución</label>
                  <select
                    name='institution'
                    value={agreementForm.institution}
                    onChange={handleAgreementChange}
                    className={`w-full p-2 border rounded ${errors.institution ? 'border-red-500' : ''}`}
                  >
                    <option value=''>Seleccione</option>
                    <option value='Universidad Nacional Autónoma'>Universidad Nacional Autónoma</option>
                    <option value='Universidad de Los Andes'>Universidad de Los Andes</option>
                    <option value='Universidad Javeriana'>Universidad Javeriana</option>
                  </select>
                  {errors.institution && <p className='text-error text-xs'>{errors.institution}</p>}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1'>País</label>
                    <select
                      name='country'
                      value={agreementForm.country}
                      onChange={handleAgreementChange}
                      className={`w-full p-2 border rounded ${errors.country ? 'border-red-500' : ''}`}
                    >
                      <option value=''>Seleccione</option>
                      <option value='Mexico'>México</option>
                      <option value='Colombia'>Colombia</option>
                      <option value='España'>España</option>
                      <option value='Argentina'>Argentina</option>
                    </select>
                    {errors.country && <p className='text-error text-xs'>{errors.country}</p>}
                  </div>
                </div>

                <div>
                  <label className='block mb-1'>Ciudad</label>
                  <select
                    name='city'
                    value={agreementForm.city}
                    onChange={handleAgreementChange}
                    className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : ''}`}
                  >
                    <option value=''>Seleccione</option>
                    <option value='Ciudad de México'>Ciudad de México</option>
                    <option value='Bogotá'>Bogotá</option>
                    <option value='Madrid'>Madrid</option>
                    <option value='Buenos Aires'>Buenos Aires</option>
                  </select>
                  {errors.city && <p className='text-error text-xs'>{errors.city}</p>}
                </div>

                <div className='bg-yellow-300 h-1 my-2'></div>
                <h3 className='text-oscuro font-medium'>Convenio</h3>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1'>Tipo</label>
                    <select
                      name='type'
                      value={agreementForm.type}
                      onChange={handleAgreementChange}
                      className={`w-full p-2 border rounded ${errors.type ? 'border-red-500' : ''}`}
                    >
                      <option value=''>Seleccione</option>
                      <option value='Internacional'>Internacional</option>
                      <option value='Nacional'>Nacional</option>
                      <option value='Regional'>Regional</option>
                    </select>
                    {errors.type && <p className='text-error text-xs'>{errors.type}</p>}
                  </div>
                  <div>
                    <label className='block mb-1'>Descripción</label>
                    <textarea
                      name='description'
                      value={agreementForm.description}
                      onChange={handleAgreementChange}
                      placeholder='Convenio de cooperación académica para movilidad estudiantil en programas de ingeniería'
                      className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                      rows={2}
                    ></textarea>
                    {errors.description && <p className='text-error text-xs'>{errors.description}</p>}
                  </div>
                </div>

                <div>
                  <label className='block mb-1'>Estado</label>
                  <select
                    name='status'
                    value={agreementForm.status}
                    onChange={handleAgreementChange}
                    className='w-full p-2 border rounded'
                  >
                    <option value='Activo'>Activo</option>
                    <option value='Inactivo'>Inactivo</option>
                    <option value='En revisión'>En revisión</option>
                  </select>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1'>Requisitos Específicos</label>
                    <textarea
                      name='requirements'
                      value={agreementForm.requirements}
                      onChange={handleAgreementChange}
                      placeholder='Promedio mínimo de 4.0, nivel de español B2'
                      className={`w-full p-2 border rounded ${errors.requirements ? 'border-red-500' : ''}`}
                      rows={2}
                    ></textarea>
                    {errors.requirements && <p className='text-error text-xs'>{errors.requirements}</p>}
                  </div>
                  <div>
                    <label className='block mb-1'>Cupos disponibles</label>
                    <input
                      type='number'
                      name='availableSpots'
                      value={agreementForm.availableSpots}
                      onChange={handleAgreementChange}
                      placeholder='2'
                      min='1'
                      className={`w-full p-2 border rounded ${errors.availableSpots ? 'border-red-500' : ''}`}
                    />
                    {errors.availableSpots && <p className='text-error text-xs'>{errors.availableSpots}</p>}
                  </div>
                </div>

                <div>
                  <label className='block mb-1'>Beneficios</label>
                  <textarea
                    name='benefits'
                    value={agreementForm.benefits}
                    onChange={handleAgreementChange}
                    placeholder='Exención de matrícula, acceso a bibliotecas y laboratorios, participación en investigaciones'
                    className='w-full p-2 border rounded'
                    rows={3}
                  ></textarea>
                </div>

                <div className='text-center'>
                  <button type='submit' className='bg-primario text-complementario py-2 px-4 rounded hover:bg-oscuro'>
                    Guardar Convenio
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
