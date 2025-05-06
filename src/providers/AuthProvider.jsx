import { useContext, createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../lib/data'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [usuarioValido, setUsuarioValido] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('site') || '')
  const navigate = useNavigate()

  // const { getProfilePicStore, getUserNameStore, getUserToken, getUserSecondNameStore } = useInfoUsersStore()

  const loginPost = async data => {
    console.log('dentro del login post')

    const validacion = {
      email: data.email,
      password: data.password,
    }

    try {
      const loginData = await getUser(validacion)
      if (loginData) {
        setUsuarioValido(true)
        loginAction(loginData)
      }
    } catch (error) {
      console.error('Error al hacer login:', error)
    }
  }

  function loginAction(payload) {
    const { rol, user_id, nombre, token } = payload
    console.log(payload.rol) // TODO: Quitar esta vaina pa la presentacion, solo para pruebas
    const commonActions = () => {
      setUser(user_id)
      setToken(token)
      localStorage.setItem('site', rol)
    }

    switch (rol) {
      case 'admin':
        commonActions()
        navigate('/prueba')
        // navigate('/dashboard') <- Aqui hay que poner esto, aguanta
        break
      case 'user':
        commonActions()
        // navigate('/docentes') <- aqui deberia ir a alguna ruta, la cual no se xd
        break
      default:
        console.error('Rol no reconocido')
        break
    }
  }

  const logOut = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('site')
    sessionStorage.removeItem('user-storage')
    navigate('/login')
  }

  return <AuthContext.Provider value={{ token, user, loginPost, logOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
