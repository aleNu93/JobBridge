import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Layout from "../components/Layout";
import api from "../services/api";

function Cart() {
  const { cart, removeFromCart, clearCart, getTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  const { subtotal, fee, total } = getTotal();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      for (const service of cart) {
        await api.post("/contracts", {
          serviceId: service._id,
          projectName: `${projectName} - ${service.title}`,
          description,
          contactEmail,
          deadline: "",
          notes: `Contratación múltiple: ${cart.length} servicios`,
        });
      }

      setCreatedCount(cart.length);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate("/contracts"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar el carrito");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <main className="content">
          <div className="panel" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>✅</div>
            <h2>¡Contrataciones creadas exitosamente!</h2>
            <p className="muted">
              Se crearon {createdCount} contratos. Redirigiendo...
            </p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="topbar">
        <div className="topbar-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <div className="page-title">
            <h1>Carrito de servicios</h1>
            <p>
              {cart.length} servicio{cart.length !== 1 ? "s" : ""} seleccionado
              {cart.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="content">
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "14px" }}>
            <div className="alert-icon">⚠️</div>
            <div><p>{error}</p></div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p>Explora servicios y agrega los que necesites.</p>
            <button className="btn btn-primary" onClick={() => navigate("/services")}>
              Explorar servicios
            </button>
          </div>
        ) : (
          <div className="grid" style={{
            gridTemplateColumns: "1.4fr 1fr",
            gap: "18px",
            alignItems: "start",
          }}>

            {/* LEFT */}
            <div className="stack-16">

              {/* SERVICES */}
              <div className="card">
                <div className="card-header">
                  <h2 style={{ fontSize: "15px", margin: 0 }}>Servicios seleccionados</h2>
                </div>
                <div className="card-body">
                  <div className="stack-12">
                    {cart.map((service) => (
                      <div key={service._id} className="inline">
                        <div>
                          <strong>{service.title}</strong>
                          <p className="muted" style={{ fontSize: "12px" }}>
                            {service.freelancerId?.name} · {service.category} · {service.deliveryDays} días
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span>${service.price}</span>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: "var(--danger)" }}
                            onClick={() => removeFromCart(service._id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="card">
                <div className="card-header">
                  <h2 style={{ fontSize: "15px", margin: 0 }}>Detalles del proyecto</h2>
                </div>
                <div className="card-body">
                  <form id="cart-form" className="form" onSubmit={handleCheckout}>
                    <div className="field">
                      <label className="label">Nombre del proyecto *</label>
                      <input
                        className="input"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="field">
                      <label className="label">Descripción *</label>
                      <textarea
                        className="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="field">
                      <label className="label">Correo *</label>
                      <input
                        className="input"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="stack-16">

              {/* SUMMARY */}
              <div className="card">
                <div className="card-header">
                  <h2 style={{ fontSize: "15px", margin: 0 }}>Resumen de pago</h2>
                </div>
                <div className="card-body">
                  <div className="stack-12">
                    {cart.map((s) => (
                      <div key={s._id} className="inline">
                        <span className="muted">{s.title}</span>
                        <span>${s.price.toFixed(2)}</span>
                      </div>
                    ))}

                    <hr className="hr" />

                    <div className="inline">
                      <span className="muted">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="inline">
                      <span className="muted">Comisión (5%)</span>
                      <span>${fee.toFixed(2)}</span>
                    </div>

                    <hr className="hr" />

                    <div className="inline">
                      <strong>Total</strong>
                      <strong style={{ color: "var(--primary)" }}>
                        ${total.toFixed(2)}
                      </strong>
                    </div>

                    <p className="help">
                      El pago es simulado. En producción se integraría con una pasarela real.
                    </p>
                  </div>
                </div>
              </div>

              {/* PAYMENT (FULL, MATCHED) */}
              <div className="card">
                <div className="card-header">
                  <h2 style={{ fontSize: "15px", margin: 0 }}>Método de pago</h2>
                </div>
                <div className="card-body">
                  <div className="stack-12">

                    <div className="field">
                      <label className="label">Nombre en la tarjeta</label>
                      <input className="input" placeholder="Nombre Apellido" />
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
                    <div className="alert alert-warning">
                      <div className="alert-icon">⚠️</div>
                      <div>
                        <strong>Solo simulación</strong>
                        <p>No ingreses datos reales de tarjeta.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <button
                className="btn btn-primary btn-block"
                type="submit"
                form="cart-form"
                disabled={loading}
              >
                {loading
                  ? "Procesando..."
                  : `Confirmar ${cart.length} contratación${cart.length !== 1 ? "es" : ""} →`}
              </button>

              <button
                className="btn btn-ghost btn-block"
                onClick={() => navigate("/services")}
              >
                Seguir explorando
              </button>

            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Cart;