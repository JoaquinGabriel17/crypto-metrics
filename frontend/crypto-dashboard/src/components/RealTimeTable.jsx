import React, { useEffect, useState } from "react";
import "../styles/CryptoTable.css";

export default function CryptoTable() {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // conectar al backend WebSocket
    const ws = new WebSocket("ws://localhost:4000");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.symbol && data.price) {
        setPrices((prev) => ({
          ...prev,
          [data.symbol]: data.price,
        }));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="crypto-container">
      <h2>Precios en Tiempo Real</h2>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Precio (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices).map(([symbol, price]) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>{parseFloat(price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
