const apiUrl = import.meta.env.VITE_API_URL
const userToken = localStorage.getItem('site')

export async function listDocentes() {
  console.log(userToken)
  try {
    console.log('Token enviado:', userToken)
    const response = await fetch(`${apiUrl}/api/docentes/`, {
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

    console.log(data.data.docentes)
    return data.data.docentes
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
  }
}

export async function createDocentes(data) {
  try {
    const response = await fetch(`${apiUrl}/api/docentes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Docente registrado:', result)
      alert('✅ Docente creado con éxito')
    } else {
      console.error('Error al crear docente:', result)
      alert(result.message || '❌ Error al crear el docente')
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

    const response = await fetch(`${apiUrl}/api/docentes/${id}`, {
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
  //   try {
  //     console.log('Datos enviados:', data)

  //     // Solo permitimos los campos especificados
  //     const camposPermitidos = [
  //       'telefono',
  //       'email',
  //       'departamento',
  //       'categoria_docente',
  //       'evaluacion_docente_promedio',
  //       'publicaciones',
  //       'proyectos_investigacion',
  //       'estado',
  //     ]

  //     // Filtramos solo los campos permitidos
  //     const datosAEnviar = {}
  //     for (const key in data) {
  //       if (camposPermitidos.includes(key)) {
  //         datosAEnviar[key] = data[key]
  //       }
  //     }

  //     // Convertir campos numéricos
  //     if (datosAEnviar.evaluacion_docente_promedio !== undefined) {
  //       datosAEnviar.evaluacion_docente_promedio = Number(datosAEnviar.evaluacion_docente_promedio)
  //     }

  //     if (datosAEnviar.publicaciones !== undefined) {
  //       datosAEnviar.publicaciones = Number(datosAEnviar.publicaciones)
  //     }

  //     if (datosAEnviar.proyectos_investigacion !== undefined) {
  //       datosAEnviar.proyectos_investigacion = Number(datosAEnviar.proyectos_investigacion)
  //     }

  //     const response = await fetch(`${apiUrl}/api/docentes/${id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //       body: JSON.stringify(datosAEnviar),
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json()
  //       throw new Error(errorData.message || 'Error al actualizar el docente')
  //     }

  //     const responseData = await response.json()
  //     console.log(responseData)
  //     return responseData
  //   } catch (error) {
  //     console.error('Error al hacer la solicitud:', error)
  //     throw new Error(error.message || 'Error al actualizar el docente')
  //   }
}

export async function getDocentesXid(id) {
  try {
    const response = await fetch(
      `${apiUrl}/api/docentes/${id}?facultad=Ingeniería&categoria_docente=Asociado&tipo_vinculacion=Planta&nombre_completo=Juan`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      },
    )
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al obtener los estudiantes')
    }
    const data = await response.json()
    console.log(data.data)
    return data.data
  } catch (error) {
    console.error('Error al hacer la solicitud:', error)
  }
}
