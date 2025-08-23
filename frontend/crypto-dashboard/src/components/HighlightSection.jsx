import axios from 'axios';

const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function HighlightSection({ title, endpoint, params }) {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}${endpoint}`, { params });
        setCoins(res.data);
      } catch (err) {
        console.error(`Error fetching ${title}:`, err);
      }
    };
    fetch();
  }, [endpoint, params, title]);

  return (
    <div className="highlight-section">
      <h3>{title}</h3>
      <ul>
        {coins.slice(0, 10).map((coin, idx) => (
          <li key={coin.id || idx}>
            {coin.name} — {coin.current_price ? `$${coin.current_price.toLocaleString()}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}