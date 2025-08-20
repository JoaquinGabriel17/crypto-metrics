import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

mongoose.connect(uri, { autoIndex: true })
  .then(() => console.log('[db] Mongo conectado'))
  .catch((err) => console.error('[db] Error de conexión', err));

