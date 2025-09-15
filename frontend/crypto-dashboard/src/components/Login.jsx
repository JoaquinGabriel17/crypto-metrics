import { useState } from "react";
import '../styles/authModal.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API
  const navigate = useNavigate()

  //función al hacer submit
  async function handleSubmit (e) {
    e.preventDefault();
    // intentar login
    try {
      const response = await axios.post(`${ApiURL}/auth/login`,{
        email: email,
        password: password
      });
      //si la respuesta es 200 se guarda la data del user en localstorage
      if(response.status == 200){
        console.log(response.data.user)
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("token",response.data.token);
        onLogin(response.data.user);
        window.location.reload();
      }
      else alert('Error al iniciar sesión')
    } catch (error) {
      console.log(error)
      alert('Error al iniciar sesión', error)
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
