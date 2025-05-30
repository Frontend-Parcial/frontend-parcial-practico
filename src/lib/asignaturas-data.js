// lib/asignaturas-data.js

const apiUrl = import.meta.env.VITE_API_URL

// Función para obtener todas las asignaturas
export const obtenerAsignaturas = async id => {
  const userToken = localStorage.getItem('site')
  try {
    const headers = {
      'Content-Type': 'application/json',
    }

    // Solo agregar Authorization si hay token
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`
    }
    console.log(`${apiUrl}/asignaturas/solicitud/${id}`)
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

// Función para obtener una asignatura específica por ID
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

// Función para obtener una solicitud por ID (AGREGADA)
export const obtenerSolicitudPorId = async id => {
  const userToken = localStorage.getItem('userToken') || localStorage.getItem('site')

  try {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`
    }

    const response = await fetch(`${apiUrl}/solicitudes/${id}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado')
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener solicitud:', error)
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

export const crearAsignatura = async datosAsignatura => {
  let token // Declarar token en el scope principal

  try {
    token = localStorage.getItem('userToken') || localStorage.getItem('site')

    if (!token) {
      throw new Error('No se encontró token de autenticación')
    }

    // Validar campos requeridos
    const camposRequeridos = [
      'id_solicitud',
      'codigo_asignatura_origen',
      'nombre_asignatura_origen',
      'creditos_asignatura_origen',
      'codigo_asignatura_destino',
      'nombre_asignatura_destino',
      'creditos_asignatura_destino',
    ]

    for (const campo of camposRequeridos) {
      if (!datosAsignatura[campo]) {
        throw new Error(`El campo ${campo} es requerido`)
      }
    }

    // Validaciones adicionales
    if (isNaN(datosAsignatura.creditos_asignatura_origen) || datosAsignatura.creditos_asignatura_origen < 1) {
      throw new Error('Los créditos de la asignatura origen deben ser un número mayor a 0')
    }

    if (isNaN(datosAsignatura.creditos_asignatura_destino) || datosAsignatura.creditos_asignatura_destino < 1) {
      throw new Error('Los créditos de la asignatura destino deben ser un número mayor a 0')
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    // Solo agregar Authorization si hay token

    // Preparar datos para enviar
    const datosParaEnviar = {
      id_solicitud: datosAsignatura.id_solicitud,
      codigo_asignatura_origen: datosAsignatura.codigo_asignatura_origen.trim(),
      nombre_asignatura_origen: datosAsignatura.nombre_asignatura_origen.trim(),
      creditos_asignatura_origen: String(datosAsignatura.creditos_asignatura_origen),
      codigo_asignatura_destino: datosAsignatura.codigo_asignatura_destino.trim(),
      nombre_asignatura_destino: datosAsignatura.nombre_asignatura_destino.trim(),
      creditos_asignatura_destino: String(datosAsignatura.creditos_asignatura_destino),
      descripcion_asignatura_origen: datosAsignatura.descripcion_asignatura_origen?.trim() || '',
      descripcion_asignatura_destino: datosAsignatura.descripcion_asignatura_destino?.trim() || '',
      estado_equivalencia: datosAsignatura.estado_equivalencia || 'pendiente',
      observaciones: datosAsignatura.observaciones?.trim() || '',
      universidad_origen: datosAsignatura.universidad_origen?.trim() || '',
      universidad_destino: datosAsignatura.universidad_destino?.trim() || '',
    }

    console.log('Creando asignatura con datos:', datosParaEnviar)

    // PASO 1: Intentar despertar el servidor (opcional)

    // PASO 2: Crear la asignatura
    const response = await fetch(`${apiUrl}/asignaturas/`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosParaEnviar),
    })

    // Manejar respuesta
    if (!response.ok) {
      let errorMessage = 'Error desconocido'

      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || `Error del servidor: ${response.status}`
      } catch (parseError) {
        console.error('Error parsing error response:', parseError)
        errorMessage = `Error del servidor: ${response.status} ${response.statusText}`
      }

      // Errores específicos por código de estado
      switch (response.status) {
        case 400:
          throw new Error(`Datos inválidos: ${errorMessage}`)
        case 401:
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.')
        case 403:
          throw new Error('No tiene permisos para realizar esta acción.')
        case 404:
          throw new Error('La solicitud especificada no fue encontrada.')
        case 409:
          throw new Error('Ya existe una asignatura con el mismo código.')
        case 422:
          throw new Error(`Error de validación: ${errorMessage}`)
        case 500:
          throw new Error('Error interno del servidor. Intente nuevamente.')
        default:
          throw new Error(errorMessage)
      }
    }

    const data = await response.json()
    console.log('Asignatura creada exitosamente:', data)

    return {
      success: true,
      data: data,
      message: 'Asignatura creada exitosamente',
    }
  } catch (error) {
    console.error('Error al crear asignatura:', error)

    // Si es un error de red, intentar con configuración alternativa
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('Error de red detectado, intentando configuración alternativa...')

      try {
        // Intentar diferentes configuraciones de URL
        const urlsAlternativas = [
          apiUrl.replace('/api', '/api'), // URL original
          apiUrl.replace('https://', 'http://'), // HTTP en lugar de HTTPS
          apiUrl.replace('-server', ''), // Sin "-server" en el dominio
          `${apiUrl.split('/api')[0]}/asignaturas`, // Base URL + endpoint directo
        ]

        for (const urlAlternativa of urlsAlternativas) {
          try {
            console.log(`Intentando con URL alternativa: ${urlAlternativa}`)

            const response = await fetch(`${urlAlternativa}/asignaturas`, {
              method: 'POST',
              mode: 'cors',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify(datosParaEnviar),
            })

            if (response.ok) {
              const data = await response.json()
              console.log('Asignatura creada exitosamente (reintento):', data)
              return {
                success: true,
                data: data,
                message: 'Asignatura creada exitosamente',
              }
            }
          } catch (retryError) {
            console.log(`Error con URL ${urlAlternativa}:`, retryError.message)
            continue
          }
        }
      } catch (retryError) {
        console.error('Error en todos los reintentos:', retryError)
      }
    }

    // Verificar si es un error específico de CORS
    if (error.message.includes('CORS') || error.message.includes('preflight')) {
      throw new Error(
        'Error de conexión con el servidor. El servidor puede estar inactivo o tener problemas de configuración CORS. Por favor, contacte al administrador.',
      )
    }

    // Verificar si es un error de red
    if (error.message.includes('Failed to fetch') || error.message.includes('net::ERR_FAILED')) {
      throw new Error('No se pudo conectar con el servidor. Verifique su conexión a internet o intente más tarde.')
    }

    // Re-lanzar el error original
    throw error
  }
}
