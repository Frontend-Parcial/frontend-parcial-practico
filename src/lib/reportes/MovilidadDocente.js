const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function getMovilidadDocente() {
  const userToken = localStorage.getItem('site')
  try {
    const response = await fetch(`${apiUrl}/docentes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al obtener los docentes')
    }

    const data = await response.json()
    return Array.isArray(data?.data?.docentes) ? data.data.docentes : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return []
  }
}
