import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/UNICESAR 2024.png'

/* #2fb44b #4dd269 #61e67d */

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = ['Convenio', 'Solicitudes', 'Asignaturas', 'Seguimiento', 'Reporte']

  // Detectar la pestaña activa desde la URL
  const currentPath = location.pathname.toLowerCase()
  const activeTab = tabs.find(tab => `/${tab.toLowerCase()}` === currentPath)

  return (
    <header className='w-full h-20 bg-[#ECECEC] flex flex-row items-center justify-between p-8'>
      <img src={logo} alt='Logo' className='h-16 cursor-pointer' onClick={() => navigate('/')} />
      <ul className='flex flex-row justify-between items-center h-full gap-3'>
        <li
          onClick={() => navigate('/quienes-somos')}
          className='text-[#675d4e] font-medium cursor-pointer hover:text-claro'
        >
          QUIENES SOMOS
        </li>
        <li
          onClick={() => navigate('/normatividad')}
          className='text-[#675d4e] font-medium cursor-pointer hover:text-claro'
        >
          NORMATIVIDAD
        </li>
        <li
          onClick={() => navigate('/convenios')}
          className='text-[#675d4e] font-medium cursor-pointer hover:text-claro'
        >
          CONVENIOS
        </li>
        <li
          onClick={() => navigate('/solicitudes')}
          className='text-[#675d4e] font-medium cursor-pointer hover:text-claro'
        >
          CONVOCATORIA
        </li>
        <li onClick={() => navigate('/login')} className='text-[#675d4e] font-medium cursor-pointer hover:text-claro'>
          INICIAR SESIÓN
        </li>
      </ul>
    </header>
  )
}
