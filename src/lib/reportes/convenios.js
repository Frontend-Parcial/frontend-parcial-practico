const apiURL = import.meta.env.VITE_API_URL;
const userToken = localStorage.getItem('site');

export async function getConvenios() {
  
  if (!userToken) {
    throw new Error('Token de autenticación no encontrado. Por favor, inicie sesión.');
  }

  try {
    console.log('Token enviado:', userToken);
    console.log('Solicitando datos de convenio...');
    const response = await fetch(`${apiURL}/convenios/activos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Manejo específico de errores de autenticación
      if (response.status === 401) {
        throw new Error('Token de autenticación expirado. Por favor, inicie sesión nuevamente.');
      }
      
      if (response.status === 403) {
        throw new Error('No tiene permisos para acceder a esta información.');
      }
      
      throw new Error(
        errorData.message || 
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const apiData = await response.json();
    console.log('Datos recibidos de la API:', apiData);
    
    // Retornar los datos directamente sin transformar
    return apiData;
    
  } catch (error) {
    console.error('Error al obtener datos de convenios:', error);
    
    // Re-lanzar el error con un mensaje más descriptivo
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifique su conexión a internet.');
    }
    
    throw new Error(
      error.message || 'Error desconocido al obtener datos de convenios'
    );
  }
}