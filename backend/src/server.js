import http from 'http';
import app from './app.js';
import './config/db.js';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Crear WebSocket server
const wss = new WebSocketServer({ server });

// Cuando un cliente (frontend) se conecta
wss.on("connection", (ws) => {
  console.log("Cliente conectado al WebSocket 🚀");

  // mandar datos iniciales
  ws.send(JSON.stringify({ message: "Conexión establecida con backend" }));
});


server.listen(PORT, () => {
  console.log(`[server] escuchando en http://localhost:${PORT}`);
});
