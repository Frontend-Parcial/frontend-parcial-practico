import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/ESCUDO_UPC_PQ.png'
import UPC from '../assets/LOGO-UPC.png'
import { useAuth } from '../providers/AuthProvider'

// Íconos
import { FiHome, FiUsers, FiUserCheck, FiFileText, FiLogOut } from 'react-icons/fi'
import { MdHandshake } from 'react-icons/md'

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

  const tabs = [
    { name: 'Inicio', icon: <FiHome className='mr-2' /> },
    { name: 'Estudiantes', icon: <FiUsers className='mr-2' /> },
    { name: 'Docentes', icon: <FiUserCheck className='mr-2' /> },
    { name: 'Convenios', icon: <MdHandshake className='mr-2' /> },
    { name: 'Solicitudes', icon: <FiFileText className='mr-2' /> },
  ]

  const currentPath = location.pathname.toLowerCase()
  const activeTab = tabs.find(tab => currentPath.startsWith(`/${tab.name.toLowerCase()}`))

  return (
    <div className='shadow-md'>
      <header className='flex justify-between items-center bg-primario px-6 py-3'>
        <div className='flex items-center gap-4'>
          <img
            src={UPC}
            alt='Universidad Popular del Cesar Logo'
            className='h-14 object-contain cursor-pointer'
            onClick={() => navigate('/Inicio')}
          />
        </div>
        <div>
          <img src={logo} alt='Escudo Universidad Popular del Cesar' className='h-16 object-contain' />
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: theme.grisClaro }} className='py-3'>
        <div className='max-w-7xl mx-auto flex justify-between items-center px-4'>
          <div className='flex gap-3'>
            {tabs.map(tab => (
              <button
                key={tab.name}
                className='flex items-center px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200 hover:shadow-md text-sm'
                style={{
                  backgroundColor: activeTab?.name === tab.name ? theme.blanco : 'transparent',
                  color: activeTab?.name === tab.name ? theme.colorOscuro : theme.colorTextoOscuro,
                  boxShadow: activeTab?.name === tab.name ? `0 2px 6px ${theme.sombra}` : 'none',
                  fontWeight: activeTab?.name === tab.name ? '600' : 'normal',
                  border: activeTab?.name === tab.name ? `1px solid ${theme.colorClaro}` : 'none',
                }}
                onClick={() => navigate(`/${tab.name.toLowerCase()}`)}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
          <button
            className='flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium bg-white text-red-600 border border-red-200 hover:bg-logout hover:text-white transition duration-300'
            onClick={() => auth.logOut()}
          >
            <FiLogOut />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </div>
  )
}
