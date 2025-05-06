import { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useUsersStore } from '../store/usersStore'
import logo from '../assets/UNICESAR 2024.png'
import logoUniversidad from '../assets/logo.png'

export function Login() {
  const [mensaje, setMensaje] = useState('')
  const [clic, setClic] = useState(true)
  const [inicioMensaje, setInicioMensaje] = useState('Login')

  const { getEmailStore } = useUsersStore()
  const auth = useAuth()
  const navigate = useNavigate()

  const [input, setInput] = useState({
    email: '',
    password: '',
  })

  const handleSubmitEvent = async e => {
    e.preventDefault()
    if (input.email !== '' && input.password !== '') {
      try {
        //! Aca estoy guardando el email para otras validaciones
        getEmailStore(input.email)
        await auth.loginPost(input)
      } catch (error) {
        setMensaje(error.message)
      }
      return
    }
    alert('Todos los campos son obligatorios')
  }

  const handleInput = e => {
    const { name, value } = e.target
    setInput(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  function mensajeSesion() {
    if (clic) {
      setClic(false)
      setInicioMensaje('Cargando...')
    }
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <header className='w-full p-4 mb-[20px]'>
        <img src={logo} alt='Logo' className='h-16 cursor-pointer' onClick={() => navigate('/')} />
      </header>
      <div className='border-2 border-primario rounded-2xl w-[70%] h-[600px] flex justify-center items-center mb-[20px]'>
        <div className='flex flex-row w-full h-full'>
          <div className='w-[50%] flex flex-col items-center justify-center bg-[#DBEBE3] rounded-l-2xl'>
            <div className='w-[90%] flex flex-col justify-center items-center'>
              <h1 className='text-4xl font-bold mb-3'>SIDINAC-UPC</h1>
              <p>Sistemas de Division de Internacionalizacion</p>
              <p className='mb-6'>Universidad Popular del Cesar</p>
              <img src={logoUniversidad} alt='Logo' className='h-32 mb-6' />
            </div>
            <div className=' w-[80%] gap-2.5 flex flex-col'>
              <div className='bg-white rounded-[10px] flex flex-row p-1 items-center gap-3 transition-all duration-300 hover:scale-105'>
                <div className='bg-[#DBEBE3] rounded-full w-[40px] h-[40px] flex justify-center items-center'> - </div>
                <div className='flex flex-col'>
                  <p className='font-bold'>Movilidad Internacional</p>
                  <p className='text-sm text-gray-700'>Accede a oportunidades academicas globales</p>
                </div>
              </div>

              <div className='bg-white rounded-[10px] flex flex-row p-1 items-center gap-3 transition-all duration-300 hover:scale-105'>
                <div className='bg-[#DBEBE3] rounded-full w-[40px] h-[40px] flex justify-center items-center'> - </div>
                <div className='flex flex-col'>
                  <p className='font-bold'>Seguimiento Academico</p>
                  <p className='text-sm text-gray-700'>Administra tus procesos de intercambio</p>
                </div>
              </div>

              <div className='bg-white rounded-[10px] flex flex-row p-1 items-center gap-3 transition-all duration-300 hover:scale-105'>
                <div className='bg-[#DBEBE3] rounded-full w-[40px] h-[40px] flex justify-center items-center'> - </div>
                <div className='flex flex-col'>
                  <p className='font-bold'>Gestion Documental</p>
                  <p className='text-sm text-gray-700'>Centraliza toda tu documentacion</p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-[50%] flex flex-col items-center justify-center mt-[40px]'>
            <form
              className='main-login h-screen flex justify-center items-center flex-col'
              onSubmit={handleSubmitEvent}
            >
              <div className='w-full mb-[50px] p-5 flex justify-center flex-col'>
                <h1 className='text-black text-4xl font-bold'>Bienvenido de nuevo</h1>
                <p className='mb-[40px]'>Ingrese sus credenciales de acceso</p>

                <div className=' w-[100%]'>
                  <div className=' my-[30px] w-full flex flex-col gap-1'>
                    <label htmlFor='email'>Email</label>
                    <input
                      placeholder='example@unicesar.edu.co'
                      type='email'
                      id='user-name'
                      name='email'
                      onChange={handleInput}
                      aria-describedby='user-name'
                      aria-invalid='false'
                      required
                      className='w-full text-black text-[1em] p-1 pl-2 border border-[var(--gris)] rounded-[10px]'
                    />
                  </div>

                  <div className='my-[30px] w-full flex flex-col gap-1'>
                    <label htmlFor='password'>Contraseña</label>
                    <input
                      placeholder='********'
                      type='password'
                      id='password'
                      name='password'
                      aria-describedby='user-password'
                      aria-invalid='false'
                      onChange={handleInput}
                      required
                      className='w-full text-black text-[1em] p-1 pl-2 border border-[var(--gris)] rounded-[10px]'
                    />
                  </div>

                  <div className='flex flex-row gap-2 mb-4 mt-[-15px]'>
                    <input type='checkbox' id='remember-me' name='remember-me' value='true' />
                    <label>Mantener la sesion iniciada</label>
                  </div>

                  <button
                    className='h-[30px] w-full rounded-[8px] bg-oscuro text-white  hover:bg-claro cursor-pointer transition-all ease-in-out duration-[300ms]'
                    onClick={mensajeSesion}
                    type='submit'
                  >
                    {inicioMensaje}
                  </button>

                  <div className='text-black text-center my-[25px]'>
                    <p>
                      No tienes una cuenta?{' '}
                      <a
                        onClick={() => navigate('/register')}
                        className='text-black font-semibold hover:underline cursor-pointer'
                      >
                        Registrate
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
