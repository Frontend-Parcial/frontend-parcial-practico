import { useState, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { getSolicitudXid } from '../../lib/solicitudes-data';
import { gestionarSeguimiento, getSeguimientoXsolicitud, updateSeguimiento } from '../../lib/seguimientos-data';

const CrearSeguimiento = () => {
  const [form, setForm] = useState({
    id_solicitud: '',
    estado_actual: '',
    evaluaciones_recibidas: [],
    documentos_soporte: [],
    observaciones: 'El estudiante iniciará el intercambio en la fecha programada',
    responsable_seguimiento: 'María Castro - Coordinadora ORPI',
    reporte_avance: [],
    fecha_inicio: '',
    fecha_actualizacion: ''
  });

  const [validSolicitud, setValidSolicitud] = useState(null);
  const [seguimientoExistente, setSeguimientoExistente] = useState(false);

  useEffect(() => {
    const idGuardado = localStorage.getItem('id_solicitud_seleccionada');
    if (idGuardado) {
      setForm(prev => ({ ...prev, id_solicitud: idGuardado }));
      localStorage.removeItem('id_solicitud_seleccionada');
    }
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      if (form.id_solicitud.length >= 6) {
        try {
          const solicitud = await getSolicitudXid(form.id_solicitud);
          setValidSolicitud(!!solicitud);

          if (solicitud) {
            const seguimiento = await getSeguimientoXsolicitud(form.id_solicitud);

            if (seguimiento) {
              setForm({
                ...seguimiento,
                id_solicitud: form.id_solicitud
              });
              setSeguimientoExistente(true);
            } else {
              const fechaInicio = solicitud.fecha_creacion?.$date || solicitud.fecha_creacion || new Date().toISOString();
              setForm(prev => ({ ...prev, fecha_inicio: fechaInicio }));
              setSeguimientoExistente(false);
            }
          }
        } catch (err) {
          console.error(err);
          setValidSolicitud(false);
        }
      }
    };
    cargarDatos();
  }, [form.id_solicitud]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;
    const key = tipo === 'eval' ? 'evaluaciones_recibidas' : 'documentos_soporte';
    setForm(prev => ({ ...prev, [key]: [...prev[key], file.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fechaActual = new Date().toISOString();

    try {
      const seguimientoPrevio = await getSeguimientoXsolicitud(form.id_solicitud);

      const seguimiento = {
        ...form,
        fecha_actualizacion: fechaActual,
        fecha_fin: form.estado_actual === 'culminado' ? fechaActual : null,
        contacto_institucion_destino: {
          nombre: "Dra. Ana Sánchez",
          cargo: "Coordinadora de Estudiantes Internacionales",
          email: "ana.sanchez@unam.mx",
          telefono: "+52 55 8765 4321"
        }
      };

      let result;
      if (seguimientoPrevio && seguimientoPrevio._id) {
        let avance = { "contenido": form.observaciones };
        result = await updateSeguimiento(seguimientoPrevio._id, avance);
        alert(`✅ Seguimiento actualizado correctamente.\nID: ${result.seguimiento._id}`);
      } else {
        result = await gestionarSeguimiento(seguimiento);
        alert(`✅ Seguimiento creado correctamente.\nID: ${result.id_seguimiento}`);
      }

    } catch (error) {
      console.error('❌ Error al guardar seguimiento:', error);
      alert(error.message || '❌ Error al guardar seguimiento');
    }
  };

  const renderRegistroForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FechaCampo label="Fecha de Inicio" value={form.fecha_inicio} />
        <FechaCampo label="Fecha de Actualización" value={form.fecha_actualizacion} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado Actual</label>
        <select
          name="estado_actual"
          value={form.estado_actual}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En proceso</option>
          <option value="culminado">Culminado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUploader label="Evaluaciones Recibidas" files={form.evaluaciones_recibidas} onChange={(e) => handleFileChange(e, 'eval')} icon="📄" />
        <FileUploader label="Documentos Soporte" files={form.documentos_soporte} onChange={(e) => handleFileChange(e, 'doc')} icon="📎" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={3} />
      </div>

      <ContactoFijo />
    </>
  );

  const renderActualizarForm = () => (
    <>
      <FechaCampo label="Fecha de Última Actualización" value={form.fecha_actualizacion} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Actualizar Estado</label>
        <select
          name="estado_actual"
          value={form.estado_actual}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En proceso</option>
          <option value="culminado">Culminado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUploader label="Agregar Evaluaciones" files={form.evaluaciones_recibidas} onChange={(e) => handleFileChange(e, 'eval')} icon="📄" />
        <FileUploader label="Agregar Documentos" files={form.documentos_soporte} onChange={(e) => handleFileChange(e, 'doc')} icon="📎" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nuevas Observaciones</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={3} />
      </div>
    </>
  );

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {seguimientoExistente ? 'Actualizar Seguimiento' : 'Registrar Seguimiento'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID de la Solicitud</label>
            <input
              type="text"
              name="id_solicitud"
              value={form.id_solicitud}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              readOnly={seguimientoExistente}
            />
            {validSolicitud === true && <p className="text-green-600 text-sm">✅ Solicitud válida</p>}
            {validSolicitud === false && <p className="text-red-600 text-sm">❌ Solicitud no encontrada</p>}
          </div>

          {seguimientoExistente ? renderActualizarForm() : renderRegistroForm()}

          <button type="submit" className="w-full mt-4 bg-primario text-white py-2 rounded hover:bg-oscuro">
            {seguimientoExistente ? 'Guardar Cambios' : 'Registrar Seguimiento'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

const FechaCampo = ({ label, value }) => {
  const fechaValida = value?.$date || value;
  return (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        type="text"
        readOnly
        className="w-full bg-gray-100 border px-3 py-2 rounded"
        value={fechaValida ? new Date(fechaValida).toLocaleString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) : ''}
      />
    </div>
  );
};

const FileUploader = ({ label, files, onChange, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type="file" accept="application/pdf" onChange={onChange} />
    <ul className="mt-1 text-sm text-gray-600">
      {files.map((f, i) => (
        <li key={i}>{icon} {f}</li>
      ))}
    </ul>
  </div>
);

const ContactoFijo = () => (
  <div className="mt-4 p-4 bg-gray-50 rounded border">
    <h3 className="font-semibold mb-2">Responsable en Institución Destino</h3>
    <p><strong>Nombre:</strong> Dra. Ana Sánchez</p>
    <p><strong>Cargo:</strong> Coordinadora de Estudiantes Internacionales</p>
    <p><strong>Email:</strong> ana.sanchez@unam.mx</p>
    <p><strong>Teléfono:</strong> +52 55 8765 4321</p>
  </div>
);

export default CrearSeguimiento;
