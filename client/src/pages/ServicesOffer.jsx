import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import Layout from "../components/Layout";
import api from "../services/api";

function ServicesOffer() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxDelivery, setMaxDelivery] = useState("");
  const [sort, setSort] = useState("");
  const { user } = useContext(AuthContext);
  const { addToCart, isInCart, cart } = useContext(CartContext);

  const fetchServices = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minPrice) params.minPrice = minPrice;
      if (maxDelivery) params.maxDelivery = maxDelivery;
      if (sort) params.sort = sort;

      const response = await api.get("/services", { params });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchServices();
  }, []);

  const handleFilter = () => {
    fetchServices();
  };

  const handleClear = () => {
    setCategory("");
    setMaxPrice("");
    setMinPrice("");
    setMaxDelivery("");
    setSort("");
    setTimeout(() => fetchServices(), 0);
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <div className="page-title">
            <h1>Explorar servicios</h1>
            <p>Encuentra freelancers y contrata por proyecto</p>
          </div>
        </div>
        {user?.role === 'pyme' && cart.length > 0 && (
          <div className="topbar-right">
            <Link className="btn btn-primary btn-sm" to="/cart">
              🛒 Carrito ({cart.length})
            </Link>
          </div>
        )}
      </header>

      <main className="content">
        <div className="grid services">
          <aside className="filters panel" aria-label="Filtros de búsqueda">
            <div className="stack-16">
              <div className="stack-8">
                <strong>Filtros</strong>
                <p className="muted">Ajusta la búsqueda según tus necesidades.</p>
              </div>

              <div className="field">
                <label className="label" htmlFor="area">Área</label>
                <select className="select" id="area" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Todas</option>
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
                <label className="label" htmlFor="minPrecio">Presupuesto mínimo</label>
                <input className="input" id="minPrecio" type="number" placeholder="Ej: 50" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </div>

              <div className="field">
                <label className="label" htmlFor="presupuesto">Presupuesto máximo</label>
                <input className="input" id="presupuesto" type="number" placeholder="Ej: 250" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>

              <div className="field">
                <label className="label" htmlFor="maxEntrega">Entrega máxima (días)</label>
                <input className="input" id="maxEntrega" type="number" placeholder="Ej: 7" value={maxDelivery} onChange={(e) => setMaxDelivery(e.target.value)} />
              </div>

              <div className="field">
                <label className="label" htmlFor="orden">Ordenar por</label>
                <select className="select" id="orden" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">Más recientes</option>
                  <option value="price_asc">Menor precio</option>
                  <option value="price_desc">Mayor precio</option>
                  <option value="delivery_asc">Entrega más rápida</option>
                  <option value="rating_desc">Mejor calificación</option>
                </select>
              </div>

              <div className="inline">
                <button className="btn btn-primary btn-sm" type="button" onClick={handleFilter}>Aplicar</button>
                <button className="btn btn-ghost btn-sm" type="button" onClick={handleClear}>Limpiar</button>
              </div>
            </div>
          </aside>

          <section className="list" aria-label="Resultados">
            <div className="inline" style={{ marginBottom: "12px" }}>
              <p className="muted">{services.length} servicios encontrados</p>
              <span className="badge">Catálogo</span>
            </div>

            {services.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No se encontraron servicios</h3>
                <p>Intenta con otros filtros o vuelve más tarde.</p>
              </div>
            ) : (
              <div className="grid" style={{ gap: "14px" }}>
                {services.map((service) => (
                  <article className="service-card" key={service._id}>
                    <div className="service-head">
                      <h3>{service.title}</h3>
                      <span className="price">${service.price}</span>
                    </div>

                    {service.images && service.images.length > 0 && (
                      <img
                        src={`http://localhost:5000${service.images[0]}`}
                        alt=""
                        style={{ width: '100%', height: '140px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                    )}

                    <div className="service-meta">
                      <span className="pill">{service.category}</span>
                      <span className="pill">Entrega: {service.deliveryDays} días</span>
                      {service.revisionsIncluded > 0 && (
                        <span className="pill">{service.revisionsIncluded} revisiones</span>
                      )}
                    </div>

                    <p className="muted">{service.description}</p>

                    {service.avgRating !== undefined && service.avgRating > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '13px' }}>⭐ {service.avgRating.toFixed(1)} ({service.ratingCount})</span>
                      </div>
                    )}

                    <div className="inline">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {service.freelancerId?.profilePicture ? (
                          <img
                            src={`http://localhost:5000${service.freelancerId.profilePicture}`}
                            alt=""
                            style={{ width: "28px", height: "28px", borderRadius: "10px", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="avatar" aria-hidden="true" style={{ width: "28px", height: "28px", borderRadius: "10px" }}></div>
                        )}
                        <span style={{ fontSize: "13px" }}>{service.freelancerId?.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {user?.role === 'pyme' && (
                          <button
                            className={`btn btn-sm ${isInCart(service._id) ? 'btn-ghost' : 'btn-primary'}`}
                            onClick={() => addToCart(service)}
                            disabled={isInCart(service._id)}
                          >
                            {isInCart(service._id) ? '✓ En carrito' : '🛒 Agregar'}
                          </button>
                        )}
                        <Link className="btn btn-secondary btn-sm" to={`/services/${service._id}`}>Ver detalle</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default ServicesOffer;