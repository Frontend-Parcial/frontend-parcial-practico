import { Route, Routes, useLocation } from 'react-router-dom'
import { Login } from './pages/login'
import { AuthProvider } from './providers/AuthProvider'
import PrivateRoute from './providers/PrivateRoute'
import { CrearEstudiante } from './pages/estudiantes/crear-estudiante'
import { ListadoEstudiantes } from './pages/estudiantes/listado-estudiantes'
import { ObtenerEstudiante } from './pages/estudiantes/obtener-estudiante'
import { ActualizarEstudiante } from './pages/estudiantes/actualizar-estudiante'
import DashboardTablero from './pages/Tablero/DashboardTablero'
import { ListadoDocentes } from './pages/docentes/listado-docentes'
import { CrearDocente } from './pages/docentes/crear-docente'
import { ObtenerDocentes } from './pages/docentes/obtener-docentes'
import { ActualizarDocentes } from './pages/docentes/actualizar-docentes'
import { Register } from './pages/register'
import { HealthCheck } from './pages/healthcheck'
import CrearSolicitud from './pages/solicitudes/crear-solicitudes'

import CrearSeguimiento from './pages/seguimiento/crear-seguimiento'

import { AnimatePresence } from 'framer-motion'

import { SolicitudesAdd } from './pages/SolicitudesAdd'
import SolicitudIntercambioForm from './pages/solicitudes/SolicitudesCreate'
import ListaSolicitudes from './pages/solicitudes/ListaSolicitudes'
//import CrearSeguimiento from './pages/seguimiento/crear-seguimiento'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/healthcheck' element={<HealthCheck />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<DashboardTablero />} />
          <Route path='/estudiantes/nuevo' element={<CrearEstudiante />} />
          <Route path='/estudiantes' element={<ListadoEstudiantes />} />
          <Route path='/estudiantes/:id' element={<ObtenerEstudiante />} />
          <Route path='/estudiantes/actualizar/:id' element={<ActualizarEstudiante />} />
          <Route path='/docentes' element={<ListadoDocentes />} />
          <Route path='/docentes/nuevo' element={<CrearDocente />} />
          <Route path='/docentes/:id' element={<ObtenerDocentes />} />
          <Route path='/docentes/actualizar/:id' element={<ActualizarDocentes />} />
          <Route path='/solicitudes' element={<ListaSolicitudes />} />
          <Route path='/solicitudes/nuevo' element={<SolicitudIntercambioForm />} />
          {/* <Route path='/seguimiento' element={<CrearSeguimiento/>} /> */}
 {/* <Route path='/prueba' element={<Pruebas />} /> */}
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <AnimatedRoutes />
    </AuthProvider>
  )
}

export default App
