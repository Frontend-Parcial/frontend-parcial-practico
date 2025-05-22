import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { QuienesSomos } from './pages/quienes-somos'
import { Login } from './pages/login'
import { AuthProvider } from './providers/AuthProvider'
// import { Pruebas } from './pages/pruebas'
import { Reporte } from './pages/reporte'
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
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<DashboardTablero />} />
            <Route path='/reporte' element={<Reporte />} />
            <Route path='/estudiantes/nuevo' element={<CrearEstudiante />} />
            <Route path='/estudiantes' element={<ListadoEstudiantes />} />
            <Route path='/estudiantes/:id' element={<ObtenerEstudiante />} />
            <Route path='/estudiantes/actualizar/:id' element={<ActualizarEstudiante />} />
            <Route path='/docentes' element={<ListadoDocentes />} />
            <Route path='/docentes/nuevo' element={<CrearDocente />} />
            <Route path='/docentes/:id' element={<ObtenerDocentes />} />
            <Route path='/docentes/actualizar/:id' element={<ActualizarDocentes />} />
          </Route>

          {/* <Route path='/asignaturas' element={<Asignaturas />} /> */}
          {/* <Route path='/solicitudes' element={<Solicitudes />} /> */}
          {/* <Route path='/convenio' element={<Convenios />} /> */}
          {/* <Route path='/seguimiento' element={<Seguimiento/>}/> */}
        </Routes>
      </AuthProvider>
    </div>
  )
}
export default App
