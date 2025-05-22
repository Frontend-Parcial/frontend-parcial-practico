const apiURL = import.meta.env.VITE_API_URL

export async function getTipoConvenio() {
    const userToken = localStorage.getItem('site')
    console.log(userToken)
    try {
        console.log('Token enviado:', userToken)
        console.log('Datos enviados:')
        const response = await fetch(`${apiUrl}/api/reportes/estadisticas/tipo`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
        },
        })
        if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener los tipo de convenio')
        }
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.error('Error al hacer la solicitud:', error)
        throw new Error('adfasdfasdfasdfasdf')
    }    
}