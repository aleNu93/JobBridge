import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

function ServiceDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [ratings, setRatings] = useState({ ratings: [], average: 0, total: 0 });
  const { addToCart, isInCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await api.get(`/services/${id}`);
        setService(serviceRes.data);

        const ratingsRes = await api.get(`/ratings/service/${id}`);
        setRatings(ratingsRes.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!service) {
    return (
      <Layout>
        <main className="content">
          <p>Cargando...</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <div className="page-title">
            <h1>Detalle del servicio</h1>
            <p>Revisa la información antes de contratar</p>
          </div>
        </div>
        <div className="topbar-right">
          <Link className="btn btn-ghost btn-sm" to="/services">Volver</Link>
        </div>
      </header>

      <main className="content">
        <div className="grid" style={{ gridTemplateColumns: "1.4fr 0.6fr", gap: "14px" }}>
          <section className="panel" aria-label="Información del servicio">
            <div className="stack-16">
              <div className="stack-8">
                <div className="inline">
                  <h2 style={{ margin: 0 }}>{service.title}</h2>
                  <span className="badge">{service.category}</span>
                </div>
                <p className="muted">{service.description}</p>
              </div>

              <div className="service-meta">
                <span className="pill">Entrega: {service.deliveryDays} días</span>
                <span className="pill">{service.revisionsIncluded} revisiones</span>
              </div>

              {service.images && service.images.length > 0 && (
                <div className="stack-8">
                  <strong>Imágenes</strong>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {service.images.map((img, index) => (
                      <a key={index} href={`http://localhost:5000${img}`} target="_blank" rel="noopener noreferrer">
                        <img src={`http://localhost:5000${img}`} alt={`Servicio ${index + 1}`} style={{ width: "150px", height: "120px", borderRadius: "12px", objectFit: "cover", border: "1px solid var(--border)", cursor: "pointer" }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <hr className="hr" />

              <div className="inline">
                <div className="rating">
                  <span className="star" aria-hidden="true"></span>
                  <span>{ratings.average} ({ratings.total} calificaciones)</span>
                </div>
              </div>

              {ratings.ratings.length > 0 && (
                <div className="stack-12">
                  <strong>Reseñas</strong>
                  {ratings.ratings.map((rating) => (
                    <div key={rating._id} className="panel" style={{ padding: "12px" }}>
                      <div className="inline" style={{ marginBottom: "6px" }}>
                        <strong style={{ fontSize: "13px" }}>{rating.fromUserId?.name}</strong>
                        <span className="muted" style={{ fontSize: "12px" }}>{"⭐".repeat(rating.score)}</span>
                      </div>
                      <p className="muted" style={{ fontSize: "13px" }}>{rating.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="panel" aria-label="Acciones de contratación">
            <div className="stack-16">
              <div className="stack-8">
                <strong>Precio</strong>
                <div className="inline">
                  <span className="price" style={{ fontSize: "20px" }}>${service.price}</span>
                  <span className="badge">Fijo</span>
                </div>
                <p className="muted">Incluye entrega y revisiones indicadas.</p>
              </div>

              <hr className="hr" />

              <div className="stack-8">
                <strong>Freelancer</strong>
                <div className="inline">
                  {service.freelancerId?.profilePicture ? (
                    <img src={`http://localhost:5000${service.freelancerId.profilePicture}`} alt="" style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover" }} />
                  ) : (
                    <div className="avatar" aria-hidden="true" style={{ width: "28px", height: "28px", borderRadius: "10px" }}></div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/profile/${service.freelancerId?._id}`} style={{ fontWeight: 650, color: "var(--primary)" }}>{service.freelancerId?.name}</Link>
                  </div>
                </div>
              </div>
              {user?.role === "pyme" && (
                <div className="stack-8">
                  <button
                    className={`btn btn-block ${isInCart(service._id) ? 'btn-ghost' : 'btn-secondary'}`}
                    onClick={() => addToCart(service)}
                    disabled={isInCart(service._id)}
                  >
                    {isInCart(service._id) ? '✓ En carrito' : '🛒 Agregar al carrito'}
                  </button>
                  <Link className="btn btn-primary btn-block" to={`/contracts/new/${service._id}`}>
                    Contratar servicio
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}

export default ServiceDetail;