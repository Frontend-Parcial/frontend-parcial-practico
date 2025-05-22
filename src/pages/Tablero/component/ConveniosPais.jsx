import { useState, useEffect, useRef } from 'react';

const ConveniosPais = ({ isExpanded }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);

  const convenios = [
    { pais: 'España', lat: 40.4637, lng: -3.7492, count: 6 },
    { pais: 'México', lat: 19.4326, lng: -99.1332, count: 6 },
    { pais: 'Colombia', lat: 4.7110, lng: -74.0721, count: 4 },
    { pais: 'Ecuador', lat: -0.1807, lng: -78.4678, count: 6 },
    { pais: 'Chile', lat: -33.4489, lng: -70.6693, count: 7 },
    { pais: 'Argentina', lat: -34.6037, lng: -58.3816, count: 12 }
  ];

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        try {
         
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
          }

          if (!document.querySelector('script[src*="leaflet.js"]')) {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load Leaflet'));
              document.head.appendChild(script);
            });
          }
        } catch (error) {
          console.error('Error loading Leaflet:', error);
        }
      }
    };

    loadLeaflet().then(() => {
      setIsMapReady(true);
    }).catch(error => {
      console.error('Failed to load Leaflet:', error);
    });
  }, []);

  useEffect(() => {
    if (!isMapReady || !window.L || !mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
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
        attributionControl: false
      }).setView([20, 0], isExpanded ? 2 : 1);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      convenios.forEach((convenio) => {
        const marker = window.L.marker([convenio.lat, convenio.lng])
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; padding: 8px; min-width: 120px;">
              <strong style="color: #333; font-size: 14px;">${convenio.pais}</strong><br>
              <span style="color: #666; font-size: 12px;">${convenio.count} convenios</span>
            </div>
          `);
        
        markersRef.current.push(marker);
      });

      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [isMapReady, isExpanded]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Convenios por país</h3>
      <div 
        className="relative w-full rounded overflow-hidden border bg-gray-100"
        style={{ height: isExpanded ? '400px' : '150px' }}
      >
        {!isMapReady ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-claro border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: '100%' }}
          />
        )}
        
        {isExpanded && isMapReady && (
          <div 
            className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs"
            style={{ zIndex: 1000 }}
          >
            <h4 className="font-semibold text-sm mb-2 text-gray-800">Países con convenios</h4>
            <ul className="text-xs space-y-1">
              {convenios.map((convenio, index) => (
                <li key={index} className="flex justify-between items-center py-1">
                  <span className="text-gray-700">{convenio.pais}:</span>
                  <span className="font-medium text-texto-oscuro bg-oscuro px-2 py-0.5 rounded">
                    {convenio.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConveniosPais;