const apiURL = import.meta.env.VITE_API_URL;

/**
 * Transforma los datos de la API al formato requerido para el gráfico de pastel
 * @param {Object} apiData - Datos de la API
 * @returns {Array} Datos transformados para el gráfico
 */
const transformToChartData = (apiData) => {
  if (!apiData || typeof apiData !== 'object') {
    console.warn('Datos de API inválidos:', apiData);
    return [];
  }

  const { nacionales = 0, internacionales = 0, total = 0 } = apiData;

  // Si no hay datos, retornar array vacío
  if (total === 0) {
    return [];
  }

  const data = [
    {
      name: 'Nacionales',
      value: nacionales,
      percentage: total > 0 ? ((nacionales / total) * 100).toFixed(1) : '0.0',
      color: '#3b82f6' // azul
    },
    {
      name: 'Internacionales',
      value: internacionales,
      percentage: total > 0 ? ((internacionales / total) * 100).toFixed(1) : '0.0',
      color: '#10b981' // verde
    }
  ];

  // Filtrar elementos con valor 0 para el gráfico (opcional)
  return data.filter(item => item.value > 0);
};

/**
 * Obtiene los datos de tipos de convenio desde la API
 * @param {number|string} año - Año para filtrar (opcional)
 * @returns {Promise<Array>} Datos transformados para el gráfico
 */
export async function getTipoConvenio(año = null) {
  // ✅ CORRECCIÓN: Obtener el token DENTRO de la función
  const userToken = localStorage.getItem('site');
  
  if (!userToken) {
    throw new Error('Token de autenticación no encontrado. Por favor, inicie sesión.');
  }

  try {
    console.log('Token enviado:', userToken);
    console.log('Solicitando datos de tipo de convenio...');
    
    // Construir URL con parámetro de año si se proporciona
    const url = año 
      ? `${apiURL}/reportes/estadisticas/tipo?año=${año}`
      : `${apiURL}/reportes/estadisticas/tipo`;

    const response = await fetch(url, {
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
    
    const transformedData = transformToChartData(apiData);
    console.log('Datos transformados para el gráfico:', transformedData);
    
    return transformedData;
    
  } catch (error) {
    console.error('Error al obtener datos de tipo de convenio:', error);
    
    // Re-lanzar el error con un mensaje más descriptivo
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifique su conexión a internet.');
    }
    
    throw new Error(
      error.message || 'Error desconocido al obtener datos de tipo de convenio'
    );
  }
}