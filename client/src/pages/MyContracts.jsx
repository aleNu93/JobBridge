import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

function MyContracts() {
  const { user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const params = {};
        if (filter) params.status = filter;
        const response = await api.get('/contracts', { params });
        setContracts(response.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };
    fetchContracts();
  }, [filter]);

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
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <div className="page-title">
            <h1>Mis contrataciones</h1>
            <p>Historial y estado de tus proyectos</p>
          </div>
        </div>
        <div className="topbar-right">
          {user?.role === 'pyme' && (
            <Link className="btn btn-primary btn-sm" to="/services">Nueva contratación</Link>
          )}
        </div>
      </header>

      <main className="content">
        <div className="panel" style={{ marginBottom: '14px' }} aria-label="Filtros de estado">
          <div className="inline" style={{ flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
            <button className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('')}>Todos</button>
            <button className={`btn btn-sm ${filter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('in_progress')}>En progreso</button>
            <button className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('completed')}>Completados</button>
            <button className={`btn btn-sm ${filter === 'requested' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('requested')}>Pendientes</button>
            <button className={`btn btn-sm ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('cancelled')}>Cancelados</button>
          </div>
        </div>

        {contracts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No hay contrataciones</h3>
            <p>Aún no tienes contrataciones registradas.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Freelancer</th>
                  <th>Fecha</th>
                  <th>Fecha límite</th>
                  <th>Estado</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract._id}>
                    <td>{contract.serviceId?.title || 'Servicio'}</td>
                    <td>{contract.freelancerId?.name || 'Freelancer'}</td>
                    <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                    <td>{contract.deadline ? new Date(contract.deadline).toLocaleDateString() : '—'}</td>
                    <td>{getStatusBadge(contract.status)}</td>
                    <td>${contract.total}</td>
                    <td>
                      <div className="actions">
                        <Link className="btn btn-secondary btn-sm" to={`/contracts/${contract._id}`}>Ver detalle</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default MyContracts;