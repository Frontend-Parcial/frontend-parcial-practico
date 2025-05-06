import { Header } from '../components/Header'
import quienesSomosImage from '../assets/QuienesSomos.jpg'
// import { IconClockCog } from '@tabler/icons-react'

export function QuienesSomos() {
  return (
    <div>
      <Header />
      <div className='flex flex-row justify-center items-center mt-10'>
        <div className='w-[70%] h-[360px] gap-5 flex flex-row '>
          <div className='w-[60%] h-full'>
            <img src={quienesSomosImage} alt='Quienes Somos' />
          </div>
          <div className=' w-[40%] h-full '>
            <h1 className='text-3xl text-texto-claro font-bold mb-3'>QUIENES SOMOS</h1>
            <span>
              La Universidad Popular del Cesar concibe la internacionalización como un proceso que abre espacios para
              que la comunidad universitaria genere competencias internacionales y globales, con el fin de potencializar
              la formación de personas íntegras, con excelencia académica, y como ciudadanos del mundo para potenciar el
              desarrollo humano, científico, tecnológico, cultural y artístico, como contribución al desarrollo de la
              región.
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className='flex flex-row justify-center items-center mt-10'>
          {/* <IconClockCog/> */}
        </div>
      </div>
    </div>
  )
}
