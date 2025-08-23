import { useState } from "react";
import '../styles/authModal.css'
import { validateEmail, validatePassword, validateName } from "../utils/validations";
import axios from "axios";

export default function Register({onRegister}) {
  
  const [form, setForm] = useState({ email: "", password: "", confirm: "", name: "" });
  const [errors, setErrors] = useState({});
  const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  async function handleSubmit(e) {
    e.preventDefault();
    let newErrors = {};

    //Validaciones de todos los campos con las funciones importadas de validations.js
    if (!validateEmail(form.email)) newErrors.email = "Email inválido";
    if (!validatePassword(form.password)) newErrors.password = "La contraseña debe tener al menos 6 caracteres, 1 letra y 1 número";
    if (form.password !== form.confirm) newErrors.confirm = "Las contraseñas no coinciden";
    if (!validateName(form.name)) newErrors.name = "El nombre debe tener entre 3 y 20 caracteres y solo letras/números/_";

    setErrors(newErrors);

    //si no hay errores se procede con la consulta al backend para crear usuario
    if (Object.keys(newErrors).length === 0) {
      console.log("Formulario válido ✅", form);
      try {
      const response = await axios.post(`${ApiURL}/auth/register`,{
        email: form.email,
        password: form.password,
        name: form.name
      });
      onRegister() //función para informar a los componentes padres del registro correcto
    } catch (error) {
      alert('Error al crear usuario') 
      console.log(error)
    }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <label>Nombre de usuario</label>
      <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange}/>
      {errors.name && <p>{errors.name}</p>}
      <label>Email</label>
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
      {errors.email && <p>{errors.email}</p>}
      <label>Contraseña</label>
      <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange}/>
      {errors.password && <p>{errors.password}</p>}
      <label>Confirmar la contraseña</label>
      <input type="password" name="confirm" placeholder="Confirmar contraseña" value={form.confirm} onChange={handleChange}/>
      {errors.confirm && <p>{errors.confirm}</p>}
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
