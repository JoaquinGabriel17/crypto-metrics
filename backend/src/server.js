import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import './config/db.js';
import { startBinanceStream, onPriceUpdate } from './services/binance.service.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Canal de WebSockets hacia frontend
io.on('connection', (socket) => {
  // Enviar un ping inicial
  socket.emit('server:hello', { message: 'Conectado al backend de cripto en tiempo real' });
});

// Escuchar updates de precio desde el servicio de Binance y retransmitir
onPriceUpdate((payload) => {
  // payload = { symbol, price, ts }
  io.emit('price:update', payload);
});

server.listen(PORT, () => {
  console.log(`[server] escuchando en http://localhost:${PORT}`);
  startBinanceStream();
});
