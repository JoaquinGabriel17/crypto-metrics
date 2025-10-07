import Loading from "./Loading";
import '../styles/highlights.css'
import { useEffect, useState } from "react";
import axios from "axios";
const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API

export default function CategoryTable({ site, endpoint, params, title }) {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
 
  useEffect(() => {
    setLoading(true)
    const fetch = async () => {
      try {
        let res = null
        
          res = await axios.get(`${ApiURL}/data/market-data`, {
            params: {
              endpoint: endpoint,
              site,
              ...params
            }
      });
        setCategories(res.data.slice(0,10));
        setLoading(false)
      } catch (err) {
        console.error(`Error fetching ${title}:`, err);
        setLoading(false)
      }
    };
    fetch();
  }, [endpoint, params, title]);

  return (
    <div className="category-table-container">
      <h1>{title}</h1>
    
    <table className="crypto-table-highlights">
      
      
      <thead>
        <tr>
          <th>Name</th>
          <th>Market Cap</th>
          {categories.length > 0 && categories[0].volume && <th>Volume</th>}
          {categories.length > 0 && categories[0].volume_24h && <th>24h Volume</th>}
          <th>24h Market Cap</th>
          {categories.length > 0 && categories[0].market_cap_1h_change && <th>1h Market Cap</th>}
          {categories.length > 0 && categories[0].top_3_coins && <th>Top Coins</th>} 
          {categories.length > 0 && categories[0].coins_count && <th># of coins</th>} 
          {categories.length > 0 && categories[0].sparkline && <th>Ult. 7 días</th>}
        </tr>
      </thead>
      {loading ? 
      <tbody className="tbody-highlights">
        <tr>
          <td colSpan="7" style={{ textAlign: "center" }}>
            <Loading />
          </td>
        </tr>
      </tbody>  
      :
      <tbody className="tbody-highlights">
        {categories.map((category, index) => (
          <tr key={index}>
            <td className="coin-name">{category.name}</td>
            <td>{category.market_cap.toLocaleString()}</td>
            {category.volume && <td>{category.volume.toLocaleString()}</td>}
            {category.volume_24h && <td>{category.volume_24h?.toLocaleString()}</td>}
            <td className={category.market_cap_change_24h >= 0 ? "positive" : "negative"}>{category.market_cap_change_24h?.toFixed(1)}%</td>
            {category.market_cap_1h_change && <td className={category.market_cap_1h_change >= 0 ? "positive" : "negative"}>{category.market_cap_1h_change?.toFixed(1)}%</td>}

            {category.top_3_coins && <td> {category.top_3_coins.map(coin => (
              <img src={coin} alt="monedaTop3" key={coin} className="coin-icon"></img>))
            }</td>}
            {category.coins_count && <td>{category.coins_count}</td>}
            {category.sparkline && <td><img src={category.sparkline} alt="categorySparkline" key={category.sparkline}></img></td>}
          </tr>
        ))}
      </tbody>}
    </table>
    </div>
  );
}
