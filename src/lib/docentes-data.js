const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function listDocentes() {
  try {
    const response = await fetch(`${apiUrl}/docentes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) // por si la respuesta no es JSON válida
      throw new Error(errorData.message || 'Error al obtener los docentes')
    }

    const data = await response.json()

    // Asegúrate de que devuelve un array
    return Array.isArray(data?.data?.docentes) ? data.data.docentes : []
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
    return [] // retorna un array vacío si hay error
  }
}

export async function createDocentes(data) {
  try {
    const response = await fetch(`${apiUrl}/docentes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      alert('Docente creado con éxito')
    } else {
      console.error('Error al crear docente:', result)
      alert(result.message || 'Error al crear el docente')
    }

    return result
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('❌ Error de red o servidor al crear el docente')
    throw error
  }
}

export async function updateDocentes(data, id) {
  try {
    // Preparar datos excluyendo cualquier campo de ID
    const payload = {
      telefono: data.telefono,
      email: data.email,
      departamento: data.departamento,
      categoria_docente: data.categoria_docente,
      evaluacion_docente_promedio:
        data.evaluacion_docente_promedio !== undefined ? Number(data.evaluacion_docente_promedio) : undefined,
      publicaciones: data.publicaciones !== undefined ? parseInt(data.publicaciones, 10) : undefined,
      proyectos_investigacion:
        data.proyectos_investigacion !== undefined ? parseInt(data.proyectos_investigacion, 10) : undefined,
      estado: data.estado,
    }

    // Eliminar campos undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])

    const response = await fetch(`${apiUrl}/docentes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar docente')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en updateTeacher:', error)
    throw new Error(error.message || 'Error al actualizar docente')
  }
}

export async function getDocentesXid(id) {
  try {
    const response = await fetch(`${apiUrl}/docentes/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener los estudiantes')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
  }
}
