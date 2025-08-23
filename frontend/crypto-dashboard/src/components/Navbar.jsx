import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "../styles/navbar.css";

export default function Navbar() {
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  


// verificar si hay un usuario logueado
  let storedUser = sessionStorage.getItem("user");
  let parsedUser = null;
  if (storedUser && storedUser !== "undefined") {
    parsedUser = JSON.parse(storedUser);
  }
  const [user, setUser] = useState(parsedUser);


  // funciones de login y logout
  const handleAuthSuccess = (userData) => {
    if(userData) setUser(userData);
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <header className="header">
      <h1 onClick={() => navigate('/')} className="logo">CryptoMetrics</h1>
      <nav className="nav">
        <button className="nav-btn">Criptomonedas</button>
        <button onClick={() => navigate('/highlights')} className="nav-btn">Destacado</button>
        <button className="nav-btn">Sobre nosotros</button>

        {user ? (
          <button
            className="nav-btn user-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cuenta
          </button>
        ) : (
          <button
            className="nav-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Iniciar sesión
          </button>
        )}
      </nav>

      {/* Modal de login */}
      <AuthModal isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onAuth={handleAuthSuccess}
      />
    </header>
  );
}
