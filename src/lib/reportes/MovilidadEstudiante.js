const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function getMovilidadEstudiante() {
  try {
    const response = await fetch(`${apiUrl}/estudiantes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) // Maneja JSON inválido
      throw new Error(errorData.message || 'Error al obtener los estudiantes')
    }

    const data = await response.json()
    return Array.isArray(data.estudiantes) ? data.estudiantes : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return [] // <- Muy importante: siempre retorna un array vacío en caso de error
  }
}
