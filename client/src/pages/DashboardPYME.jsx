import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../services/api";

function DashboardPYME() {
  const { user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api.get("/contracts");
        setContracts(response.data);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchContracts();
  }, []);

  const activeContracts = contracts.filter(
    (c) => c.status === "in_progress" || c.status === "accepted",
  );
  const completedContracts = contracts.filter((c) => c.status === "completed");
  const pendingContracts = contracts.filter((c) => c.status === "requested");

  const getStatusBadge = (status) => {
    const map = {
      requested: { className: "badge warning", label: "Pendiente" },
      accepted: { className: "badge info", label: "Aceptado" },
      in_progress: { className: "badge info", label: "En progreso" },
      completed: { className: "badge success", label: "Completado" },
      cancelled: { className: "badge danger", label: "Cancelado" },
    };
    const badge = map[status] || { className: "badge", label: status };
    return <span className={badge.className}>{badge.label}</span>;
  };

  return (
    <Layout>
      <div
        style={{
          backgroundImage: 'url("/fondodashboardpymes.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <header className="topbar" aria-label="Barra superior">
          <div className="topbar-left">
            <div className="page-title">
              <h1>Dashboard</h1>
              <p>Resumen de tu actividad en JobBridge</p>
            </div>
          </div>
          <div className="topbar-right">
            <Link className="btn btn-primary btn-sm" to="/services">
              Explorar servicios
            </Link>
            <Link className="btn btn-secondary btn-sm" to="/contracts">
              Ver contrataciones
            </Link>
          </div>
        </header>

        <main className="content">
          <section className="panel" aria-label="Bienvenida">
            <div className="stack-8">
              <h2 style={{ fontSize: "16px", margin: 0 }}>
                Bienvenido, {user?.name}
              </h2>
              <p className="muted">
                Aquí tienes un resumen rápido de tu actividad.
              </p>
            </div>
          </section>

          <section style={{ marginTop: "14px" }} aria-label="Indicadores">
            <div
              className="grid"
              style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}
            >
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">Contrataciones</span>
                    <strong style={{ fontSize: "20px" }}>
                      {contracts.length}
                    </strong>
                    <span className="muted" style={{ fontSize: "12px" }}>
                      Total
                    </span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">En progreso</span>
                    <strong style={{ fontSize: "20px" }}>
                      {activeContracts.length}
                    </strong>
                    <span className="muted" style={{ fontSize: "12px" }}>
                      Proyectos activos
                    </span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">Completados</span>
                    <strong style={{ fontSize: "20px" }}>
                      {completedContracts.length}
                    </strong>
                    <span className="muted" style={{ fontSize: "12px" }}>
                      Finalizados
                    </span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="stack-8">
                    <span className="badge">Pendientes</span>
                    <strong style={{ fontSize: "20px" }}>
                      {pendingContracts.length}
                    </strong>
                    <span className="muted" style={{ fontSize: "12px" }}>
                      Por confirmar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {contracts.length > 0 && (
            <section
              style={{ marginTop: "14px" }}
              aria-label="Contrataciones recientes"
            >
              <div className="panel">
                <div className="inline" style={{ marginBottom: "14px" }}>
                  <div>
                    <h2 style={{ fontSize: "16px", margin: 0 }}>
                      Contrataciones recientes
                    </h2>
                    <p className="muted" style={{ fontSize: "12px" }}>
                      Últimas actividades registradas
                    </p>
                  </div>
                  <Link className="btn btn-secondary btn-sm" to="/contracts">
                    Ver todas
                  </Link>
                </div>

                <div className="table-wrap">
                  <table
                    className="table"
                    aria-label="Tabla de contrataciones recientes"
                  >
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>Freelancer</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.slice(0, 5).map((contract) => (
                        <tr key={contract._id}>
                          <td>{contract.serviceId?.title || "Servicio"}</td>
                          <td>{contract.freelancerId?.name || "Freelancer"}</td>
                          <td>
                            {new Date(contract.createdAt).toLocaleDateString()}
                          </td>
                          <td>{getStatusBadge(contract.status)}</td>
                          <td>${contract.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          <section style={{ marginTop: "14px" }} aria-label="Acciones rápidas">
            <div className="panel">
              <div className="inline" style={{ marginBottom: "10px" }}>
                <div>
                  <h2 style={{ fontSize: "16px", margin: 0 }}>
                    Acciones rápidas
                  </h2>
                  <p className="muted" style={{ fontSize: "12px" }}>
                    Atajos a las tareas más frecuentes
                  </p>
                </div>
                <span className="badge">PYME</span>
              </div>
              <div
                className="inline"
                style={{
                  justifyContent: "flex-start",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Link className="btn btn-primary" to="/services">
                  Buscar freelancer
                </Link>
                <Link className="btn btn-secondary" to="/contracts">
                  Mis contrataciones
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

export default DashboardPYME;
