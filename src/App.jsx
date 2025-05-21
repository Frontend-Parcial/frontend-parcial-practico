
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { QuienesSomos } from './pages/quienes-somos'
import { Login } from './pages/login'
import { AuthProvider } from './providers/AuthProvider'
import { Pruebas } from './pages/pruebas'
import { Reporte } from './pages/reporte'
import PrivateRoute from './providers/PrivateRoute'
import { CrearEstudiante } from './pages/estudiantes/crear-estudiante'
import { ListadoEstudiantes } from './pages/estudiantes/listado-estudiantes'
import { ObtenerEstudiante } from './pages/estudiantes/obtener-estudiante'
import { ActualizarEstudiante } from './pages/estudiantes/actualizar-estudiante'
import DashboardTablero from './pages/Tablero/DashboardTablero'
// import { Asignaturas } from './pages/asignaturas'
// import { Solicitudes } from './pages/solicitudes'
// import { Convenios } from './pages/convenio'
// import { Seguimiento } from './pages/seguimiento'

function App() {
  return (
    <div>
      <DashboardTablero></DashboardTablero>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          {/* <Route path='/quienes-somos' element={<QuienesSomos />} /> */}
          {/* <Route path='/login' element={<Login />} /> */}
          {/* <Route path='/prueba' element={<Pruebas />} /> */}
          <Route path='/prueba' element={<Pruebas />} />
          <Route path='/reporte' element={<Reporte />} />
          <Route path='/estudiantes' element={<CrearEstudiante />} />
          <Route path='/listado' element={<ListadoEstudiantes />} />
          <Route path='/estudiantes/:id' element={<ObtenerEstudiante />} />
          <Route path='/estudiantes/actualizar/:id' element={<ActualizarEstudiante />} />
          <Route element={<PrivateRoute />}></Route>

          {/* <Route path='/asignaturas' element={<Asignaturas />} /> */}
          {/* <Route path='/solicitudes' element={<Solicitudes />} /> */}
          {/* <Route path='/convenio' element={<Convenios />} /> */}
          {/* <Route path='/seguimiento' element={<Seguimiento />} /> */}
        </Routes>
      </AuthProvider>
    </div>
  )
}
 export default App