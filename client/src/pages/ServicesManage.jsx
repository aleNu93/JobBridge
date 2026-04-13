import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

function ServicesManage() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data.filter(s => s.freelancerId?._id === user?.id));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [user?.id]);
  
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <div className="page-title">
            <h1>Mis servicios</h1>
            <p>Gestiona tus publicaciones y disponibilidad</p>
          </div>
        </div>
        <div className="topbar-right">
          <Link className="btn btn-primary btn-sm" to="/services/create">Nuevo servicio</Link>
        </div>
      </header>

      <main className="content">
        {services.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🧰</div>
            <h3>No tienes servicios publicados</h3>
            <p>Crea tu primer servicio para que las empresas puedan encontrarte.</p>
            <div className="actions">
              <Link className="btn btn-primary" to="/services/create">Crear servicio</Link>
            </div>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {services.map((service) => (
              <article className="service-card" key={service._id}>
                <div className="service-head">
                  <h3>{service.title}</h3>
                  <span className="price">${service.price}</span>
                </div>

                <div className="service-meta">
                  <span className="pill">{service.category}</span>
                  <span className="pill">Entrega: {service.deliveryDays} días</span>
                  <span className="pill">{service.status === 'active' ? 'Activo' : service.status}</span>
                </div>

                <p className="muted">{service.description}</p>

                <div className="inline">
                  <span className="badge success">Publicado</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link className="btn btn-secondary btn-sm" to={`/services/${service._id}`}>Ver</Link>
                    <Link className="btn btn-ghost btn-sm" to={`/services/edit/${service._id}`}>Editar</Link>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(service._id)} style={{ color: 'var(--danger)' }}>Eliminar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}

export default ServicesManage;