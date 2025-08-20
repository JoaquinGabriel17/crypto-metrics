import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Datos de configuración ficticios
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEmail(parsedUser.email || '');
        } else {
            // Si no hay usuario logueado, redirigir a login
            navigate('/login');
        }
    }, [navigate]);

    const handleSave = () => {
        // Guardamos los cambios en localStorage (simulación)
        const updatedUser = { ...user, email, notifications, theme };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Configuración guardada ✅');
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <div className="dashboard">
            <h1>Bienvenido, {user?.username}</h1>
            
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
                    Notificaciones:
                    <input 
                        type="checkbox" 
                        checked={notifications} 
                        onChange={(e) => setNotifications(e.target.checked)} 
                    />
                </label>

                <label>
                    Tema:
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                    </select>
                </label>

                <button onClick={handleSave}>Guardar cambios</button>
                <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
            </section>
        </div>
    )
}
