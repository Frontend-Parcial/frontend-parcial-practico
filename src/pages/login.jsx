import { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useUsersStore } from '../store/usersStore'

export function Login() {
  const [mensaje, setMensaje] = useState('')
  const [clic, setClic] = useState(true)
  const [inicioMensaje, setInicioMensaje] = useState('Iniciar Sesion')

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
    <div>
      <div className='bg-cover bg-center bg-no-repeat'>
        <header className=''>{/* Aqui deberia haber algo, pero no lo hay */}</header>
        <form className='main-login h-screen flex justify-center items-center flex-col' onSubmit={handleSubmitEvent}>
          <div className='relative w-[400px] h-[470px] rounded-[20px] backdrop-blur-[20px] flex justify-center items-center flex-col'>
            <h2 className='text-black text-2xl text-center'>Iniciar Sesion</h2>

            <div className='relative my-[30px] w-[310px] border-b-2 border-black'>
              <ion-icon name='mail-outline' className='absolute right-2 text-black text-xl top-[20px]'></ion-icon>
              <input
                placeholder='Email'
                type='email'
                id='user-name'
                name='email'
                onChange={handleInput}
                aria-describedby='user-name'
                aria-invalid='false'
                required
                className='w-full h-[50px] bg-transparent border-none outline-none text-black text-[1em] pl-[5px] pr-[35px]'
              />
            </div>

            <div className='relative my-[30px] w-[310px] border-b-2 border-black'>
              <input
                placeholder='Password'
                type='password'
                id='password'
                name='password'
                aria-describedby='user-password'
                aria-invalid='false'
                onChange={handleInput}
                required
                className='w-full h-[50px] bg-transparent border-none outline-none text-black text-[1em] pl-[5px] pr-[35px]'
              />
            </div>

            <button
              className='h-[50px] w-[320px] rounded-[5px] bg-[#23CAEE] text-black text-[16px] mb-[-3px] hover:bg-[#0b97b6] transition-all ease-in-out duration-[300ms]'
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
        </form>
      </div>
    </div>
  )
}
