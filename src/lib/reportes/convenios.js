const apiURL = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function getConvenios() {
  if (!userToken) {
    throw new Error('Token de autenticación no encontrado. Por favor, inicie sesión.')
  }

  try {
    const response = await fetch(`${apiURL}/convenios/activos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Manejo específico de errores de autenticación
      if (response.status === 401) {
        throw new Error('Token de autenticación expirado. Por favor, inicie sesión nuevamente.')
      }

      if (response.status === 403) {
        throw new Error('No tiene permisos para acceder a esta información.')
      }

      throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const apiData = await response.json()
    // Retornar los datos directamente sin transformar
    return apiData
  } catch (error) {
    console.error('Error al obtener datos de convenios:', error)

    // Re-lanzar el error con un mensaje más descriptivo
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifique su conexión a internet.')
    }

    throw new Error(error.message || 'Error desconocido al obtener datos de convenios')
  }
}

export async function listConvenio() {
  if (!userToken) {
    throw new Error('Token de autenticación no encontrado. Por favor, inicie sesión.')
  }

  try {
    const response = await fetch(`${apiURL}/convenios/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Manejo específico de errores de autenticación
      if (response.status === 401) {
        throw new Error('Token de autenticación expirado. Por favor, inicie sesión nuevamente.')
      }

      if (response.status === 403) {
        throw new Error('No tiene permisos para acceder a esta información.')
      }

      if (response.status === 404) {
        throw new Error('Endpoint de convenios no encontrado. Verifique la URL de la API.')
      }

      throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const apiData = await response.json()
    // Verificar que tenemos convenios
    if (!apiData.convenios || !Array.isArray(apiData.convenios)) {
      console.warn('No se encontraron convenios en la respuesta:', apiData)
      return {
        convenios: [],
        conveniosPorPais: [],
        totalConvenios: 0,
      }
    }

    // Organizar convenios por país y contar
    const conveniosPorPais = organizarConveniosPorPais(apiData.convenios)

    return {
      ...apiData,
      conveniosPorPais,
      totalConvenios: apiData.convenios.length,
    }
  } catch (error) {
    console.error('Error detallado al obtener datos de convenios:', error)

    // Re-lanzar el error con un mensaje más descriptivo
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifique su conexión a internet y que la URL de la API sea correcta.')
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'No se pudo conectar al servidor. Verifique que el servidor esté funcionando y la URL sea correcta.',
      )
    }

    throw new Error(error.message || 'Error desconocido al obtener datos de convenios')
  }
}

function organizarConveniosPorPais(convenios) {
  // Validar que convenios sea un array
  if (!Array.isArray(convenios)) {
    console.warn('convenios no es un array:', convenios)
    return []
  }

  const agrupados = convenios.reduce((acc, convenio) => {
    // Validar que el convenio tenga la propiedad pais_institucion
    if (!convenio.pais_institucion) {
      console.warn('Convenio sin país:', convenio)
      return acc
    }

    const pais = convenio.pais_institucion

    if (!acc[pais]) {
      acc[pais] = {
        pais: pais,
        cantidad: 0,
        convenios: [],
      }
    }

    acc[pais].cantidad += 1
    acc[pais].convenios.push(convenio)

    return acc
  }, {})

  // Convertir a array y ordenar por cantidad (descendente)
  return Object.values(agrupados).sort((a, b) => b.cantidad - a.cantidad)
}
