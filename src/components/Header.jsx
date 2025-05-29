import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/ESCUDO_UPC_PQ.png'
import UPC from '../assets/LOGO-UPC.png'
import { useAuth } from '../providers/AuthProvider'

const theme = {
  colorGradiente: 'linear-gradient(to right, #2fb44b, #4dd269)',
  sombra: 'rgba(0,0,0,0.2)',
  fontInstitucional: 'sans-serif',
  grisClaro: '#f0f0f0',
  grisOscuro: '#d9d9d9',
  blanco: '#ffffff',
  colorOscuro: '#2fb44b',
  colorTextoOscuro: '#333333',
  colorClaro: '#cccccc',
}

export function Header() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = ['Estudiantes', 'Docentes', 'Convenios', 'Solicitudes']

  // Detectar la pestaña activa desde la URL
  const currentPath = location.pathname.toLowerCase()
  const activeTab = tabs.find(tab => `/${tab.toLowerCase()}` === currentPath)

  return (
    <div>
      <header className=' flex justify-between items-center bg-primario pl-8 pr-8'>
        <div className='flex items-center'>
          <div className='text-white mr-2 cursor-pointer'>
            <div
              onClick={() => navigate('/dashboard')}
              className='text-4xl font-bold'
              style={{ fontFamily: theme.fontInstitucional }}
            >
              <img src={UPC} alt='Universidad Popular del Cesar Logo' className='w-70 h-30 object-contain' />
            </div>
          </div>
        </div>
        <div className='w-20 h-20'>
          <img src={logo} alt='Universidad Popular del Cesar Logo' className='w-full h-full object-contain' />
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: theme.grisClaro }} className='p-2 shadow-md'>
        <div className='flex justify-between max-w-5xl mx-auto'>
          <button
            className='px-4 py-2 mr-4 rounded transition-all duration-200 hover:bg-gray-100 hover:shadow hover:scale-95 cursor-pointer'
            style={{
              backgroundColor: theme.blanco,
              color: theme.colorTextoOscuro,
              boxShadow: `0 2px 4px ${theme.sombra}`,
              border: `1px solid ${theme.colorClaro}`,
            }}
            onClick={() => navigate(-1)}
          >
            ← Atrás
          </button>
          {tabs.map(tab => (
            <button
              key={tab}
              className='px-4 py-2 rounded transition-all duration-200 hover:bg-gray-100 hover:shadow hover:scale-95 cursor-pointer'
              style={{
                backgroundColor: activeTab === tab ? theme.blanco : 'transparent',
                color: activeTab === tab ? theme.colorOscuro : theme.colorTextoOscuro,
                boxShadow: activeTab === tab ? `0 2px 4px ${theme.sombra}` : 'none',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                border: activeTab === tab ? `1px solid ${theme.colorClaro}` : 'none',
              }}
              onClick={() => navigate(`/${tab.toLowerCase()}`)}
            >
              {tab}
            </button>
          ))}
          <button
            className='px-5 py-3 min-w-[100px] m-[10px] mr-[40px] ml-[20px] cursor-pointer transition-colors duration-[400ms] rounded hover:bg-logout'
            onClick={() => auth.logOut()}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </div>
  )
}
