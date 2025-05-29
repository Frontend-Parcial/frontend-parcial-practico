const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

/**
 * Crea una nueva solicitud de intercambio
 * @param {Object} data - Datos de la solicitud
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export async function crearSolicitud(data) {
  try {
    console.log('Token enviado:', userToken)
    console.log('Datos enviados:', data)

    // Preparar los datos para enviar
    const datosAEnviar = {
      id_solicitante: data.id_solicitante,
      id_convenio: data.id_convenio,
      periodo_academico: data.periodo_academico,
      modalidad: data.modalidad,
      tipo_intercambio: data.tipo_intercambio,
      duracion: Number(data.duracion),
      asignaturas: data.asignaturas.map(asig => ({
        codigo_asignatura_origen: asig.codigo_asignatura_origen,
        nombre_asignatura_origen: asig.nombre_asignatura_origen,
        creditos_asignatura_origen: Number(asig.creditos_asignatura_origen),
        codigo_asignatura_destino: asig.codigo_asignatura_destino,
        nombre_asignatura_destino: asig.nombre_asignatura_destino,
        creditos_asignatura_destino: Number(asig.creditos_asignatura_destino),
      })),
    }
    console.log(JSON.stringify(datosAEnviar))
    const response = await fetch(`${apiUrl}/solicitudes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(datosAEnviar),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al crear la solicitud')
    }

    const responseData = await response.json()
    console.log(responseData)
    return responseData
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error(error.message || 'Error al crear la solicitud')
  }
}

/**
 * Obtiene una solicitud por su ID
 * @param {string} id - ID de la solicitud
 * @returns {Promise<Object>} - Datos de la solicitud
 */
export async function getSolicitud(id) {
  try {
    console.log('Token enviado:', userToken)
    const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener la solicitud')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error(error.message)
  }
}

/**
 * Actualiza una solicitud existente
 * @param {Object} data - Datos actualizados de la solicitud
 * @param {string} id - ID de la solicitud a actualizar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export async function updateSolicitud(data, id) {
  try {
    console.log('Token enviado:', userToken)
    console.log('Datos enviados:', data)

    const datosAEnviar = {
      ...data,
      duracion: Number(data.duracion),
      asignaturas: data.asignaturas.map(asig => ({
        ...asig,
        creditos_asignatura_origen: Number(asig.creditos_asignatura_origen),
        creditos_asignatura_destino: Number(asig.creditos_asignatura_destino),
      })),
    }

    const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(datosAEnviar),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar la solicitud')
    }

    const responseData = await response.json()
    console.log(responseData)
    return responseData
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error(error.message || 'Error al actualizar la solicitud')
  }
}

/**
 * Obtiene todas las solicitudes
 * @returns {Promise<Array>} - Lista de solicitudes
 */
export async function listSolicitudes() {
  try {
    console.log('Token enviado:', userToken)
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
    console.log(data.solicitudes)
    return Array.isArray(data.solicitudes) ? data.solicitudes : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return []
  }
}

/**
 * Cambia el estado de una solicitud
 * @param {string} id - ID de la solicitud
 * @param {string} estado - Nuevo estado (ej. "aprobado", "rechazado", "pendiente")
 * @returns {Promise<Object>} - Respuesta del servidor
 */

/**
 * Obtiene una solicitud por su ID (alias de getSolicitud)
 * @param {string} id - ID de la solicitud
 * @returns {Promise<Object>} - Datos de la solicitud
 */
export async function getSolicitudXid(id) {
  try {
    const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener la solicitud por ID')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error(error.message)
  }
}

export async function cambiarEstadoSolicitud(id, estado) {
  try {
    console.log('Token enviado:', userToken)
    const response = await fetch(`${apiUrl}/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ estado }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al cambiar el estado de la solicitud')
    }

    const responseData = await response.json()
    console.log(responseData)
    return responseData
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error(error.message || 'Error al cambiar el estado de la solicitud')
  }
}
