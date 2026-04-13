import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="auth-shell auth-bg-1" aria-label="Inicio de sesión">
      <section className="auth-card">
        <header className="auth-brand auth-brand--stack">
          <div className="auth-logo">
            <img src="/JobBridgeLogo.png" alt="JobBridge" />
          </div>
          <div className="auth-heading">
            <h1 className="auth-title">Iniciar sesión</h1>
            <p className="auth-subtitle">Accede con tu correo y contraseña</p>
          </div>
        </header>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '14px' }}>
            <div className="alert-icon" aria-hidden="true">⚠️</div>
            <div><p>{error}</p></div>
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Correo</label>
            <input
              className="input"
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              className="input"
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary btn-block" type="submit">Ingresar</button>

          <div className="inline" style={{ marginTop: '6px' }}>
            <Link className="btn btn-ghost btn-sm" to="/recovery">¿Olvidaste tu contraseña?</Link>
            <Link className="btn btn-secondary btn-sm" to="/register">Crear cuenta</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;