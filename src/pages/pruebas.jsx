// import { useEffect, useState } from 'react'
// import { getMovilidadDocente, MovilidadDocente } from '../lib/reportes/MovilidadDocente'

// export function Pruebas() {
//   const [datos, setDatos] = useState([])
//   const [facultadesAgrupadas, setFacultadesAgrupadas] = useState([])

//   // Función para agrupar por facultad
//   const agruparPorFacultad = docentes => {
//     const conteo = {}

//     docentes.forEach(docente => {
//       const facultad = docente.facultad

//       if (facultad) {
//         if (conteo[facultad]) {
//           conteo[facultad]++
//         } else {
//           conteo[facultad] = 1
//         }
//       }
//     })

//     // Convertimos a un array con la estructura que necesitas
//     return Object.entries(conteo).map(([facultad, cantidad]) => ({
//       facultad,
//       porcentaje: cantidad, // aquí puedes cambiar a porcentaje real si quieres
//     }))
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getMovilidadDocente()
//       setDatos(data)

//       const agrupado = agruparPorFacultad(data)
//       setFacultadesAgrupadas(agrupado)
//     }

//     fetchData()
//   }, [])

//   return (
//     <div>
//       <h1>FACULTAD POR DOCENTES</h1>

//       <h2>Docentes individuales:</h2>
//       {datos.map(docente => (
//         <div key={docente._id}>
//           <p>
//             {docente.nombre_completo} : {docente.facultad}
//           </p>
//         </div>
//       ))}

//       <h2>Resumen por facultad:</h2>
//       <ul>
//         {facultadesAgrupadas.map(fac => (
//           <li key={fac.facultad}>
//             {fac.facultad}: {fac.porcentaje} docente(s)
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }
