import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

function Rating() {
  const { user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState('');
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myRatings, setMyRatings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractsRes = await api.get('/contracts', { params: { status: 'completed' } });
        setContracts(contractsRes.data);

        if (user?.id) {
          const ratingsRes = await api.get(`/ratings/user/${user.id}`);
          setMyRatings(ratingsRes.data.ratings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedContract) {
      setError('Selecciona un contrato para calificar');
      return;
    }

    if (score === 0) {
      setError('Selecciona una puntuación');
      return;
    }

    try {
      await api.post('/ratings', {
        contractId: selectedContract,
        score,
        comment
      });
      setSuccess('¡Calificación enviada exitosamente!');
      setSelectedContract('');
      setScore(0);
      setComment('');
      setContracts(contracts.filter(c => c._id !== selectedContract));

      if (user?.id) {
        const ratingsRes = await api.get(`/ratings/user/${user.id}`);
        setMyRatings(ratingsRes.data.ratings);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar calificación');
    }
  };

  const getOtherParty = (contract) => {
    if (user?.role === 'pyme') {
      return contract.freelancerId?.name || 'Freelancer';
    }
    return contract.clientId?.name || 'Cliente';
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="topbar-left">
          <div className="page-title">
            <h1>Calificaciones</h1>
            <p>Evalúa tu experiencia con el servicio</p>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '18px', alignItems: 'start' }}>
          <div className="stack-16">
            <div className="card" aria-label="Nueva calificación">
              <div className="card-header">
                <h2 style={{ fontSize: '15px', margin: 0 }}>Nueva calificación</h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" style={{ marginBottom: '14px' }}>
                    <div className="alert-icon" aria-hidden="true">⚠️</div>
                    <div><p>{error}</p></div>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" style={{ marginBottom: '14px' }}>
                    <div className="alert-icon" aria-hidden="true">✅</div>
                    <div><p>{success}</p></div>
                  </div>
                )}

                {contracts.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">⭐</div>
                    <h3>No hay contratos por calificar</h3>
                    <p>Solo puedes calificar contratos completados.</p>
                  </div>
                ) : (
                  <form className="form" onSubmit={handleSubmit}>
                    <div className="field">
                      <label className="label" htmlFor="contract-select">Selecciona un contrato</label>
                      <select
                        className="select"
                        id="contract-select"
                        value={selectedContract}
                        onChange={(e) => setSelectedContract(e.target.value)}
                        required
                      >
                        <option value="">Selecciona un contrato completado</option>
                        {contracts.map((contract) => (
                          <option key={contract._id} value={contract._id}>
                            {contract.projectName} — {getOtherParty(contract)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label className="label">Puntuación</label>
                      <div className="star-rating">
                        <input type="radio" id="star-5" name="rating" value="5" checked={score === 5} onChange={() => setScore(5)} />
                        <label htmlFor="star-5">★</label>
                        <input type="radio" id="star-4" name="rating" value="4" checked={score === 4} onChange={() => setScore(4)} />
                        <label htmlFor="star-4">★</label>
                        <input type="radio" id="star-3" name="rating" value="3" checked={score === 3} onChange={() => setScore(3)} />
                        <label htmlFor="star-3">★</label>
                        <input type="radio" id="star-2" name="rating" value="2" checked={score === 2} onChange={() => setScore(2)} />
                        <label htmlFor="star-2">★</label>
                        <input type="radio" id="star-1" name="rating" value="1" checked={score === 1} onChange={() => setScore(1)} />
                        <label htmlFor="star-1">★</label>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label" htmlFor="comment">Comentario</label>
                      <textarea
                        className="textarea"
                        id="comment"
                        placeholder="Describe tu experiencia con este servicio..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ minHeight: '100px' }}
                      ></textarea>
                    </div>

                    <button className="btn btn-primary btn-block" type="submit">
                      Enviar calificación
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="stack-16">
            <div className="card" aria-label="Calificaciones recibidas">
              <div className="card-header">
                <h2 style={{ fontSize: '15px', margin: 0 }}>Mis calificaciones recibidas</h2>
              </div>
              <div className="card-body">
                {myRatings.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">📝</div>
                    <h3>Sin calificaciones aún</h3>
                    <p>Cuando te califiquen, aparecerán aquí.</p>
                  </div>
                ) : (
                    <div className="stack-12">
                    {myRatings.map((rating) => (
                      <div
                        key={rating._id}
                        style={{
                          paddingBottom: "10px",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div className="inline" style={{ marginBottom: "4px" }}>
                          <strong style={{ fontSize: "13px" }}>
                            {rating.fromUserId?.name}
                          </strong>
                          <span style={{ fontSize: "14px" }}>
                            {"⭐".repeat(rating.score)}
                          </span>
                        </div>
                        <p className="muted" style={{ fontSize: "12px", marginBottom: "4px" }}>
                          Contrato: {rating.contractId?.projectName || 'Sin nombre'}
                        </p>
                        {rating.comment && (
                          <p className="muted" style={{ fontSize: "13px" }}>
                            {rating.comment}
                          </p>
                        )}
                        <p
                          className="muted"
                          style={{ fontSize: "11px", marginTop: "6px" }}
                        >
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Rating;