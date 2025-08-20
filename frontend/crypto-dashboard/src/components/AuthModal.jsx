import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/authModal.css";

export default function AuthModal({ isOpen, onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        
        {/* Tabs */}
        <div className="auth-tabs">
          <button 
            className={isLogin ? "active" : "inactive"} 
            onClick={() => setIsLogin(true)}
          >
            Iniciar sesión
          </button>
          <button 
            className={!isLogin ? "active" : "inactive"} 
            onClick={() => setIsLogin(false)}
          >
            Crear cuenta
          </button>
        </div>

        {/* Contenido dinámico */}
        {isLogin 
          ? <Login onLogin={onAuth} /> 
          : <Register onRegister={onAuth} />}
      </div>
    </div>
  );
}
