import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './pages/home'
import { QuienesSomos } from './pages/quienes-somos'
import { Login } from './pages/login'
import { AuthProvider } from './providers/AuthProvider'
import { Pruebas } from './pages/pruebas'
import { Reporte } from './pages/reporte'
import PrivateRoute from './providers/PrivateRoute'
// import { Asignaturas } from './pages/asignaturas'
// import { Solicitudes } from './pages/solicitudes'
// import { Convenios } from './pages/convenio'
// import { Seguimiento } from './pages/seguimiento'

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          {/* <Route path='/quienes-somos' element={<QuienesSomos />} /> */}
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/prueba' element={<Pruebas />} />
          {/* Esto es una ruta privada */}
          <Route element={<PrivateRoute />}>
            <Route path='/reporte' element={<Reporte />} />
          </Route>

          {/* <Route path='/asignaturas' element={<Asignaturas />} /> */}
          {/* <Route path='/solicitudes' element={<Solicitudes />} /> */}
          {/* <Route path='/convenio' element={<Convenios />} /> */}
          {/* <Route path='/seguimiento' element={<Seguimiento />} /> */}
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
