import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/dataTable.css'
import Loading from "./Loading";


const ApiURL = import.meta.env.VITE_BACKEND_API_URL //guardar la URL de la API


const NftsTable = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    setLoading(true)
    const fetchNfts = async () => {
      try {
        const res = await axios.get(`${ApiURL}/crypto/market-data`, {
            params: {
              endpoint: '/search/trending',
              site: 'nfts-trending'
            }
      });
        
        setNfts(res.data);
            setLoading(false)

      } catch (error) {
        setLoading(false);
        console.error("Error al obtener exchanges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNfts();
  }, []);

  if (loading) return <Loading/>

  return (
    <div className="p-4">
      <h2>Lista de Nfts</h2>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>NFT</th>
            <th>Precio base</th>
            <th>24 H</th>
            <th>Volumen en 24 H</th>
            <th>Gráfico</th>
          </tr>
        </thead>
        <tbody>
          {nfts.map((nft) => (
            <tr key={nft.id}>
              <td className="coin-cell">
                <div className="coin-cell-contain">
                  <img src={nft.image} alt={nft.name} className="coin-icon" />
                  <span className="coin-name">{nft.name}</span>
                  <span className="coin-symbol">{nft.symbol.toUpperCase()}</span>
                </div>
              </td>
              <td>{nft.floor_price}</td>
              <td>{nft.floor_price_24h_percentage_change?.toFixed(1)}% </td>
              <td>{nft.h24_volume}</td>
              <td><img src={nft.sparkline} alt={nft.name}></img></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NftsTable;
