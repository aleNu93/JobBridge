import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../services/api";

function ContractDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await api.get(`/contracts/${id}`);
        setContract(response.data);

        const ratingsRes = await api.get(
          `/ratings/service/${response.data.serviceId?._id}`,
        );
        const contractRatings = ratingsRes.data.ratings.filter(
          (r) => r.contractId === id,
        );
        setRatings(contractRatings);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };
    fetchContract();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await api.put(`/contracts/${id}/status`, {
        status: newStatus,
      });
      setContract(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating status");
    }
  };

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

  if (!contract) {
    return (
      <Layout>
        <main className="content">
          <p>Cargando...</p>
        </main>
      </Layout>
    );
  }

  const isClient = contract.clientId?._id === user?.id;
  const isFreelancer = contract.freelancerId?._id === user?.id;

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <Link className="btn btn-ghost btn-sm" to="/contracts">
            ← Volver
          </Link>
          <div className="page-title">
            <h1>Detalle de contratación</h1>
            <p>{contract.projectName}</p>
          </div>
        </div>
        <div className="topbar-right">{getStatusBadge(contract.status)}</div>
      </header>

      <main className="content">
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "14px" }}>
            <div className="alert-icon" aria-hidden="true">
              ⚠️
            </div>
            <div>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div
          className="grid"
          style={{
            gridTemplateColumns: "1.5fr 1fr",
            gap: "18px",
            alignItems: "start",
          }}
        >
          <div className="stack-16">
            <div className="card" aria-label="Servicio contratado">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>
                  Servicio contratado
                </h2>
              </div>
              <div className="card-body">
                <div className="stack-12">
                  <div>
                    <strong style={{ fontSize: "15px" }}>
                      {contract.serviceId?.title}
                    </strong>
                    <p
                      className="muted"
                      style={{ fontSize: "13px", marginTop: "4px" }}
                    >
                      {contract.serviceId?.description}
                    </p>
                  </div>
                  <hr className="hr" />
                  <div className="service-meta">
                    <span className="pill">{contract.serviceId?.category}</span>
                    <span className="pill">
                      ⏱ {contract.serviceId?.deliveryDays} días
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" aria-label="Descripción del proyecto">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>
                  Descripción del proyecto
                </h2>
              </div>
              <div className="card-body">
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-2)",
                    lineHeight: "1.6",
                  }}
                >
                  {contract.description || "Sin descripción adicional."}
                </p>
                {contract.notes && (
                  <>
                    <hr className="hr" style={{ margin: "12px 0" }} />
                    <p style={{ fontSize: "13px", color: "var(--text-2)" }}>
                      <strong>Notas:</strong> {contract.notes}
                    </p>
                  </>
                )}
              </div>
            </div>

            {contract.milestones && contract.milestones.length > 0 && (
              <div className="card" aria-label="Progreso del proyecto">
                <div className="card-header">
                  <h2 style={{ fontSize: "15px", margin: 0 }}>
                    Progreso del proyecto
                  </h2>
                </div>
                <div className="card-body">
                  <div className="stack-8">
                    {contract.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="inline"
                        style={{ gap: "12px", alignItems: "flex-start" }}
                      >
                        <span style={{ fontSize: "16px", flex: "0 0 auto" }}>
                          {milestone.status === "completed"
                            ? "✅"
                            : milestone.status === "in_progress"
                              ? "🔄"
                              : "⬜"}
                        </span>
                        <div>
                          <strong style={{ fontSize: "13px" }}>
                            {milestone.title}
                          </strong>
                          <p className="muted" style={{ fontSize: "12px" }}>
                            {milestone.status === "completed" &&
                            milestone.completedAt
                              ? `Completado el ${new Date(milestone.completedAt).toLocaleDateString()}`
                              : milestone.status === "in_progress"
                                ? "En progreso"
                                : "Pendiente"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="stack-16">
            <div className="card" aria-label="Información del freelancer">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>
                  {isClient ? "Freelancer asignado" : "Cliente"}
                </h2>
              </div>
              <div className="card-body">
                <div className="stack-12">
                  <div className="user-pill" style={{ padding: 0 }}>
                    {(() => {
                      const pic = isClient
                        ? contract.freelancerId?.profilePicture
                        : contract.clientId?.profilePicture;
                      return pic ? (
                        <img
                          src={`http://localhost:5000${pic}`}
                          alt=""
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "16px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="avatar"
                          aria-hidden="true"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "16px",
                          }}
                        ></div>
                      );
                    })()}
                    <div className="user-meta">
                      <Link to={`/profile/${isClient ? contract.freelancerId?._id : contract.clientId?._id}`} style={{ fontWeight: 650, color: 'var(--primary)' }}>
                        {isClient ? contract.freelancerId?.name : contract.clientId?.name}
                      </Link>
                      <span>
                        {isClient
                          ? contract.freelancerId?.email
                          : contract.clientId?.email}
                      </span>
                    </div>
                  </div>
                  <Link
                    className="btn btn-secondary btn-sm btn-block"
                    to="/chat"
                  >
                    Enviar mensaje
                  </Link>
                </div>
              </div>
            </div>

            <div className="card" aria-label="Resumen de pago">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>Resumen de pago</h2>
              </div>
              <div className="card-body">
                <div className="stack-12">
                  <div className="inline">
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Precio del servicio
                    </span>
                    <span style={{ fontSize: "13px" }}>${contract.price}</span>
                  </div>
                  <div className="inline">
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Comisión plataforma (5%)
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      ${contract.platformFee}
                    </span>
                  </div>
                  <hr className="hr" />
                  <div className="inline">
                    <strong>Total</strong>
                    <strong style={{ color: "var(--primary)" }}>
                      ${contract.total}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" aria-label="Fechas clave">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>Fechas clave</h2>
              </div>
              <div className="card-body">
                <div className="stack-8">
                  <div className="inline">
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Fecha de solicitud
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {contract.startDate && (
                    <div className="inline">
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                        Fecha de inicio
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {new Date(contract.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="inline">
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Fecha solicitada por contratante
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {contract.deadline
                        ? new Date(contract.deadline).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="inline">
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Tiempo estimado del servicio
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {contract.serviceId?.deliveryDays} días
                    </span>
                  </div>
                  {contract.endDate && (
                    <div className="inline">
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                        Fecha de entrega
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {new Date(contract.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {ratings.length > 0 && (
              <div className="card" aria-label="Calificaciones">
                <div className="card-header">
                  <h2 style={{ fontSize: "15px", margin: 0 }}>
                    Calificaciones
                  </h2>
                </div>
                <div className="card-body">
                  <div className="stack-12">
                    {ratings.map((rating) => (
                      <div
                        key={rating._id}
                        style={{
                          paddingBottom: "10px",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div className="inline" style={{ marginBottom: "4px" }}>
                          <div>
                            <strong style={{ fontSize: "13px" }}>
                              {rating.fromUserId?.name}
                            </strong>
                            <span
                              className="muted"
                              style={{ fontSize: "11px", marginLeft: "6px" }}
                            >
                              → {rating.toUserId?.name}
                            </span>
                          </div>
                          <span style={{ fontSize: "14px" }}>
                            {"⭐".repeat(rating.score)}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="muted" style={{ fontSize: "13px" }}>
                            {rating.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {contract.status === "completed" && (
              <div className="card" aria-label="Calificar">
                <div className="card-body">
                  <Link
                    className="btn btn-primary btn-sm btn-block"
                    to="/rating"
                  >
                    Calificar este servicio
                  </Link>
                </div>
              </div>
            )}

            <div className="card" aria-label="Acciones">
              <div className="card-body">
                <div className="stack-8">
                  {isFreelancer && contract.status === "requested" && (
                    <>
                      <button
                        className="btn btn-primary btn-sm btn-block"
                        onClick={() => handleStatusChange("accepted")}
                      >
                        Aceptar contratación
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-block"
                        onClick={() => handleStatusChange("cancelled")}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {isFreelancer && contract.status === "accepted" && (
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => handleStatusChange("in_progress")}
                    >
                      Iniciar trabajo
                    </button>
                  )}
                  {isFreelancer && contract.status === "in_progress" && (
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => handleStatusChange("completed")}
                    >
                      Marcar como completado
                    </button>
                  )}
                  {isClient &&
                    (contract.status === "requested" ||
                      contract.status === "in_progress") && (
                      <button
                        className="btn btn-ghost btn-sm btn-block"
                        style={{ color: "var(--danger)" }}
                        onClick={() => handleStatusChange("cancelled")}
                      >
                        Cancelar contratación
                      </button>
                    )}
                  <Link
                    className="btn btn-secondary btn-sm btn-block"
                    to="/contracts"
                  >
                    ← Volver al historial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ContractDetails;
