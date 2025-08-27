import HighlightSection from '../components/HighlightSection.jsx'
import '../styles/highlights.css'

const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function Highlights() {

  return (
    <div className="highlights-container">
      
     
      
      <HighlightSection
        title="Cap. de mercado mas alto"
        endpoint="/coins/markets"
        site="top-market-cap"
        params={{ vs_currency: 'usd', order: 'market_cap_desc', per_page: 10 , price_change_percentage: "1h,24h,7d" }}
      />
      
      <HighlightSection
        title="Volumen mas alto"
        endpoint="/coins/markets"
        site="top-volume"
        params={{vs_currency: "usd",order: "volume_desc", per_page: 10, page: 1}}
        
        
      />
      <HighlightSection 
        title="Monedas mas populares"
        site="trending-coins"
        endpoint="/search/trending"
      />
    </div>
  );
}
