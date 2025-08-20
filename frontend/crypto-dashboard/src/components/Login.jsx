import { useState } from "react";
import '../styles/authModal.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ApiURL = import.meta.env.VITE_BACKEND_API_URL
  const navigate = useNavigate()

  async function handleSubmit (e) {
    e.preventDefault();
    // Simulamos login
    try {
      const response = await axios.post(`${ApiURL}/auth/login`,{
        email: email,
        password: password
      });
      console.log(response)
      //si la respuesta es 200 se guarda la data del user en localstorage
      if(response.status == 200){
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", JSON.stringify(response.data.token));

        if (onLogin) onLogin();
        navigate('/')
      }
    } catch (error) {
      console.log("HOLA", error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
