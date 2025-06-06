import { useContext, createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, registerUser } from '../lib/data'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [usuarioValido, setUsuarioValido] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('site') || '')
  const navigate = useNavigate()

  const loginPost = async data => {
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
    setUser(user_id)
    setToken(token)
    localStorage.setItem('site', token)
    // localStorage.setItem('site', rol)
    navigate('/Inicio')
  }
  const registerPost = async data => {
    try {
      const registerData = await registerUser(data)
      if (registerData) {
        loginAction(registerData)
      }
    } catch (error) {
      console.error('Error al registrar:', error)
    }
  }
  const logOut = () => {
    setUser(null)
    // setToken('')
    localStorage.removeItem('site')
    sessionStorage.removeItem('user-storage')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ token, user, loginPost, registerPost, logOut }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
