const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function listAsignaturas() {
  try {
    const response = await fetch(`${apiUrl}/asignaturas/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al obtener las asignaturas')
    }

    const data = await response.json()

    // Asegúrate de que devuelve un array
    return Array.isArray(data?.asignaturas) ? data.asignaturas : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return [] // retorna un array vacío si hay error
  }
}
