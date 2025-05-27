const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function getMovilidadDocente() {
  try {
    console.log('Token enviado:', userToken)
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

    console.log(data.data.docentes)
    // Asegúrate de que devuelve un array
    return Array.isArray(data?.data?.docentes) ? data.data.docentes : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return []
  }
}
