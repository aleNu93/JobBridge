import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

function NewContract() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [deadlineWarning, setDeadlineWarning] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/contracts", {
        serviceId,
        projectName,
        description,
        contactEmail,
        deadline,
        notes,
      });
      navigate("/contracts");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating contract");
    }
  };

  if (!service) {
    return (
      <Layout>
        <main className="content">
          <p>Cargando...</p>
        </main>
      </Layout>
    );
  }

  const platformFee = service.price * 0.05;
  const total = service.price + platformFee;

  const handleDeadlineChange = (value) => {
    setDeadline(value);
    if (value && service) {
      const selectedDate = new Date(value);
      const today = new Date();
      const diffDays = Math.ceil(
        (selectedDate - today) / (1000 * 60 * 60 * 24),
      );
      if (diffDays < service.deliveryDays) {
        setDeadlineWarning(
          `Recuerde que el tiempo estimado para este servicio es de ${service.deliveryDays} días. ` +
            `Usted está solicitando entrega en ${diffDays} días. El freelancer puede que lo termine en ese tiempo, ` +
            `pero no está obligado a hacerlo.`,
        );
      } else {
        setDeadlineWarning("");
      }
    } else {
      setDeadlineWarning("");
    }
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <div className="page-title">
            <h1>Nueva contratación</h1>
            <p>Confirma los detalles y envía la solicitud</p>
          </div>
        </div>
        <div className="topbar-right">
          <span className="badge info">Checkout simulado</span>
        </div>
      </header>

      <main className="content">
        <div
          className="alert alert-info"
          role="alert"
          style={{ marginBottom: "14px" }}
        >
          <div className="alert-icon" aria-hidden="true">
            ℹ️
          </div>
          <div>
            <strong>Pago simulado</strong>
            <p>Este es un entorno académico. No se realizarán cobros reales.</p>
          </div>
        </div>

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
            gridTemplateColumns: "1.4fr 1fr",
            gap: "18px",
            alignItems: "start",
          }}
        >
          <div className="stack-16">
            <div className="card" aria-label="Servicio seleccionado">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>
                  Servicio seleccionado
                </h2>
              </div>
              <div className="card-body">
                <div className="stack-12">
                  <div>
                    <strong style={{ fontSize: "15px" }}>
                      {service.title}
                    </strong>
                    <p
                      className="muted"
                      style={{ fontSize: "13px", marginTop: "4px" }}
                    >
                      {service.description}
                    </p>
                  </div>
                  <hr className="hr" />
                  <div className="service-meta">
                    <span className="pill">{service.category}</span>
                    <span className="pill">⏱ {service.deliveryDays} días</span>
                  </div>
                  <div className="inline">
                    <div>
                      <span className="muted" style={{ fontSize: "12px" }}>
                        Freelancer
                      </span>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          margin: "2px 0 0 0",
                        }}
                      >
                        {service.freelancerId?.name}
                      </p>
                    </div>
                    <span className="price" style={{ fontSize: "20px" }}>
                      ${service.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" aria-label="Detalles del proyecto">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>
                  Detalles del proyecto
                </h2>
              </div>
              <div className="card-body">
                <form
                  className="form"
                  onSubmit={handleSubmit}
                  id="contract-form"
                >
                  <div className="field">
                    <label className="label" htmlFor="project-name">
                      Nombre del proyecto *
                    </label>
                    <input
                      className="input"
                      type="text"
                      id="project-name"
                      placeholder="Ej: Rediseño imagen corporativa 2025"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="project-desc">
                      Descripción y requerimientos *
                    </label>
                    <textarea
                      className="textarea"
                      id="project-desc"
                      placeholder="Describe en detalle qué necesitas."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                    <span className="help">
                      Mientras más detallado, mejor podrá entenderte el
                      freelancer.
                    </span>
                  </div>

                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}
                  >
                    <div className="field">
                      <label className="label" htmlFor="deadline">
                        Fecha límite deseada
                      </label>
                      <input
                        className="input"
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => handleDeadlineChange(e.target.value)}
                      />
                      {deadlineWarning && (
                        <div
                          className="alert alert-warning"
                          style={{ marginTop: "8px" }}
                        >
                          <div className="alert-icon" aria-hidden="true">
                            ⚠️
                          </div>
                          <div>
                            <p style={{ fontSize: "12px" }}>
                              {deadlineWarning}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="contact-email">
                        Correo de contacto *
                      </label>
                      <input
                        className="input"
                        type="email"
                        id="contact-email"
                        placeholder="empresa@correo.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="extra-notes">
                      Notas adicionales
                    </label>
                    <textarea
                      className="textarea"
                      id="extra-notes"
                      placeholder="Cualquier otra información relevante."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{ minHeight: "80px" }}
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="stack-16">
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
                    <span style={{ fontSize: "13px" }}>
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="inline">
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                      Comisión plataforma (5%)
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      ${platformFee.toFixed(2)}
                    </span>
                  </div>
                  <hr className="hr" />
                  <div className="inline">
                    <strong style={{ fontSize: "15px" }}>Total</strong>
                    <strong
                      style={{ fontSize: "18px", color: "var(--primary)" }}
                    >
                      ${total.toFixed(2)}
                    </strong>
                  </div>
                  <p className="help">
                    El pago es simulado. En producción se integraría con una
                    pasarela real.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" aria-label="Método de pago simulado">
              <div className="card-header">
                <h2 style={{ fontSize: "15px", margin: 0 }}>Método de pago</h2>
              </div>
              <div className="card-body">
                <div className="stack-12">
                  <div className="field">
                    <label className="label">Nombre en la tarjeta</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Nombre Apellido"
                    />
                  </div>
                  <div className="field">
                    <label className="label">Número de tarjeta</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      maxLength="19"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        value = value.substring(0, 16);
                        value = value.replace(/(.{4})/g, "$1 ").trim();
                        e.target.value = value;
                      }}
                      inputMode="numeric"
                    />
                  </div>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr", gap: "10px" }}
                  >
                    <div className="field">
                      <label className="label">Vencimiento</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length >= 1) {
                            let month = value.substring(0, 2);
                            if (value.length === 1 && parseInt(value) > 1) {
                              month = '0' + value;
                            }
                            if (value.length >= 2) {
                              let m = parseInt(month);
                              if (m < 1) month = '01';
                              if (m > 12) month = '12';
                            }
                            if (value.length > 2) {
                              let year = value.substring(2, 4);
                              if (value.length === 4) {
                                const now = new Date();
                                const currentYear = now.getFullYear() % 100;
                                const currentMonth = now.getMonth() + 1;
                                let y = parseInt(year);
                                let m = parseInt(month);
                                if (y < currentYear || (y === currentYear && m < currentMonth)) {
                                  year = String(currentYear).padStart(2, '0');
                                  if (m < currentMonth) {
                                    month = String(currentMonth).padStart(2, '0');
                                  }
                                }
                                if (y > currentYear + 10) year = String(currentYear + 10);
                              }
                              value = month + '/' + year;
                            } else {
                              value = month;
                            }
                          }
                          e.target.value = value;
                        }}
                        inputMode="numeric"
                      />
                    </div>
                    <div className="field">
                      <label className="label">CVV</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="•••"
                        maxLength="3"
                        onChange={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .substring(0, 3);
                        }}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div className="alert alert-warning" role="note">
                    <div className="alert-icon" aria-hidden="true">
                      ⚠️
                    </div>
                    <div>
                      <strong>Solo simulación</strong>
                      <p>No ingreses datos reales de tarjeta.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              form="contract-form"
            >
              Confirmar contratación →
            </button>
            <button
              className="btn btn-ghost btn-block"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default NewContract;
