import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import axios from 'axios';
import HighlightSection from '../components/HighlightSection';
const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [favorites, setFavorites] = useState(null)
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null)
    

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEmail(parsedUser.email || '');
            setName(parsedUser.name || '');
            setCurrentUser(parsedUser)
        } else {
            // Si no hay usuario logueado, redirigir a login
            navigate('/');
        }
    }, []);

    //Obtener favoritos
    useEffect(() => {
 
  const fetchFavorites = async () => {
    try {
        
      const favoritesResponse = await axios.get(`${ApiURL}/auth/favorites`, {
        params: { id: currentUser.id }
      });
      setFavorites(favoritesResponse.data.favorites);
      console.log(favorites.join(','))
    } catch (err) {
      console.error("Error al obtener favoritos", err);
    }
  };
  fetchFavorites();
}, []);

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
        window.location.reload();

        navigate('/');
    }

    return (
        <div className="dashboard">
            
            <div className='data-container'>
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
                 </section>
                <section className='favorites'>
                
                {favorites ? 
                <HighlightSection 
                    title='Monedas favoritas'
                    endpoint={`/coins/markets`}
                    params={{vs_currency:'usd', ids: favorites.join(',')}}
                    site='favorites-dashboard'
                />
                : <p>No hay favoritos en la cuenta</p>
                }
                </section>
                </div>
                <div className='button-container'>
                <button onClick={handleSave}>Guardar cambios</button>
                <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
                </div>
           
        </div>
    )
}
