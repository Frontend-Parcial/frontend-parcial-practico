
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { QuienesSomos } from './pages/quienes-somos'
import { Login } from './pages/login'
import { AuthProvider } from './providers/AuthProvider'
import { Pruebas } from './pages/pruebas'

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          {/* <Route path='/quienes-somos' element={<QuienesSomos />} /> */}
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/prueba' element={<Pruebas />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}
 export default App