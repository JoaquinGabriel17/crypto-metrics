import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recuperamos el usuario desde localStorage
  const storedUser = localStorage.getItem("user");
  const [ user, setUser ] = useState(storedUser ? JSON.parse(storedUser) : null)


  // Función que se pasa al AuthModal
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <header className="header">
      <h1 className="logo">CryptoMetrics</h1>
      <nav className="nav">
        <button className="nav-btn">Criptomonedas</button>
        <button className="nav-btn">Precios</button>
        <button className="nav-btn">Sobre nosotros</button>

        {user ? (
          <button
            className="nav-btn user-btn"
            onClick={() => navigate("/dashboard")}
          >
            {user.username}
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
