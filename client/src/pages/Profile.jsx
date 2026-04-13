import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../services/api";

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [ratings, setRatings] = useState({ average: 0, total: 0 });
  const [name, setName] = useState("");
  const [lastname1, setLastname1] = useState("");
  const [lastname2, setLastname2] = useState("");
  const [cedula, setCedula] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cedulaJuridica, setCedulaJuridica] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        const p = response.data;
        setProfile(p);
        setName(p.name || "");
        setLastname1(p.lastname1 || "");
        setLastname2(p.lastname2 || "");
        setCedula(p.cedula || "");
        setPhone(p.phone || "");
        setSkills(p.skills?.join(", ") || "");
        setCompanyName(p.company?.name || "");
        setCedulaJuridica(p.company?.cedulaJuridica || "");
        setAddress(p.company?.address || "");
        setIndustry(p.company?.industry || "");
        setSize(p.company?.size || "");

        const ratingsRes = await api.get(`/ratings/user/${p._id}`);
        setRatings(ratingsRes.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const updates = {
        name,
        lastname1,
        lastname2,
        cedula,
        phone,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      if (user?.role === "pyme") {
        updates.company = {
          name: companyName,
          cedulaJuridica,
          address,
          industry,
          size,
        };
      }

      const response = await api.put("/users/me", updates);
      setProfile(response.data);
      setEditing(false);
      setSuccess("Perfil actualizado exitosamente");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    }
  };

  if (!profile) {
    return (
      <Layout>
        <main className="content">
          <p>Cargando...</p>
        </main>
      </Layout>
    );
  }

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('picture', file);

    try {
      const response = await api.post('/users/me/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(response.data);
      updateUser({ profilePicture: response.data.profilePicture });
    } catch (error) {
      console.error('Error uploading picture:', error);
    }
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="page-title">
          <h1>Mi perfil</h1>
          <p>Información de tu cuenta</p>
        </div>
        <div className="topbar-right">
          {!editing && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setEditing(true)}
            >
              Editar perfil
            </button>
          )}
        </div>
      </header>

      <main className="content">
        {success && (
          <div className="alert alert-success" style={{ marginBottom: "14px" }}>
            <div className="alert-icon" aria-hidden="true">
              ✅
            </div>
            <div>
              <p>{success}</p>
            </div>
          </div>
        )}

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

        <section className="panel" style={{ marginBottom: "14px" }}>
          <div className="inline">
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ position: "relative" }}>
                {profile.profilePicture ? (
                  <img
                    src={`http://localhost:5000${profile.profilePicture}`}
                    alt="Profile"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="avatar"
                    style={{ width: "64px", height: "64px" }}
                  ></div>
                )}
                <label
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div>
                <h2 style={{ margin: 0 }}>{profile.name}</h2>
                <p className="muted">
                  {profile.role === "pyme" ? "PYME" : "Freelancer"} · Cuenta
                  activa
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge success">Verificada</span>
              {ratings.total > 0 && (
                <span className="badge">
                  ⭐ {ratings.average} ({ratings.total} calificaciones)
                </span>
              )}
            </div>
          </div>
        </section>

        {!editing ? (
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: "14px" }}
          >
            <section className="panel">
              <div className="stack-12">
                <strong>Información general</strong>
                <div className="stack-8">
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Email
                    </span>
                    <span style={{ fontSize: "13px" }}>{profile.email}</span>
                  </div>
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Nombre
                    </span>
                    <span style={{ fontSize: "13px" }}>{profile.name}</span>
                  </div>
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Apellidos
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {profile.lastname1} {profile.lastname2}
                    </span>
                  </div>
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Cédula
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {profile.cedula || "—"}
                    </span>
                  </div>
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Teléfono
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {profile.phone || "—"}
                    </span>
                  </div>
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Rol
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {profile.role === "pyme" ? "PYME" : "Freelancer"}
                    </span>
                  </div>
                  <div className="inline">
                    <span className="muted" style={{ fontSize: "13px" }}>
                      Miembro desde
                    </span>
                    <span style={{ fontSize: "13px" }}>
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {profile.role === "pyme" ? (
              <section className="panel">
                <div className="stack-12">
                  <strong>Datos de la empresa</strong>
                  <div className="stack-8">
                    <div className="inline">
                      <span className="muted" style={{ fontSize: "13px" }}>
                        Nombre comercial
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {profile.company?.name || "—"}
                      </span>
                    </div>
                    <div className="inline">
                      <span className="muted" style={{ fontSize: "13px" }}>
                        Cédula jurídica
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {profile.company?.cedulaJuridica || "—"}
                      </span>
                    </div>
                    <div className="inline">
                      <span className="muted" style={{ fontSize: "13px" }}>
                        Dirección
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {profile.company?.address || "—"}
                      </span>
                    </div>
                    <div className="inline">
                      <span className="muted" style={{ fontSize: "13px" }}>
                        Industria
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {profile.company?.industry || "—"}
                      </span>
                    </div>
                    <div className="inline">
                      <span className="muted" style={{ fontSize: "13px" }}>
                        Tamaño
                      </span>
                      <span style={{ fontSize: "13px" }}>
                        {profile.company?.size || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="panel">
                <div className="stack-12">
                  <strong>Habilidades</strong>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div
                      className="inline"
                      style={{
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        gap: "8px",
                      }}
                    >
                      {profile.skills.map((skill, index) => (
                        <span className="pill" key={index}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="muted" style={{ fontSize: "13px" }}>
                      Sin habilidades registradas.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="panel">
            <form className="form" onSubmit={handleSave}>
              <strong>Información personal</strong>

              <div
                className="grid"
                style={{ gridTemplateColumns: "1fr 1fr", gap: "14px" }}
              >
                <div className="field">
                  <label className="label" htmlFor="name">
                    Nombre
                  </label>
                  <input
                    className="input"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="lastname1">
                    Primer apellido
                  </label>
                  <input
                    className="input"
                    id="lastname1"
                    type="text"
                    value={lastname1}
                    onChange={(e) => setLastname1(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="lastname2">
                    Segundo apellido
                  </label>
                  <input
                    className="input"
                    id="lastname2"
                    type="text"
                    value={lastname2}
                    onChange={(e) => setLastname2(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="cedula">
                    Cédula
                  </label>
                  <input
                    className="input"
                    id="cedula"
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="phone">
                    Teléfono
                  </label>
                  <input
                    className="input"
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {user?.role === "freelancer" && (
                <>
                  <hr className="hr" />
                  <strong>Habilidades</strong>
                  <div className="field">
                    <label className="label" htmlFor="skills">
                      Habilidades (separadas por coma)
                    </label>
                    <input
                      className="input"
                      id="skills"
                      type="text"
                      placeholder="Diseño UI, Figma, Branding"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <p className="help">
                      Escribe tus habilidades separadas por coma.
                    </p>
                  </div>
                </>
              )}

              {user?.role === "pyme" && (
                <>
                  <hr className="hr" />
                  <strong>Datos de la empresa</strong>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr", gap: "14px" }}
                  >
                    <div className="field">
                      <label className="label" htmlFor="companyName">
                        Nombre comercial
                      </label>
                      <input
                        className="input"
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="cedulaJuridica">
                        Cédula jurídica
                      </label>
                      <input
                        className="input"
                        id="cedulaJuridica"
                        type="text"
                        value={cedulaJuridica}
                        onChange={(e) => setCedulaJuridica(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="address">
                        Dirección
                      </label>
                      <input
                        className="input"
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="industry">
                        Industria
                      </label>
                      <input
                        className="input"
                        id="industry"
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="size">
                        Tamaño
                      </label>
                      <input
                        className="input"
                        id="size"
                        type="text"
                        placeholder="Ej: 5-10 empleados"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <hr className="hr" />

              <div
                className="inline"
                style={{ justifyContent: "flex-end", gap: "10px" }}
              >
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Profile;
