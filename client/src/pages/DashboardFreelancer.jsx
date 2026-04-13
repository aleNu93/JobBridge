import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

function DashboardFreelancer() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [ratings, setRatings] = useState({ average: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, contractsRes] = await Promise.all([
          api.get('/services'),
          api.get('/contracts')
        ]);
        setServices(servicesRes.data.filter(s => s.freelancerId?._id === user?.id));
        setContracts(contractsRes.data);

        if (user?.id) {
          const ratingsRes = await api.get(`/ratings/user/${user.id}`);
          setRatings(ratingsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.id]);

  const pendingRequests = contracts.filter(c => c.status === 'requested');
  const activeContracts = contracts.filter(c => c.status === 'in_progress' || c.status === 'accepted');
  const completedContracts = contracts.filter(c => c.status === 'completed');
  const cancelledContracts = contracts.filter(c => c.status === 'cancelled');

  const totalEarnings = completedContracts.reduce((sum, c) => sum + (c.price || 0), 0);
  const avgContractValue = completedContracts.length > 0
    ? (totalEarnings / completedContracts.length).toFixed(2)
    : 0;
  const completionRate = contracts.length > 0
    ? ((completedContracts.length / contracts.length) * 100).toFixed(0)
    : 0;

  const getStatusBadge = (status) => {
    const map = {
      requested: { className: 'badge warning', label: 'Pendiente' },
      accepted: { className: 'badge info', label: 'Aceptado' },
      in_progress: { className: 'badge info', label: 'En progreso' },
      completed: { className: 'badge success', label: 'Completado' },
      cancelled: { className: 'badge danger', label: 'Cancelado' },
    };
    const badge = map[status] || { className: 'badge', label: status };
    return <span className={badge.className}>{badge.label}</span>;
  };

  return (
    <Layout>
      <div style={{
        backgroundImage: 'url("/fondodashboardfreelancer.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}>
        <header className="topbar" aria-label="Barra superior">
          <div className="topbar-left">
            <div className="page-title">
              <h1>Dashboard</h1>
              <p>Resumen de tu actividad en JobBridge</p>
            </div>
          </div>
          <div className="topbar-right">
            <Link className="btn btn-primary btn-sm" to="/services/create">Crear servicio</Link>
            <Link className="btn btn-secondary btn-sm" to="/requests">Ver solicitudes</Link>
          </div>
        </header>

        <main className="content">
          <section className="panel" aria-label="Bienvenida">
            <div className="stack-8">
              <h2 style={{ fontSize: '16px', margin: 0 }}>Bienvenido, {user?.name}</h2>
              <p className="muted">Aquí tienes un resumen rápido de tu actividad.</p>
            </div>
          </section>

          <section style={{ marginTop: '14px' }} aria-label="Indicadores">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">Servicios</span>
                    <strong style={{ fontSize: '20px' }}>{services.length}</strong>
                    <span className="muted" style={{ fontSize: '12px' }}>Publicados</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">Solicitudes</span>
                    <strong style={{ fontSize: '20px' }}>{pendingRequests.length}</strong>
                    <span className="muted" style={{ fontSize: '12px' }}>Nuevas</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">En progreso</span>
                    <strong style={{ fontSize: '20px' }}>{activeContracts.length}</strong>
                    <span className="muted" style={{ fontSize: '12px' }}>Activos</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">Completados</span>
                    <strong style={{ fontSize: '20px' }}>{completedContracts.length}</strong>
                    <span className="muted" style={{ fontSize: '12px' }}>Finalizados</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginTop: '14px' }} aria-label="Estadísticas de ventas">
            <div className="panel">
              <div className="inline" style={{ marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', margin: 0 }}>Informe de ventas</h2>
                  <p className="muted" style={{ fontSize: '12px' }}>Estadísticas de tu actividad como freelancer</p>
                </div>
                <span className="badge">Estadísticas</span>
              </div>

              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div className="card">
                  <div className="card-body">
                    <div className="stack-8">
                      <span className="muted" style={{ fontSize: '12px' }}>Ingresos totales</span>
                      <strong style={{ fontSize: '20px', color: 'var(--primary)' }}>${totalEarnings}</strong>
                      <span className="muted" style={{ fontSize: '11px' }}>Servicios completados</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="stack-8">
                      <span className="muted" style={{ fontSize: '12px' }}>Valor promedio</span>
                      <strong style={{ fontSize: '20px' }}>${avgContractValue}</strong>
                      <span className="muted" style={{ fontSize: '11px' }}>Por contrato</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="stack-8">
                      <span className="muted" style={{ fontSize: '12px' }}>Tasa de finalización</span>
                      <strong style={{ fontSize: '20px' }}>{completionRate}%</strong>
                      <span className="muted" style={{ fontSize: '11px' }}>{completedContracts.length} de {contracts.length} contratos</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="stack-8">
                      <span className="muted" style={{ fontSize: '12px' }}>Calificación promedio</span>
                      <strong style={{ fontSize: '20px' }}>⭐ {ratings.average || '—'}</strong>
                      <span className="muted" style={{ fontSize: '11px' }}>{ratings.total} calificaciones</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {contracts.length > 0 && (
            <section style={{ marginTop: '14px' }} aria-label="Contratos recientes">
              <div className="panel">
                <div className="inline" style={{ marginBottom: '14px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', margin: 0 }}>Contratos recientes</h2>
                    <p className="muted" style={{ fontSize: '12px' }}>Últimas actividades</p>
                  </div>
                  <Link className="btn btn-secondary btn-sm" to="/contracts">Ver todos</Link>
                </div>

                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Proyecto</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.slice(0, 5).map((contract) => (
                        <tr key={contract._id}>
                          <td>{contract.projectName}</td>
                          <td>{contract.clientId?.name || 'Cliente'}</td>
                          <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                          <td>{getStatusBadge(contract.status)}</td>
                          <td>${contract.price}</td>
                          <td>
                            <Link className="btn btn-secondary btn-sm" to={`/contracts/${contract._id}`}>Ver</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          <section style={{ marginTop: '14px' }} aria-label="Acciones rápidas">
            <div className="panel">
              <div className="inline" style={{ marginBottom: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', margin: 0 }}>Acciones rápidas</h2>
                  <p className="muted" style={{ fontSize: '12px' }}>Atajos a las tareas más frecuentes</p>
                </div>
                <span className="badge">Freelancer</span>
              </div>
              <div className="inline" style={{ justifyContent: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                <Link className="btn btn-primary" to="/services/create">Crear nuevo servicio</Link>
                <Link className="btn btn-secondary" to="/services/manage">Administrar servicios</Link>
                <Link className="btn btn-ghost" to="/requests">Revisar solicitudes</Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

export default DashboardFreelancer;