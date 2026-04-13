import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

function MyRequests() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api.get('/contracts');
        setContracts(response.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };
    fetchContracts();
  }, []);

  const handleStatusChange = async (contractId, newStatus) => {
    try {
      await api.put(`/contracts/${contractId}/status`, { status: newStatus });
      setContracts(contracts.map(c =>
        c._id === contractId ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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
            <h1>Solicitudes</h1>
            <p>Revisa solicitudes entrantes y su estado</p>
          </div>
        </div>
        <div className="topbar-right">
          <Link className="btn btn-secondary btn-sm" to="/services/manage">Ver servicios</Link>
        </div>
      </header>

      <main className="content">
        {contracts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📥</div>
            <h3>No tienes solicitudes</h3>
            <p>Cuando una empresa contrate tus servicios, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="grid" style={{ gap: '14px' }}>
            {contracts.map((contract) => (
              <article className="panel" key={contract._id}>
                <div className="stack-12">
                  <div className="inline">
                    <div>
                      <strong>{contract.clientId?.name || 'Cliente'}</strong>
                      <p className="muted" style={{ fontSize: '12px' }}>{contract.projectName}</p>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>

                  <div className="service-meta">
                    <span className="pill">Servicio: {contract.serviceId?.title}</span>
                    <span className="pill">Monto: ${contract.total}</span>
                    {contract.deadline && (
                      <span className="pill">Plazo: {new Date(contract.deadline).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="inline" style={{ justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <Link className="btn btn-ghost btn-sm" to={`/contracts/${contract._id}`}>Ver detalle</Link>
                    {contract.status === 'requested' && (
                      <>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(contract._id, 'cancelled')}>Rechazar</button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(contract._id, 'accepted')}>Aceptar</button>
                      </>
                    )}
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

export default MyRequests;