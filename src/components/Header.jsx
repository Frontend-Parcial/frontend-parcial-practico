import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/UNICESAR 2024.png'
import { useAuth } from '../providers/AuthProvider'

const theme = {
  colorGradiente: 'linear-gradient(to right, #2fb44b, #4dd269)',
  sombra: 'rgba(0,0,0,0.2)',
  fontInstitucional: 'sans-serif',
  grisClaro: '#f0f0f0',
  blanco: '#ffffff',
  colorOscuro: '#000000',
  colorTextoOscuro: '#333333',
  colorClaro: '#cccccc',
}

export function Header() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = ['Convenio', 'Solicitudes', 'Asignaturas', 'Seguimiento', 'Reporte']

  // Detectar la pestaña activa desde la URL
  const currentPath = location.pathname.toLowerCase()
  const activeTab = tabs.find(tab => `/${tab.toLowerCase()}` === currentPath)

  return (
    <div>
      <header className=' flex justify-between items-center bg-claro'>
        <div className='flex items-center'>
          <div className='text-white mr-2'>
            <div className='text-4xl font-bold' style={{ fontFamily: theme.fontInstitucional }}>
              UPC
            </div>
            <div>
              <span className='text-2xl'>Universidad</span>
              <div className='text-xl'>Popular del Cesar</div>
            </div>
          </div>
        </div>
        <div className='w-54 h-54'>
          <img src={logo} alt='Universidad Popular del Cesar Logo' className='w-full h-full object-contain' />
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: theme.grisClaro }} className='p-2 shadow-md'>
        <div className='flex justify-between max-w-5xl mx-auto'>
          {tabs.map(tab => (
            <button
              key={tab}
              className='px-4 py-2 rounded transition-all duration-200 hover:bg-gray-100 hover:shadow hover:scale-95'
              style={{
                backgroundColor: activeTab === tab ? theme.blanco : 'transparent',
                color: activeTab === tab ? theme.colorOscuro : theme.colorTextoOscuro,
                boxShadow: activeTab === tab ? `0 2px 4px ${theme.sombra}` : 'none',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                border: activeTab === tab ? `1px solid ${theme.colorClaro}` : 'none',
              }}
              onClick={() => navigate(`/${tab.toLowerCase()}`)}
            >
              {tab} ↓
            </button>
          ))}
          <button
            className='px-5 py-3 min-w-[100px] m-[10px] mr-[40px] ml-[20px] cursor-pointer transition-colors duration-[400ms] rounded hover:bg-red-300'
            onClick={() => auth.logOut()}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}
