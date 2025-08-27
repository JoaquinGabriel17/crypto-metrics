import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/dataTable.css'
import Loading from "./Loading";

const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


export default function DataTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setloading] = useState(false)

  //estados para el paginado
  const [cryptos, setCryptos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Cantidad de monedas por página

  useEffect(() => {
    setloading(true)
    const fetchData = async () => {
      try {
        const res = await axios.get(`${ApiURL}/crypto/market-data`, {
  params: {
    endpoint: '/coins/markets',
    site: 'landing',
      vs_currency: 'usd',
      order: "market_cap_desc",
      per_page: 250,
      price_change_percentage:"1h,24h,7d"
  }})
        setCryptos(res.data);
        setloading(false)

      } catch (err) {
        setloading(false)
        alert("Error al obtener datos", err);
        console.error("Error al obtener datos", err);
      }
    };
    fetchData();
  }, []);

   // Paginado
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cryptos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cryptos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Determinar rango de páginas visibles
  const visiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

return (
    <div className="table-container">
      <table className="crypto-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={loading ? "tbody-loading" : ""}>
          {loading ? <div className="loading-container" ><Loading/></div> :
          currentItems.map((coin, index) => (
            <tr key={coin.id}>
            <td>{indexOfFirstItem + index + 1}</td>
              <td className="coin-cell">
                <div className="coin-cell-contain">
                  <img src={coin.image} alt={coin.name} className="coin-icon" />
                  <span className="coin-name">{coin.name}</span>
                  <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td className={coin.price_change_percentage_1h_in_currency >= 0 ? "positive" : "negative"}>
                {coin.price_change_percentage_1h_in_currency?.toFixed(1)}%
              </td>
              <td className={coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}>
                {coin.price_change_percentage_24h?.toFixed(1)}%
              </td>
              <td className={coin.price_change_percentage_7d_in_currency >= 0 ? "positive" : "negative"}>
                {coin.price_change_percentage_7d_in_currency?.toFixed(1)}%
              </td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>
                <button className="buy-btn">Buy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     {/* Paginado */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ margin: "0 5px", padding: "5px 10px", cursor: "pointer" }}
        >
          ⬅ Anterior
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              margin: "0 5px",
              backgroundColor: currentPage === page ? "#00b894" : "#ccc",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ margin: "0 5px", padding: "5px 10px", cursor: "pointer" }}
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  );
};
