import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import axios from 'axios';
const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEmail(parsedUser.email || '');
            setName(parsedUser.name || '');

        } else {
            // Si no hay usuario logueado, redirigir a login
            navigate('/');
        }
    }, [navigate]);

    async function handleSave(){
        // Guardamos los cambios en localStorage (simulación)
        let user = JSON.parse(sessionStorage.getItem("user"));
        let token = sessionStorage.getItem("token")
        console.log(token)
        if(email.length) user.email = email;
        else if(name.length) user.name = name
        else{
            alert('No se detectaron cambios para guardar')
            return
        }
        try {
            const response = await axios.put(`${ApiURL}/auth/update-user`,
            user,
            {
                headers: {
                    Authorization: `Bearer ${token.trim()}`
                }
            })
            alert('Configuración guardada ✅');
            sessionStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            alert('error al guardar los cambios',error)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/');
    }

    return (
        <div className="dashboard">
            <h1>Bienvenido, {user?.name}</h1>
            
            <section className="settings">
                <h2>Configuración de la cuenta</h2>
                <label>
                    Correo electrónico:
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </label>

                 <label>
                    Nombre de usuario:
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </label>

                <button onClick={handleSave}>Guardar cambios</button>
                <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
            </section>
        </div>
    )
}
