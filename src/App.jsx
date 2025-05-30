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
import ListaSolicitudes from './pages/solicitudes/ListaSolicitudes'
import CrearSeguimiento from './pages/seguimiento/gestionar-seguimiento'
import SolicitudIntercambioForm from './pages/solicitudes/SolicitudesCreate'
import ListaConvenios from './pages/convenios/ListarConvenios'
import CrearConvenio from './pages/convenios/component/CrearNuevoConvenio'
import { DetalleConvenio } from './pages/convenios/DetalleConvenio'
import { ListadoAsignaturas } from './pages/asignaturas/listado-asignaturas'
import { DetalleAsignaturas } from './pages/asignaturas/detalleAsignaturas'
import { CrearAsignaturas } from './pages/asignaturas/crearAsignaturas'

import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/healthcheck' element={<HealthCheck />} />
        <Route element={<PrivateRoute />}>
          <Route
            path='/Inicio'
            element={
              <Layout>
                <DashboardTablero />
              </Layout>
            }
          />
          <Route
            path='/estudiantes/nuevo'
            element={
              <Layout>
                <CrearEstudiante />
              </Layout>
            }
          />
          <Route
            path='/estudiantes'
            element={
              <Layout>
                <ListadoEstudiantes />
              </Layout>
            }
          />
          <Route
            path='/estudiantes/:id'
            element={
              <Layout>
                <ObtenerEstudiante />
              </Layout>
            }
          />
          <Route
            path='/estudiantes/actualizar/:id'
            element={
              <Layout>
                <ActualizarEstudiante />
              </Layout>
            }
          />
          <Route
            path='/docentes'
            element={
              <Layout>
                <ListadoDocentes />
              </Layout>
            }
          />
          <Route
            path='/docentes/nuevo'
            element={
              <Layout>
                <CrearDocente />
              </Layout>
            }
          />
          <Route
            path='/docentes/:id'
            element={
              <Layout>
                <ObtenerDocentes />
              </Layout>
            }
          />
          <Route
            path='/docentes/actualizar/:id'
            element={
              <Layout>
                <ActualizarDocentes />
              </Layout>
            }
          />
          <Route
            path='/solicitudes'
            element={
              <Layout>
                <ListaSolicitudes />
              </Layout>
            }
          />
          <Route
            path='/seguimiento'
            element={
              <Layout>
                <CrearSeguimiento />
              </Layout>
            }
          />
          <Route
            path='/seguimiento/crear'
            element={
              <Layout>
                <SolicitudIntercambioForm />
              </Layout>
            }
          />
          <Route
            path='/solicitudes/nuevo'
            element={
              <Layout>
                <SolicitudIntercambioForm />
              </Layout>
            }
          />
          <Route
            path='/convenios'
            element={
              <Layout>
                <ListaConvenios />
              </Layout>
            }
          />
          <Route
            path='/convenios/nuevo'
            element={
              <Layout>
                <CrearConvenio />
              </Layout>
            }
          />
          <Route
            path='/convenios/:id'
            element={
              <Layout>
                <DetalleConvenio />
              </Layout>
            }
          />
          <Route
            path='/asignaturas'
            element={
              <Layout>
                <ListadoAsignaturas />
              </Layout>
            }
          />

          <Route
            path='/asignaturas/:id'
            element={
              <Layout>
                <DetalleAsignaturas />
              </Layout>
            }
          />

          <Route
            path='/asignaturas/crearAsignaturas'
            element={
              <Layout>
                <CrearAsignaturas />
              </Layout>
            }
          />
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
