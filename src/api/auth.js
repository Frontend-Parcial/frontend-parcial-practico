import axiosClient from './axiosclient'

export const register = (email, password, name, role) => {
  const registerData = {
    email: email,
    password: password,
    nombre: name,
    rol: role,
  }

  return axiosClient.post('/auth/register', registerData)
}

export const login = (email, password) => {
  const loggingData = {
    email: email,
    password: password,
  }

  const response = axiosClient.post('auth/login', loggingData)
  localStorage.setItem('token', response['token'])
  return response['message']
}

export const verifyToken = () => axiosClient.get('/auth/verifyToken')
