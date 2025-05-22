const apiUrl = import.meta.env.VITE_API_URL

export async function getUser(data) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
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
    console.log('Respuesta:', responseData)
    return responseData
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    alert('Oops! Credenciales inválidas')
    return null
  }
}
