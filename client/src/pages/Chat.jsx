import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import api from "../services/api";

function Chat() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeContract, setActiveContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get("/messages/conversations");
        setConversations(response.data);
        if (response.data.length > 0 && !activeContract) {
          setActiveContract(response.data[0].contract);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeContract) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${activeContract._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeContract]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContract) return;

    try {
      const response = await api.post("/messages", {
        contractId: activeContract._id,
        text: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getOtherParty = (contract) => {
    if (user?.role === "pyme") {
      return {
        name: contract.freelancerId?.name || "Freelancer",
        id: contract.freelancerId?._id,
      };
    }
    return {
      name: contract.clientId?.name || "Cliente",
      id: contract.clientId?._id,
    };
  };

  return (
    <Layout>
      <header className="topbar" aria-label="Barra superior">
        <div className="page-title">
          <h1>Mensajes</h1>
          <p>Comunicación directa y segura</p>
        </div>
      </header>

      <main className="content">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "0.9fr 1.6fr 0.7fr",
            gap: "14px",
            height: "calc(100vh - 160px)",
          }}
        >
          <section
            className="panel"
            aria-label="Conversaciones"
            style={{ overflowY: "auto" }}
          >
            <strong>Conversaciones</strong>
            <div className="stack-8" style={{ marginTop: "12px" }}>
              {conversations.length === 0 ? (
                <p className="muted" style={{ fontSize: "13px" }}>
                  No tienes conversaciones aún.
                </p>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherParty(conv.contract);
                  const isActive = activeContract?._id === conv.contract._id;
                  return (
                    <div
                      key={conv.contract._id}
                      onClick={() => setActiveContract(conv.contract)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px",
                        borderRadius: "14px",
                        cursor: "pointer",
                        background: isActive
                          ? "rgba(13, 31, 64, 0.05)"
                          : "transparent",
                        border: isActive
                          ? "1px solid rgba(13, 31, 64, 0.12)"
                          : "1px solid transparent",
                        transition: "background 160ms ease",
                      }}
                    >
                      {(() => {
                          const pic = user?.role === 'pyme' ? conv.contract.freelancerId?.profilePicture : conv.contract.clientId?.profilePicture;
                          return pic ? (
                            <img src={`http://localhost:5000${pic}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
                          ) : (
                            <div className="avatar" aria-hidden="true" style={{ flexShrink: 0 }}></div>
                          );
                        })()}
                        
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {other.name}
                        </div>
                        <div
                          className="muted"
                          style={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {conv.contract.serviceId?.title ||
                            conv.contract.projectName}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span
                            className="badge info"
                            style={{ marginTop: "4px", fontSize: "11px" }}
                          >
                            {conv.unreadCount} nuevo
                            {conv.unreadCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section
            className="panel"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {activeContract ? (
              <>
                <div
                  className="inline"
                  style={{
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {(() => {
                      const pic =
                        user?.role === "pyme"
                          ? activeContract.freelancerId?.profilePicture
                          : activeContract.clientId?.profilePicture;
                      return pic ? (
                        <img
                          src={`http://localhost:5000${pic}`}
                          alt=""
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "14px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="avatar"></div>
                      );
                    })()}
                    <div>
                      <strong>{getOtherParty(activeContract).name}</strong>
                      <p className="muted" style={{ fontSize: "12px" }}>
                        {user?.role === "pyme" ? "Freelancer" : "Cliente"}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="stack-8"
                  style={{ flex: 1, overflowY: "auto", paddingTop: "8px" }}
                >
                  {messages.length === 0 ? (
                    <p
                      className="muted"
                      style={{
                        fontSize: "13px",
                        textAlign: "center",
                        marginTop: "20px",
                      }}
                    >
                      No hay mensajes aún. Inicia la conversación.
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        style={{
                          maxWidth: "75%",
                          padding: "10px 14px",
                          borderRadius: "14px",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          alignSelf:
                            msg.senderId?._id === user?.id ||
                            msg.senderId === user?.id
                              ? "flex-end"
                              : "flex-start",
                          marginLeft:
                            msg.senderId?._id === user?.id ||
                            msg.senderId === user?.id
                              ? "auto"
                              : "0",
                          background:
                            msg.senderId?._id === user?.id ||
                            msg.senderId === user?.id
                              ? "var(--primary)"
                              : "var(--surface-2)",
                          color:
                            msg.senderId?._id === user?.id ||
                            msg.senderId === user?.id
                              ? "var(--primary-contrast)"
                              : "var(--text)",
                          border:
                            msg.senderId?._id === user?.id ||
                            msg.senderId === user?.id
                              ? "none"
                              : "1px solid var(--border)",
                        }}
                      >
                        {msg.text}
                        <div
                          style={{
                            fontSize: "10px",
                            marginTop: "4px",
                            opacity: 0.7,
                            textAlign: "right",
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="inline"
                  style={{
                    paddingTop: "8px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <input
                    className="input"
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-primary btn-sm" type="submit">
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: "100%",
                }}
              >
                <p className="muted">
                  Selecciona una conversación para comenzar.
                </p>
              </div>
            )}
          </section>

          <section className="panel" style={{ overflowY: "auto" }}>
            {activeContract ? (
              <div className="stack-12">
                <strong>Servicio</strong>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {activeContract.serviceId?.title ||
                      activeContract.projectName}
                  </p>
                  <p className="muted" style={{ fontSize: "12px" }}>
                    Precio: ${activeContract.total}
                  </p>
                </div>
                <span
                  className={`badge ${activeContract.status === "completed" ? "success" : activeContract.status === "in_progress" ? "info" : "warning"}`}
                >
                  {activeContract.status === "completed"
                    ? "Completado"
                    : activeContract.status === "in_progress"
                      ? "En progreso"
                      : activeContract.status === "accepted"
                        ? "Aceptado"
                        : "Pendiente"}
                </span>
              </div>
            ) : (
              <p className="muted" style={{ fontSize: "13px" }}>
                Selecciona una conversación.
              </p>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default Chat;
