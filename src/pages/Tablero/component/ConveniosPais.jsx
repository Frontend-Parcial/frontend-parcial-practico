import { useState, useEffect, useRef } from 'react'
import { getConvenios } from '../../../lib/reportes/convenios' // Ajusta la ruta según tu estructura

const ConveniosPais = ({ isExpanded, onToggleExpand }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const containerRef = useRef(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [convenios, setConvenios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Coordenadas de países (puedes expandir esta lista según necesites)
  const coordenadasPaises = {
    España: { lat: 40.4637, lng: -3.7492 },
    México: { lat: 19.4326, lng: -99.1332 },
    Colombia: { lat: 4.711, lng: -74.0721 },
    Ecuador: { lat: -0.1807, lng: -78.4678 },
    Chile: { lat: -33.4489, lng: -70.6693 },
    Argentina: { lat: -34.6037, lng: -58.3816 },
    Brasil: { lat: -15.7942, lng: -47.8822 },
    Perú: { lat: -12.0464, lng: -77.0428 },
    Uruguay: { lat: -34.9011, lng: -56.1645 },
    Venezuela: { lat: 10.4806, lng: -66.9036 },
    Francia: { lat: 48.8566, lng: 2.3522 },
    Italia: { lat: 41.9028, lng: 12.4964 },
    Alemania: { lat: 52.52, lng: 13.405 },
    'Reino Unido': { lat: 51.5074, lng: -0.1278 },
    'Estados Unidos': { lat: 39.8283, lng: -98.5795 },
    Canadá: { lat: 56.1304, lng: -106.3468 },
    Australia: { lat: -25.2744, lng: 133.7751 },
    Japón: { lat: 36.2048, lng: 138.2529 },
    China: { lat: 35.8617, lng: 104.1954 },
    'Corea del Sur': { lat: 35.9078, lng: 127.7669 },
  }

  // Función para contar convenios por país
  const procesarConveniosPorPais = data => {
    if (!data || !data.convenios) return []

    const contadorPaises = {}

    data.convenios.forEach(convenio => {
      const pais = convenio.pais_institucion
      if (pais) {
        contadorPaises[pais] = (contadorPaises[pais] || 0) + 1
      }
    })

    return Object.entries(contadorPaises)
      .map(([pais, count]) => {
        const coordenadas = coordenadasPaises[pais]
        return {
          pais,
          count,
          lat: coordenadas?.lat || 0,
          lng: coordenadas?.lng || 0,
          hasCoordinates: !!coordenadas,
        }
      })
      .filter(item => item.hasCoordinates) // Solo mostrar países con coordenadas conocidas
  }

  // Cargar datos de convenios
  useEffect(() => {
    const cargarConvenios = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getConvenios()
        const conveniosProcesados = procesarConveniosPorPais(data)
        setConvenios(conveniosProcesados)
      } catch (error) {
        console.error('Error al cargar convenios:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    cargarConvenios()
  }, [])

  // Cargar Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        try {
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            document.head.appendChild(link)
          }

          if (!document.querySelector('script[src*="leaflet.js"]')) {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script')
              script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
              script.onload = () => resolve()
              script.onerror = () => reject(new Error('Failed to load Leaflet'))
              document.head.appendChild(script)
            })
          }
        } catch (error) {
          console.error('Error loading Leaflet:', error)
        }
      }
    }

    loadLeaflet()
      .then(() => {
        setIsMapReady(true)
      })
      .catch(error => {
        console.error('Failed to load Leaflet:', error)
      })
  }, [])

  // Inicializar mapa
  useEffect(() => {
    if (!isMapReady || !window.L || !mapRef.current || loading) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }

    try {
      const map = window.L.map(mapRef.current, {
        zoomControl: isExpanded,
        scrollWheelZoom: isExpanded,
        dragging: isExpanded,
        touchZoom: isExpanded,
        doubleClickZoom: isExpanded,
        boxZoom: isExpanded,
        keyboard: isExpanded,
        attributionControl: false,
        // Limitar la repetición de continentes
        worldCopyJump: false,
        maxBounds: [
          [-90, -180],
          [90, 180],
        ],
        maxBoundsViscosity: 1.0,
      }).setView([20, 0], isExpanded ? 2 : 1)

      // Configurar límites de zoom para evitar repetición
      map.setMaxZoom(8)
      map.setMinZoom(1)

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        noWrap: true, // Evitar repetición horizontal del mapa
      }).addTo(map)

      // Agregar marcadores para cada país con convenios
      convenios.forEach(convenio => {
        const marker = window.L.marker([convenio.lat, convenio.lng]).addTo(map).bindPopup(`
            <div style="text-align: center; padding: 8px; min-width: 120px; font-family: Arial, sans-serif;">
              <strong style="color: #107b42; font-size: 14px; font-weight: 600;">${convenio.pais}</strong><br>
              <span style="color: #42a542; font-size: 12px; font-weight: 500; background-color: #8cce6b; padding: 2px 6px; border-radius: 4px; margin-top: 4px; display: inline-block;">
                ${convenio.count} convenio${convenio.count !== 1 ? 's' : ''}
              </span>
            </div>
          `)

        markersRef.current.push(marker)
      })

      mapInstanceRef.current = map

      // Manejar clicks dentro del mapa para cerrarlo cuando está expandido
      if (isExpanded) {
        map.on('click', e => {
          // Verificar si el click no fue en un marcador
          if (!e.originalEvent.target.closest('.leaflet-marker-icon')) {
            onToggleExpand(false)
          }
        })
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize()
        }
      }, 100)
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }, [isMapReady, isExpanded, convenios, loading, onToggleExpand])

  // Manejar clicks fuera del componente para minimizar
  useEffect(() => {
    const handleClickOutside = event => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(event.target)) {
        onToggleExpand(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isExpanded, onToggleExpand])

  // Manejar click en el mapa para expandir (solo si no está expandido)
  const handleMapClick = event => {
    if (!isExpanded) {
      event.stopPropagation()
      onToggleExpand(true)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  return (
    <div className='h-full' ref={containerRef}>
      <h3 className='text-sm font-semibold mb-2'>Convenios por país</h3>
      <div
        className={`relative w-full rounded overflow-hidden border bg-gray-100 transition-all duration-300 ${
          !isExpanded ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
        }`}
        style={{ height: isExpanded ? '400px' : '150px' }}
        onClick={!isExpanded ? handleMapClick : undefined}
      >
        {loading ? (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
              <p className='text-sm text-gray-600'>Cargando convenios...</p>
            </div>
          </div>
        ) : error ? (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-center p-4'>
              <p className='text-sm text-red-600 mb-2'>Error al cargar convenios:</p>
              <p className='text-xs text-gray-600'>{error}</p>
            </div>
          </div>
        ) : !isMapReady ? (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
              <p className='text-sm text-gray-600'>Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className='w-full h-full' style={{ minHeight: '100%' }} />
        )}

        {isExpanded && isMapReady && !loading && !error && convenios.length > 0 && (
          <div
            className='absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs cursor-pointer hover:bg-gray-50'
            style={{ zIndex: 1000 }}
            onClick={e => {
              e.stopPropagation()
              onToggleExpand(false) // Cerrar el mapa al hacer click en el panel
            }}
          >
            <h4 className='font-semibold text-sm mb-2 flex items-center justify-between' style={{ color: '#107b42' }}>
              Países con convenios ({convenios.length})
            </h4>
            <ul className='text-xs space-y-1 max-h-32 overflow-y-auto'>
              {convenios
                .sort((a, b) => b.count - a.count) // Ordenar por cantidad descendente
                .map((convenio, index) => (
                  <li key={index} className='flex justify-between items-center py-1'>
                    <span className='text-gray-700'>{convenio.pais}:</span>
                    <span
                      className='font-medium text-white px-2 py-0.5 rounded text-xs'
                      style={{ backgroundColor: '#42a542' }}
                    >
                      {convenio.count}
                    </span>
                  </li>
                ))}
            </ul>
            <div className='mt-2 pt-2 border-t text-xs' style={{ color: '#8cce6b' }}>
              Total: {convenios.reduce((sum, c) => sum + c.count, 0)} convenios
            </div>
          </div>
        )}

        {/* Indicador visual cuando no está expandido */}
        {!isExpanded && isMapReady && !loading && !error && (
          <div
            className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-200'
            style={{ zIndex: 500 }}
          >
            <div className='bg-white px-3 py-2 rounded-lg shadow-lg'>
              <p className='text-sm font-medium' style={{ color: '#107b42' }}>
                Click para expandir
              </p>
              <p className='text-xs' style={{ color: '#42a542' }}>
                {convenios.length} países con convenios
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConveniosPais
