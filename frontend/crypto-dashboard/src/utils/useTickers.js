import { useEffect, useState } from "react";

export default function useTickers() {
  const [tickers, setTickers] = useState({}); // diccionario por symbol

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // ✅ Caso 1: primer batch de datos (array)
      if (msg.type === "miniTicker") {
        const dict = {};
        msg.data.forEach((t) => {
          dict[t.s] = {
            symbol: t.s,
            price: t.c,
            open: t.o,
            high: t.h,
            low: t.l,
            volume: t.v,
          };
        });
        setTickers(dict);
      }

      // ✅ Caso 2: actualizaciones individuales
      if (msg.symbol && msg.price) {
        setTickers((prev) => ({
          ...prev,
          [msg.symbol]: {
            ...(prev[msg.symbol] || {}),
            symbol: msg.symbol,
            price: msg.price,
          },
        }));
      }
    };

    return () => socket.close();
  }, []);

  return tickers;
}
