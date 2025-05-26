const apiUrl = import.meta.env.VITE_API_URL

export async function getStudents(id) {
  const userToken = localStorage.getItem('site')
  console.log(userToken)
  try {
    console.log('Token enviado:', userToken)
    console.log('Datos enviados:')
    const response = await fetch(`${apiUrl}/api/estudiantes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${userToken}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener los estudiantes')
    }
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error('adfasdfasdfasdfasdf')
  }
}

export async function updateStudent(data, id) {
  const userToken = localStorage.getItem('site')

  try {
    console.log('Token enviado:', userToken)
    console.log('Datos enviados:', data)
    const datosAEnviar = { ...data }

    if (datosAEnviar.semestre !== undefined) {
      datosAEnviar.semestre = Number(datosAEnviar.semestre)
    }

    if (datosAEnviar.creditos_cursados !== undefined) {
      datosAEnviar.creditos_cursados = Number(datosAEnviar.creditos_cursados)
    }

    if (datosAEnviar.promedio_academico !== undefined) {
      datosAEnviar.promedio_academico = Number(datosAEnviar.promedio_academico)
    }

    if (datosAEnviar.estado !== undefined) {
      // logica
    }

    if (datosAEnviar.sanciones_academicas !== undefined) {
      if (typeof datosAEnviar.sanciones_academicas === 'string') {
        datosAEnviar.sanciones_academicas =
          datosAEnviar.sanciones_academicas.toLowerCase() === 'true' || datosAEnviar.sanciones_academicas === '1'
      }
    }

    if (datosAEnviar.sanciones_disciplinarias !== undefined) {
      if (typeof datosAEnviar.sanciones_disciplinarias === 'string') {
        datosAEnviar.sanciones_disciplinarias =
          datosAEnviar.sanciones_disciplinarias.toLowerCase() === 'true' ||
          datosAEnviar.sanciones_disciplinarias === '1'
      }
    }

    const response = await fetch(`${apiUrl}/api/estudiantes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(datosAEnviar),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar el estudiante')
    }

    const responseData = await response.json()
    console.log(responseData)
    return responseData
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error(error.message || 'Error al actualizar el estudiante')
  }
}

export async function listStudents() {
  const userToken = localStorage.getItem('site')
  try {
    console.log('Token enviado:', userToken)
    const response = await fetch(`${apiUrl}/api/estudiantes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener los estudiantes')
    }

    const data = await response.json()

    console.log(data.estudiantes)
    return data.estudiantes
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
  }
}

//! Verificar Estudiante
export async function verifyStudent() {}

export async function createStudent(data) {
  const userToken = localStorage.getItem('site')
  console.log(userToken)
  const datos = {
    nombre_completo: data.nombre_completo,
    documento_identidad: data.documento_identidad,
    tipo_documento: data.tipo_documento,
    fecha_nacimiento: data.fecha_nacimiento,
    email: data.email,
    telefono: data.telefono,
    direccion: data.direccion,
    programa_academico: data.programa_academico,
    facultad: data.facultad,
    semestre: Number(data.semestre),
    creditos_cursados: Number(data.creditos_cursados),
    promedio_academico: Number(data.promedio_academico),
    // estado: data.estado,
    // sanciones_academicas: data.sanciones_academicas,
    // sanciones_disciplinarias: data.sanciones_disciplinarias,
    estado: 'activo',
    sanciones_academicas: false,
    sanciones_disciplinarias: false,
  }
  try {
    console.log('Token enviado:', userToken)
    console.log('Datos enviados:', datos)
    const response = await fetch(`${apiUrl}/api/estudiantes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(datos),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener los estudiantes')
    }

    const data = await response.json()

    console.log(data)
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    throw new Error('adfasdfasdfasdfasdf')
  }
}
