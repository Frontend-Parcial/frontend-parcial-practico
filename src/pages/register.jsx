import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useUsersStore } from '../store/usersStore'
import logo from '../assets/UNICESAR 2024.png'
import logoUniversidad from '../assets/logo.png'
import { useAuth } from '../providers/AuthProvider'
import PageWrapper from '../components/PageWrapper'

export function Register() {
  const [mensaje, setMensaje] = useState('')
  const [clic, setClic] = useState(true)
  const [inicioMensaje, setInicioMensaje] = useState('Registrando...')
  const auth = useAuth()
  const { getEmailStore } = useUsersStore()
  const navigate = useNavigate()

  const [input, setInput] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'admin',
  })

  const handleSubmitEvent = async e => {
    e.preventDefault()
    if (input.nombre && input.email && input.password && input.rol) {
      setInicioMensaje('Registrando...')
      setClic(false)

      try {
        getEmailStore(input.email)
        const result = await auth.registerPost(input)
        console.log('Datos a registrar:', input)

        if (result) {
          setInicioMensaje('¡Registrado!')
          navigate('/login')
        } else {
          setInicioMensaje('Error al registrar')
          setClic(true)
        }
      } catch (error) {
        console.error(error)
        setMensaje(error.message)
        setInicioMensaje('Error')
        setClic(true)
      }
    } else {
      alert('Todos los campos son obligatorios')
    }
  }

  const handleInput = e => {
    const { name, value } = e.target
    setInput(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const mensajeSesion = () => {
    if (clic) {
      setClic(false)
      setInicioMensaje('Registrando...')
    }
  }

  return (
    <PageWrapper>
      <div className='flex flex-col justify-center items-center'>
        <header className='w-full p-4 mb-[20px]'>
          <img src={logo} alt='Logo' className='h-16 cursor-pointer' onClick={() => navigate('/')} />
        </header>

        <div className='border-2 border-primario rounded-2xl w-[70%] h-[600px] flex justify-center items-center mb-[20px]'>
          <div className='flex flex-row w-full h-full'>
            {/* Columna izquierda */}
            <div className='w-[50%] flex flex-col items-center justify-center bg-[#DBEBE3] rounded-l-2xl'>
              <div className='w-[90%] flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-bold mb-3'>SIDINAC-UPC</h1>
                <p>Sistema de División de Internacionalización</p>
                <p className='mb-6'>Universidad Popular del Cesar</p>
                <img src={logoUniversidad} alt='Logo universidad' className='h-32 mb-6' />
              </div>
              <div className='w-[80%] gap-2.5 flex flex-col'>
                <InfoCard title='Movilidad Internacional' subtitle='Accede a oportunidades académicas globales' />
                <InfoCard title='Seguimiento Académico' subtitle='Administra tus procesos de intercambio' />
                <InfoCard title='Gestión Documental' subtitle='Centraliza toda tu documentación' />
              </div>
            </div>

            {/* Columna derecha: Registro */}
            <div className='w-[50%] flex flex-col items-center justify-center mt-[40px]'>
              <form
                className='main-login h-screen flex justify-center items-center flex-col'
                onSubmit={handleSubmitEvent}
              >
                <div className='w-full mb-[50px] p-5 flex justify-center flex-col'>
                  <h1 className='text-black text-4xl font-bold'>Registro</h1>
                  <p className='mb-[10px]'>Ingrese su información para crear su usuario</p>

                  <div className='w-full'>
                    <InputField
                      label='Nombre completo'
                      name='nombre'
                      type='text'
                      placeholder='Juan Rodriguez Mena'
                      onChange={handleInput}
                    />

                    <InputField
                      label='Correo institucional'
                      name='email'
                      type='email'
                      placeholder='example@unicesar.edu.co'
                      onChange={handleInput}
                    />

                    <InputField
                      label='Contraseña'
                      name='password'
                      type='password'
                      placeholder='********'
                      onChange={handleInput}
                    />

                    <div className='my-[10px] w-full flex flex-col gap-1'>
                      <label htmlFor='rol'>Rol</label>
                      <select
                        id='rol'
                        name='rol'
                        value={input.rol}
                        onChange={handleInput}
                        className='w-full text-black text-[1em] p-1 pl-2 border border-[var(--gris)] rounded-[10px]'
                      >
                        <option value='admin'>Admin</option>
                      </select>
                    </div>

                    <button
                      className='h-[30px] w-full rounded-[8px] bg-oscuro text-white hover:bg-claro cursor-pointer transition-all ease-in-out duration-[300ms]'
                      onClick={mensajeSesion}
                      type='submit'
                    >
                      {inicioMensaje}
                    </button>

                    <div className='text-black text-center my-[25px]'>
                      <p>
                        ¿Ya tienes una cuenta?{' '}
                        <span
                          onClick={() => navigate('/login')}
                          className='text-black font-semibold hover:underline cursor-pointer'
                        >
                          Inicia sesión
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

// Componente reutilizable para inputs
function InputField({ label, name, type, placeholder, onChange }) {
  return (
    <div className='my-[10px] w-full flex flex-col gap-1'>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required
        className='w-full text-black text-[1em] p-1 pl-2 border border-[var(--gris)] rounded-[10px]'
      />
    </div>
  )
}

// Componente reutilizable para tarjetas informativas
function InfoCard({ title, subtitle }) {
  return (
    <div className='bg-white rounded-[10px] flex flex-row p-1 items-center gap-3 transition-all duration-300 hover:scale-105'>
      <div className='bg-[#DBEBE3] rounded-full w-[40px] h-[40px] flex justify-center items-center'> - </div>
      <div className='flex flex-col'>
        <p className='font-bold'>{title}</p>
        <p className='text-sm text-gray-700'>{subtitle}</p>
      </div>
    </div>
  )
}
