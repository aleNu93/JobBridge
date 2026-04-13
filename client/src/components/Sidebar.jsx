import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isPyme = user?.role === "pyme";

  const navItems = isPyme
    ? [
        {
          path: "/dashboard/pyme",
          icon: "🏠",
          label: "Dashboard",
          sub: "Resumen general",
        },
        {
          path: "/services",
          icon: "🔎",
          label: "Explorar servicios",
          sub: "Catálogo disponible",
        },
        {
          path: "/cart",
          icon: "🛒",
          label: "Carrito",
          sub: "Servicios seleccionados",
        },
        {
          path: "/contracts",
          icon: "📄",
          label: "Mis contratos",
          sub: "Activos e historial",
        },
        {
          path: "/chat",
          icon: "💬",
          label: "Mensajes",
          sub: "Comunicación directa",
        },
        {
          path: "/rating",
          icon: "⭐",
          label: "Calificaciones",
          sub: "Tu experiencia",
        },
        {
          path: "/profile",
          icon: "👤",
          label: "Perfil",
          sub: "Datos de la empresa",
        },
      ]
    : [
        {
          path: "/dashboard/freelancer",
          icon: "🏠",
          label: "Dashboard",
          sub: "Resumen de actividad",
        },
        {
          path: "/services",
          icon: "🔎",
          label: "Explorar servicios",
          sub: "Ver la competencia",
        },
        {
          path: "/services/manage",
          icon: "🧰",
          label: "Mis servicios",
          sub: "Publicados y borradores",
        },
        {
          path: "/requests",
          icon: "📥",
          label: "Solicitudes",
          sub: "Entrantes y estado",
        },
        {
          path: "/contracts",
          icon: "📄",
          label: "Mis contratos",
          sub: "Activos e historial",
        },
        {
          path: "/chat",
          icon: "💬",
          label: "Mensajes",
          sub: "Comunicación directa",
        },
        {
          path: "/rating",
          icon: "⭐",
          label: "Calificaciones",
          sub: "Tu reputación",
        },
        {
          path: "/profile",
          icon: "👤",
          label: "Perfil",
          sub: "Datos y portafolio",
        },
      ];

  return (
    <aside className="sidebar" aria-label="Menú lateral">
      <div className="sidebar-inner">
        <div className="brand">
          <div className="brand-logo brand-logo--plain" aria-hidden="true">
            <img src="/JobBridgeLogo.png" alt="" />
          </div>
          <div className="brand-title">
            <strong>JobBridge</strong>
            <span>{isPyme ? "Panel PYME" : "Panel Freelancer"}</span>
          </div>
        </div>

        <nav className="nav" aria-label="Navegación principal">
          <div className="nav-section-title">Principal</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              to={item.path}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-text">
                <strong>{item.label}</strong>
                <span>{item.sub}</span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer" aria-label="Usuario" style={{ marginTop: 'auto', flexShrink: 0 }}>
          <div className="user-pill">
            {user?.profilePicture ? (
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Avatar"
                style={{ width: '40px', height: '40px', borderRadius: '14px', objectFit: 'cover' }}
              />
            ) : (
              <div className="avatar" aria-hidden="true"></div>
            )}
            <div className="user-meta">
              <strong>{user?.name}</strong>
              <span>{isPyme ? "PYME" : "Freelancer"}</span>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm btn-block"
            onClick={logout}
            style={{ marginTop: "8px" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
