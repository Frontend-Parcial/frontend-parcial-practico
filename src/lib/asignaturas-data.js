// lib/asignaturas-data.js

const apiUrl = import.meta.env.VITE_API_URL

// Función para obtener todas las asignaturas
export const obtenerAsignaturas = async id => {
  const userToken = localStorage.getItem('site')
  try {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`
    }

    const response = await fetch(`${apiUrl}/asignaturas/solicitud/${id}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    if (response.status === 404) {
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener asignaturas:', error)
    throw error
  }
}

// Obtener una asignatura por ID
export const obtenerAsignaturaPorId = async (id, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/asignaturas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener asignatura:', error)
    throw error
  }
}

export async function listAsignaturas({ _id, id_solicitud }) {
  const token = localStorage.getItem('userToken')

  const response = await fetch(`${apiUrl}/asignaturas?_id=${_id}&id_solicitud=${id_solicitud}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al cargar asignaturas')

  return data.asignaturas || []
}
