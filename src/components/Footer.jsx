const Footer = () => {
  return (
    <footer className='bg-gray-300 text-sm text-gray-800 px-8 py-6 mt-8'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div>
          <h3 className='font-semibold'>Universidad Popular del Cesar</h3>
          <ul className='space-y-1 mt-2'>
            <li>PQRS</li>
            <li>Derechos Académicos.</li>
            <li>Mapa del sitio</li>
            <li>Preguntas Frecuentes</li>
            <li>
              Notificaciones Judiciales: <br />
              <a href='mailto:notificacionesjudiciales@unicesar.edu.co' className='text-blue-600 hover:underline'>
                notificacionesjudiciales@unicesar.edu.co
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-semibold'>Contáctenos:</h3>
          <ul className='space-y-1 mt-2'>
            <li>Sede administrativa</li>
            <li>Balneario Hurtado, Vía a Patillal</li>
            <li>Valledupar – Cesar, Colombia</li>
            <li>Mecanismos de contacto</li>
            <li>
              E-mail:{' '}
              <a href='mailto:pqrs@unicesar.edu.co' className='text-blue-600 hover:underline'>
                pqrs@unicesar.edu.co
              </a>
            </li>
          </ul>
        </div>

        <div>
          <ul className='space-y-1 mt-6 md:mt-0'>
            <li>Teléfono conmutador PBX: (+57 605 588 5592)</li>
            <li>Línea de servicio a la ciudadanía: (+57 605 588 5592)</li>
            <li>Línea Anticorrupción: (+57 605 588 5592) Ext: 1010</li>
            <li>
              Correo Anticorrupción:{' '}
              <a href='mailto:controlinternodisciplinario@unicesar.edu.co' className='text-blue-600 hover:underline'>
                controlinternodisciplinario@unicesar.edu.co
              </a>
            </li>
            <li>Instructivo Anticorrupción</li>
          </ul>
        </div>

        <div>
          <ul className='space-y-1 mt-6 md:mt-0'>
            <li>© Copyright 2024</li>
            <li>Universidad Popular del Cesar</li>
            <li>Acerca de este sitio web</li>
            <li>Condiciones de Uso y Políticas</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer;