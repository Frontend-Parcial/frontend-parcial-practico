const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function crearSeguimiento(data) {
  try {
    const response = await fetch(`${apiUrl}/seguimiento/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Seguimiento registrado:', result)
      alert('✅ Seguimiento creado con éxito')
    } else {
      console.error('Error al crear seguimiento:', result)
      alert(result.message || '❌ Error al crear el seguimiento')
    }

    return result
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('❌ Error de red o servidor al crear el seguimiento')
    throw error
  }
}

export async function getSolicitudXid(id) {
  try {
    const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener la solicitud')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return null
  }
}
