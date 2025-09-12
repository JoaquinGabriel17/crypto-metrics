import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/dataTable.css'
import Loading from "./Loading";


const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


const ExchangesTable = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false)

    //estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Cantidad de monedas por página

  useEffect(() => {
    setLoading(true)
    const fetchExchanges = async () => {
      try {
        const res = await axios.get(`${ApiURL}/crypto/market-data`, {
            params: {
              endpoint: '/exchanges',
              site: 'exchanges'
            }
      });
        
        setExchanges(res.data);
            setLoading(false)

      } catch (error) {
        setLoading(false);
        console.error("Error al obtener exchanges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

   // Paginado
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exchanges.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(exchanges.length / itemsPerPage);

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

  if (loading) return <Loading/>

  return (
    <div className="p-4">
      <h2>Lista de Intercambios</h2>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre</th>
            <th>País</th>
            <th>Ranking</th>
            <th>Año Fundación</th>
            <th>Volumen (BTC 24h)</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((ex) => (
            <tr key={ex.id}>
              <td>
                <img src={ex.image} alt={ex.name} width="32" />
              </td>
              <td>{ex.name}</td>
              <td>{ex.country || "N/A"} </td>
              <td>{ex.trust_score_rank || "N/A"}</td>
              <td>{ex.year_established || "N/A"}</td>
              <td>{Number(ex.trade_volume_24h_btc).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginado */}
      <div style={{ margin: "20px", display: "flex", justifyContent: "center" }}>
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

export default ExchangesTable;
