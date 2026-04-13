import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

function CreateModifyService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [revisionsIncluded, setRevisionsIncluded] = useState('0');
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isEditing) {
      const fetchService = async () => {
        try {
          const response = await api.get(`/services/${id}`);
          const s = response.data;
          setTitle(s.title);
          setDescription(s.description);
          setCategory(s.category);
          setPrice(String(s.price));
          setDeliveryDays(String(s.deliveryDays));
          setRevisionsIncluded(String(s.revisionsIncluded));
        } catch (error) {
          console.error('Error fetching service:', error);
        }
      };
      fetchService();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const serviceData = {
      title,
      description,
      category,
      price: Number(price),
      deliveryDays: Number(deliveryDays),
      revisionsIncluded: Number(revisionsIncluded)
    };

    try {
      let serviceId;
      if (isEditing) {
        await api.put(`/services/${id}`, serviceData);
        serviceId = id;
      } else {
        const response = await api.post('/services', serviceData);
        serviceId = response.data._id;
      }

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(file => formData.append('images', file));
        await api.post(`/services/${serviceId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/services/manage');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving service');
    }
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <div className="page-title">
            <h1>{isEditing ? 'Editar servicio' : 'Crear servicio'}</h1>
            <p>{isEditing ? 'Modifica tu oferta' : 'Publica una nueva oferta en el catálogo'}</p>
          </div>
        </div>
        <div className="topbar-right">
          <Link className="btn btn-ghost btn-sm" to="/services/manage">Volver</Link>
        </div>
      </header>

      <main className="content">
        <section className="panel" aria-label="Formulario de servicio" style={{ maxWidth: '860px' }}>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '14px' }}>
              <div className="alert-icon" aria-hidden="true">⚠️</div>
              <div><p>{error}</p></div>
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="titulo">Título del servicio</label>
              <input
                className="input"
                id="titulo"
                type="text"
                placeholder="Ej: Desarrollo de página web profesional"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="descripcion">Descripción</label>
              <textarea
                className="textarea"
                id="descripcion"
                placeholder="Describe qué incluye tu servicio, alcance, entregables y límites."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <p className="help">Sé específico. Esto reduce solicitudes ambiguas.</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div className="field">
                <label className="label" htmlFor="categoria">Categoría</label>
                <select
                  className="select"
                  id="categoria"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  <option>Diseño</option>
                  <option>Programación</option>
                  <option>Marketing</option>
                  <option>Redacción</option>
                  <option>Video</option>
                  <option>Fotografía</option>
                  <option>Traducción</option>
                  <option>Consultoría</option>
                  <option>Contabilidad</option>
                  <option>Legal</option>
                  <option>Educación</option>
                  <option>Música y Audio</option>
                  <option>Arquitectura</option>
                  <option>Soporte TI</option>
                  <option>Redes Sociales</option>
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="precio">Precio</label>
                <input
                  className="input"
                  id="precio"
                  type="number"
                  placeholder="Ej: 300"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="entrega">Tiempo de entrega (días)</label>
                <input
                  className="input"
                  id="entrega"
                  type="number"
                  placeholder="Ej: 7"
                  min="1"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="revisiones">Revisiones incluidas</label>
                <input
                  className="input"
                  id="revisiones"
                  type="number"
                  placeholder="Ej: 2"
                  min="0"
                  value={revisionsIncluded}
                  onChange={(e) => setRevisionsIncluded(e.target.value)}
                />
              </div>

              <div className="field">
              <label className="label" htmlFor="images">Imágenes del servicio</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                style={{ padding: '8px' }}
              />
              <p className="help">Máximo 5 imágenes, 5MB cada una.</p>
            </div>
            </div>

            <hr className="hr" />

            <div className="inline" style={{ justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/services/manage')}>Cancelar</button>
              <button className="btn btn-primary" type="submit">
                {isEditing ? 'Guardar cambios' : 'Guardar servicio'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
}

export default CreateModifyService;