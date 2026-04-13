import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../services/authService';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('pyme');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('La contraseña debe contener al menos una letra mayúscula');
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError('La contraseña debe contener al menos una letra minúscula');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
      return;
    }


    if (!/[0-9]/.test(password)) {
      setError('La contraseña debe contener al menos un número');
      return;
    }

    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const data = await registerUser(name, email, password, role);
      login(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="auth-shell auth-bg-1" aria-label="Registro">
      <section className="auth-card">
        <header className="auth-brand auth-brand--stack">
          <div className="auth-logo">
            <img src="/JobBridgeLogo.png" alt="JobBridge" />
          </div>
          <div className="auth-heading">
            <h1 className="auth-title">Crear cuenta</h1>
            <p className="auth-subtitle">Regístrate para comenzar a usar JobBridge</p>
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
            <label className="label" htmlFor="name">Nombre completo</label>
            <input
              className="input"
              id="name"
              type="text"
              placeholder="Tu nombre y apellido"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
            />
            <p className="help">Mínimo 8 caracteres en total, una mayúscula, una minúscula, un caracter especial y un número.</p>
          </div>

          <div className="field">
            <label className="label" htmlFor="password2">Confirmar contraseña</label>
            <input
              className="input"
              id="password2"
              type="password"
              placeholder="Repite tu contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <hr className="hr" style={{ margin: '6px 0' }} />

          <p className="help" style={{ marginTop: 0 }}>
            Selecciona tu rol. Esto define tu experiencia dentro de la plataforma.
          </p>

          <div className="role-switch" aria-label="Seleccionar rol para registro">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="pyme"
                checked={role === 'pyme'}
                onChange={(e) => setRole(e.target.value)}
              />
              <span className="role-chip">🏢</span>
              <span>
                <strong>PYME</strong><br />
                <span className="muted">Contrata servicios</span>
              </span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={role === 'freelancer'}
                onChange={(e) => setRole(e.target.value)}
              />
              <span className="role-chip">🧑‍💻</span>
              <span>
                <strong>Freelancer</strong><br />
                <span className="muted">Ofrece servicios</span>
              </span>
            </label>
          </div>

          <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: '6px' }}>
            Crear cuenta
          </button>

          <div className="inline" style={{ marginTop: '6px' }}>
            <Link className="btn btn-ghost btn-sm" to="/login">Ya tengo cuenta</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Register;