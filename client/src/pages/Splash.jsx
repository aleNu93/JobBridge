import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash" aria-label="Pantalla de bienvenida">
      <section className="splash-card">
        <div className="splash-logo">
          <img src="/JobBridgeLogo.png" alt="JobBridge Logo" />
        </div>
        <h1 className="splash-title">JobBridge</h1>
        <p className="splash-subtitle">
          Conectamos talento joven con PYMES que necesitan servicios
          profesionales de forma ágil y confiable.
        </p>
        <div className="splash-loader" aria-hidden="true"></div>
        <p className="splash-subtitle" style={{ marginTop: '14px' }}>
          Redirigiendo a inicio de sesión...
        </p>
      </section>
    </main>
  );
}

export default Splash;