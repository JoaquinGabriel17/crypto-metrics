import axios from 'axios';
import { useState, useEffect } from 'react';
import '../styles/dataTable.css'
import Loading from './Loading.jsx'

const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function HighlightSection({ title, endpoint, params, site }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  
  console.log(params)
 
  useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      try {
        let res = null
        if(site === 'trending-coins') {
          res = await axios.get(`${ApiURL}/crypto/trending-coins`);
        }
        else {
          res = await axios.get(`${ApiURL}/crypto/market-data`, {
            params: {
              endpoint: endpoint,
              site,
              ...params
            }
      });}

        setCoins(res.data);
        setLoading(false)
      } catch (err) {
        console.error(`Error fetching ${title}:`, err);
        setLoading(false)
      }
    };
    fetch();
  }, [endpoint, params, title]);

  return (
      <div className="highlights-table-container">
        <h1>{title}</h1>
            <table className="crypto-table-highlights">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Coin</th>
                  <th>Price</th>
                  <th>24h</th>               
                </tr>
              </thead>
              <tbody className={loading ? "tbody-loading" : "tbody-highlights"}>
                {loading ? <Loading/> :
                coins.map((coin, index) => (
                  <tr key={coin.id}>
                  <td>{index + 1}</td>
                    <td className="coin-cell">
                      <div className='coin-cell-contain'>
                      <img src={coin.image} alt={coin.name} className="coin-icon" />
                      <span className="coin-name">{coin.name}</span>
                      <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </td>
                    <td>${coin.current_price.toLocaleString()}</td>                  
                    <td className={coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}>
                      {coin.price_change_percentage_24h?.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
  );
}