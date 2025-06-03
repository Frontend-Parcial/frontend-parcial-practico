const apiUrl = import.meta.env.VITE_API_URL

export async function getUser(data) {
  try {
    const response = await fetch(`${apiUrl}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Credenciales inválidas')
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    alert('Oops! Credenciales inválidas')
    return null
  }
}
export async function registerUser(data) {
  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error en registro:', errorData)
      alert(errorData.message || 'Error al registrar usuario')
      return null
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    alert('Oops! Algo salió mal al registrarte')
    return null
  }
}
