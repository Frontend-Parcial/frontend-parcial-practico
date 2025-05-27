const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function listSolicitudes() {
  try {
    const response = await fetch(`${apiUrl}/solicitudes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al obtener las solicitudes')
    }

    const data = await response.json()
    return Array.isArray(data?.data?.solicitudes) ? data.data.solicitudes : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return []
  }
}

export async function crearSolicitud(data) {
  try {
    const response = await fetch(`${apiUrl}/solicitudes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Solicitud registrada:', result)
      alert('✅ Solicitud creada con éxito')
    } else {
      console.error('Error al crear solicitud:', result)
      alert(result.message || '❌ Error al crear la solicitud')
    }

    return result
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('❌ Error de red o servidor al crear la solicitud')
    throw error
  }
}

export async function updateSolicitud(data, id) {
  try {
    // Aquí puedes adaptar según los campos editables de la solicitud
    const payload = {
      periodo_academico: data.periodo_academico,
      modalidad: data.modalidad,
      tipo_intercambio: data.tipo_intercambio,
      duracion: Number(data.duracion),
    }

    const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar la solicitud')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al actualizar solicitud:', error)
    throw new Error(error.message || 'Error al actualizar solicitud')
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
  }
}
