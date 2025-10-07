import React from "react";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";

export default function LandingPage() {

  const navigate = useNavigate()
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/ticker/24hr")
      .then(res => res.json())
      .then(data => setCoins(data));
  }, []);

  return (
    <div className="landing">
      <div className="real-time-tables">
        
      </div>
      <div className="crypto-data-container">
        <h1>Precios de criptomonedas por capital de mercado</h1>
        <DataTable  data={coins} />
      </div>
    </div>
  );
}
