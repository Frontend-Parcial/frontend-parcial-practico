import { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useUsersStore } from '../store/usersStore'
import logo from '../assets/UNICESAR 2024.png'
import logoUniversidad from '../assets/logo.png'
import PageWrapper from '../components/PageWrapper'
import { email, password } from '../utils/patterns'
import { validateRegister } from '../utils/validators'

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

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const handleSubmitEvent = async e => {
    e.preventDefault()

    const newErrors = {
      email: validateRegister('email', input.email),
      password: validateRegister('password', input.password),
    }
    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some(errorMsg => errorMsg !== '')
    const isEmpty = !input.email || !input.password
    if (hasErrors || isEmpty) {
      alert('Por favor, corrige los errores antes de enviar.')
      return
    }
    try {
      //! Aca estoy guardando el email para otras validaciones
      getEmailStore(input.email)
      await auth.loginPost(input)
    } catch (error) {
      setMensaje(error.message)
    }
    return
  }

  const handleInput = e => {
    const { name, value } = e.target
    setInput(prev => ({
      ...prev,
      [name]: value,
    }))

    const errorMessage = validateRegister(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage,
    }))
  }

  function mensajeSesion() {
    if (clic) {
      setClic(false)
      setInicioMensaje('Cargando...')
    }
  }

  const handleBeforeInput = (e, pattern) => {
    if (pattern && !pattern.test(e.data)) {
      e.preventDefault()
    }
  }

  // prueba prueba prueba

  return (
    <PageWrapper>
      <div className='flex flex-col justify-center items-center'>
        <header className='w-full p-4 mb-[20px]'>
          <img src={logo} alt='Logo' className='h-16 cursor-pointer' onClick={() => navigate('/')} />
        </header>
        <div className='border-2 border-primario rounded-2xl w-[70%] h-[600px] flex justify-center items-center mb-[20px]'>
          <div className='flex flex-row w-full h-full'>
            <div className='w-[50%] flex flex-col items-center justify-center bg-[#DBEBE3] rounded-l-2xl'>
              <div className='w-[90%] flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-bold mb-3'>SIDINAL-UPC</h1>
                <p>Sistemas de Division de Internacionalizacion</p>
                <p className='mb-6'>Universidad Popular del Cesar</p>
                <img src={logoUniversidad} alt='Logo' className='h-32 mb-6' />
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
                        placeholder='usuario@unicesar.edu.co'
                        type='email'
                        id='user-name'
                        name='email'
                        value={input.email}
                        onChange={handleInput}
                        onBeforeInput={e => handleBeforeInput(e, email.format)}
                        aria-describedby='user-name'
                        aria-invalid='false'
                        required
                        className='w-full text-black text-[1em] p-1 pl-2 border border-[var(--gris)] rounded-[10px]'
                      />
                      {errors.email && <p className='text-red-600 text-sm mt-1 mb-[-25px]'>{errors.email}</p>}
                    </div>

                    <div className='my-[30px] w-full flex flex-col gap-1 h-auto'>
                      <label htmlFor='password'>Contraseña</label>
                      <input
                        placeholder='********'
                        type='password'
                        id='password'
                        name='password'
                        aria-describedby='user-password'
                        aria-invalid='false'
                        value={input.password}
                        onChange={handleInput}
                        onBeforeInput={e => handleBeforeInput(e, password.format)}
                        required
                        className='w-full text-black text-[1em] p-1 pl-2 border border-[var(--gris)] rounded-[10px]'
                      />
                      {/* Este es */}
                      {errors.password && <p className='text-red-600 text-sm mt-1 max-w-[350px]'>{errors.password}</p>}
                    </div>

                    <div className='flex flex-row gap-2 mb-4 mt-[-15px]'>
                      <input type='checkbox' id='remember-me' name='remember-me' value='true' />
                      <label>Mantener la sesion iniciada</label>
                    </div>

                    <button
                      className='h-[30px] w-full rounded-[8px] bg-primario text-white  hover:bg-oscuro cursor-pointer transition-all ease-in-out duration-[300ms]'
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
    </PageWrapper>
  )
}
