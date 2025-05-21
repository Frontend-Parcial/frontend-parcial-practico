import { useState, useEffect, useRef } from 'react';

const ConveniosPais = ({ isExpanded }) => {
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const convenios = [
    { pais: 'España', lat: 40.4637, lng: -3.7492, count: 6 },
    { pais: 'México', lat: 19.4326, lng: -99.1332, count: 6 },
    { pais: 'Colombia', lat: 4.7110, lng: -74.0721, count: 4 },
    { pais: 'Ecuador', lat: -0.1807, lng: -78.4678, count: 6 },
    { pais: 'Chile', lat: -33.4489, lng: -70.6693, count: 7 },
    { pais: 'Argentina', lat: -34.6037, lng: -58.3816, count: 12 }
  ];

  useEffect(() => {
    // Esta es una simulación - en un proyecto real se usaría la API de mapas
    setLoaded(true);
  }, []);

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold mb-2">Convenios por país</h3>
      <div 
        ref={mapRef} 
        className="relative w-full h-32 bg-blue-100 rounded"
        style={{ height: isExpanded ? '400px' : '150px' }}
      >
        {/* Simulación del mapa con puntos - en un proyecto real se usaría la API de Bing Maps/Google Maps */}
        <div className="absolute inset-0 bg-blue-50 rounded">
          <img 
            src="/api/placeholder/400/300" 
            alt="Mapa mundial con marcadores para convenios" 
            className="w-full h-full object-cover rounded"
          />
          
          {convenios.map((convenio, index) => (
            <div 
              key={index} 
              className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                top: `${30 + Math.random() * 60}%`, 
                left: `${20 + Math.random() * 60}%` 
              }}
              title={`${convenio.pais}: ${convenio.count} convenios`}
            ></div>
          ))}
        </div>
        
        {isExpanded && (
          <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow">
            <h4 className="font-semibold text-sm">Países con convenios</h4>
            <ul className="text-xs">
              {convenios.map((convenio, index) => (
                <li key={index}>{convenio.pais}: {convenio.count} convenios</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConveniosPais;