import { useEffect, useState } from "react";

const MiniTickerTable = () => {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    // Conectarse al WS de tu backend (ajusta el puerto según tu server.js)
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Conectado al WebSocket 🚀");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data)
        // Binance manda un array de objetos
        if (Array.isArray(data)) {
          setTickers(data);
        }
      } catch (error) {
        console.error("Error parseando mensaje WS:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket cerrado ❌");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mini Tickers (24h rolling window)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Symbol</th>
              <th className="px-4 py-2 border">Close Price</th>
              <th className="px-4 py-2 border">Open Price</th>
              <th className="px-4 py-2 border">High</th>
              <th className="px-4 py-2 border">Low</th>
              <th className="px-4 py-2 border">Base Volume</th>
              <th className="px-4 py-2 border">Quote Volume</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((t) => (
              <tr key={t.s} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{t.s}</td>
                <td className="px-4 py-2 border">{t.c}</td>
                <td className="px-4 py-2 border">{t.o}</td>
                <td className="px-4 py-2 border">{t.h}</td>
                <td className="px-4 py-2 border">{t.l}</td>
                <td className="px-4 py-2 border">{t.v}</td>
                <td className="px-4 py-2 border">{t.q}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiniTickerTable;
