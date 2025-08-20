import React from "react";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Foooter";

export default function LandingPage() {

  const navigate = useNavigate()

  return (
    <div className="landing">
      <Navbar></Navbar>
      <section className="hero">
        <h2>Monitoreá tus criptomonedas en tiempo real</h2>
        <p>
          Una plataforma simple, rápida y segura para visualizar métricas de
          criptomonedas con gráficos dinámicos.
        </p>
        <div className="hero-buttons">
          <button className="cta-btn primary"
          onClick={() => navigate('/login')}
          >Comenzar ahora</button>
          <button className="cta-btn secondary">Más información</button>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📈 Gráficos en tiempo real</h3>
          <p>Seguimiento minuto a minuto de tus activos digitales.</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Seguridad</h3>
          <p>Tus datos protegidos con autenticación JWT.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Velocidad</h3>
          <p>Actualizaciones instantáneas gracias a WebSockets.</p>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
}
