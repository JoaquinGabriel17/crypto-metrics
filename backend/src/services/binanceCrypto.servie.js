import WebSocket from "ws";

export function startBinanceStream(wss) {
  const socket = new WebSocket(
    "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/adausdt@ticker"
  );

  

  socket.on("message", (msg) => {
    const { data } = JSON.parse(msg);
    const payload = {
      symbol: data.s, // símbolo (BTCUSDT, ETHUSDT, etc.)
      price: data.c,  // precio actual
    };

    // Reenviar a todos los clientes conectados a TU servidor WS
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  });



  socket.on("error", (err) => console.error("[Binance WS] Error:", err));
}

// MINITICKER STREAM
export const startMiniTickerStream = (wss) => {
  const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/!miniTicker@arr";

  const binanceSocket = new WebSocket(BINANCE_WS_URL);

  binanceSocket.on("open", () => {
    console.log("[binance] Conectado al stream !miniTicker@arr 🚀");
  });

  binanceSocket.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      // Binance responde con { stream: "!miniTicker@arr", data: [...] }
     
      // Reenviar a todos los clientes conectados al backend
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "miniTicker", data: parsed }));
        }
      });
    } catch (err) {
      console.error("[binance] Error parseando mensaje:", err.message);
    }
  });

  binanceSocket.on("close", () => {
    console.log("[binance] Stream cerrado ❌, intentando reconectar...");
    setTimeout(() => startMiniTickerStream(wss), 5000);
  });

  binanceSocket.on("error", (err) => {
    console.error("[binance] Error en WS:", err.message);
  });
};