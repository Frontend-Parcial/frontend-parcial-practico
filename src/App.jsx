
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { QuienesSomos } from './pages/quienes-somos'
import { Login } from './pages/login'
import { AuthProvider } from './providers/AuthProvider'
import { SolicitudesAdd } from './pages/SolicitudesAdd'
// import { Asignaturas } from './pages/asignaturas'
// import { Solicitudes } from './pages/solicitudes'
// import { Convenios } from './pages/convenio'
// import { Seguimiento } from './pages/seguimiento'

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
           <Route path='/quienes-somos' element={<QuienesSomos />} /> 
           <Route path='/login' element={<Login />} /> 
           <Route path='/solicitudes' element={<SolicitudesAdd/>}/>
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