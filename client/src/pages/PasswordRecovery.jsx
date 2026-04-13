import { useState } from 'react';
import { Link } from 'react-router-dom';

function PasswordRecovery() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="auth-shell auth-bg-1" aria-label="Recuperar contraseña">
      <section className="auth-card">
        <header className="auth-brand auth-brand--stack">
          <div className="auth-logo">
            <img src="/JobBridgeLogo.png" alt="JobBridge" />
          </div>
          <div className="auth-heading">
            <h1 className="auth-title">Recuperar contraseña</h1>
            <p className="auth-subtitle">Ingresa tu correo para recibir instrucciones</p>
          </div>
        </header>

        {submitted ? (
          <div className="stack-12" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px' }}>📧</div>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Correo enviado</h2>
            <p className="muted">
              Si el correo <strong>{email}</strong> está registrado en JobBridge,
              recibirás instrucciones para restablecer tu contraseña.
            </p>
            <p className="muted" style={{ fontSize: '12px', marginTop: '8px' }}>
              Nota: En este entorno académico, el envío de correos no está habilitado.
              En producción se integraría con un servicio como SendGrid o Nodemailer.
            </p>
            <Link className="btn btn-primary btn-block" to="/login" style={{ marginTop: '14px' }}>
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="recovery-email">Correo electrónico</label>
              <input
                className="input"
                id="recovery-email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <p className="help">Te enviaremos un enlace para restablecer tu contraseña.</p>
            </div>

            <button className="btn btn-primary btn-block" type="submit">
              Enviar instrucciones
            </button>

            <div className="inline" style={{ marginTop: '6px' }}>
              <Link className="btn btn-ghost btn-sm" to="/login">Volver al login</Link>
              <Link className="btn btn-secondary btn-sm" to="/register">Crear cuenta</Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default PasswordRecovery;