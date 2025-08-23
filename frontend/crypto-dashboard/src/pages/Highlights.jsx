import HighlightSection from '../components/HighlightSection.jsx'


const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function Highlights() {
  const commonParams = { vs_currency: 'usd', order: 'market_cap_desc', per_page: 250 };
  return (
    <div className="highlights-container">
      <HighlightSection
        title="Top 10 por Market Cap"
        endpoint="/coins/markets"
        params={{ ...commonParams, per_page: 10 }}
      />
      <HighlightSection
        title="10 Trending en CoinGecko"
        endpoint="/coins/top_gainers_losers"
        params={{ /* explicar más abajo que requiere plan pago */ }}
      />
      <HighlightSection
        title="Top 10 por Tipo de Categoría"
        endpoint="/coins/list/new"
        params={{}}
      />
      <HighlightSection
        title="Top 10 por Volumen 24 h"
        endpoint="/search/trending"
        params={{}}
      />
      <HighlightSection
        title="Top 10 con Volatilidad Alta (Mayor % cambio 24h)"
      />
      <HighlightSection
        title="Top 10 Stablecoins por Market Cap"
      />
      <HighlightSection
        title="Top 10 Criptos por Dominancia Global"
      />
    </div>
  );
}
