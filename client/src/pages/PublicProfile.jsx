import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState({ ratings: [], average: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/users/${userId}`);
        setProfile(profileRes.data);

        const ratingsRes = await api.get(`/ratings/user/${userId}`);
        setRatings(ratingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  if (!profile) {
    return <Layout><main className="content"><p>Cargando...</p></main></Layout>;
  }

  return (
    <Layout>
      <header className="topbar">
        <div className="topbar-left">
          <button className="btn btn-ghost btn-sm" onClick={() => window.history.back()}>← Volver</button>
          <div className="page-title">
            <h1>Perfil de {profile.name}</h1>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="panel" style={{ marginBottom: '14px' }}>
          <div className="inline">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {profile.profilePicture ? (
                <img src={`http://localhost:5000${profile.profilePicture}`} alt="Profile" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
              ) : (
                <div className="avatar" style={{ width: '64px', height: '64px' }}></div>
              )}
              <div>
                <h2 style={{ margin: 0 }}>{profile.name} {profile.lastname1} {profile.lastname2}</h2>
                <p className="muted">{profile.role === 'pyme' ? 'PYME' : 'Freelancer'}</p>
              </div>
            </div>
            {ratings.total > 0 && (
              <span className="badge">⭐ {ratings.average} ({ratings.total} calificaciones)</span>
            )}
          </div>
        </section>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <section className="panel">
            <div className="stack-12">
              <strong>Información de contacto</strong>
              <div className="stack-8">
                <div className="inline">
                  <span className="muted" style={{ fontSize: '13px' }}>Email</span>
                  <span style={{ fontSize: '13px' }}>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="inline">
                    <span className="muted" style={{ fontSize: '13px' }}>Teléfono</span>
                    <span style={{ fontSize: '13px' }}>{profile.phone}</span>
                  </div>
                )}
                <div className="inline">
                  <span className="muted" style={{ fontSize: '13px' }}>Rol</span>
                  <span style={{ fontSize: '13px' }}>{profile.role === 'pyme' ? 'PYME' : 'Freelancer'}</span>
                </div>
                <div className="inline">
                  <span className="muted" style={{ fontSize: '13px' }}>Miembro desde</span>
                  <span style={{ fontSize: '13px' }}>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </section>

          {profile.role === 'pyme' && profile.company?.name && (
            <section className="panel">
              <div className="stack-12">
                <strong>Datos de la empresa</strong>
                <div className="stack-8">
                  <div className="inline">
                    <span className="muted" style={{ fontSize: '13px' }}>Empresa</span>
                    <span style={{ fontSize: '13px' }}>{profile.company.name}</span>
                  </div>
                  {profile.company.industry && (
                    <div className="inline">
                      <span className="muted" style={{ fontSize: '13px' }}>Industria</span>
                      <span style={{ fontSize: '13px' }}>{profile.company.industry}</span>
                    </div>
                  )}
                  {profile.company.size && (
                    <div className="inline">
                      <span className="muted" style={{ fontSize: '13px' }}>Tamaño</span>
                      <span style={{ fontSize: '13px' }}>{profile.company.size}</span>
                    </div>
                  )}
                  {profile.company.address && (
                    <div className="inline">
                      <span className="muted" style={{ fontSize: '13px' }}>Dirección</span>
                      <span style={{ fontSize: '13px' }}>{profile.company.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {profile.role === 'freelancer' && profile.skills?.length > 0 && (
            <section className="panel">
              <div className="stack-12">
                <strong>Habilidades</strong>
                <div className="inline" style={{ flexWrap: 'wrap', justifyContent: 'flex-start', gap: '8px' }}>
                  {profile.skills.map((skill, index) => (
                    <span className="pill" key={index}>{skill}</span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {ratings.ratings.length > 0 && (
            <section className="panel">
              <div className="stack-12">
                <strong>Calificaciones recibidas</strong>
                {ratings.ratings.map((rating) => (
                  <div key={rating._id} style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                    <div className="inline" style={{ marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px' }}>{rating.fromUserId?.name}</strong>
                      <span style={{ fontSize: '14px' }}>{'⭐'.repeat(rating.score)}</span>
                    </div>
                    {rating.comment && (
                      <p className="muted" style={{ fontSize: '13px' }}>{rating.comment}</p>
                    )}
                    <p className="muted" style={{ fontSize: '11px', marginTop: '4px' }}>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default PublicProfile;