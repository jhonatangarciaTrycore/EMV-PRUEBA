import express from 'express';
import 'dotenv/config';
import { db } from './db.config.js';
import cors from 'cors';
import projectRoutes from './routes/project.routes.js';
import activityRoutes from './routes/activity.routes.js';
import evmRoutes from './routes/evm.routes.js';


const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(cors());


app.use('/projects', projectRoutes);
app.use('/activities', activityRoutes);
app.use('/evm', evmRoutes);

db.query('SELECT NOW()')
    .then(() => console.log('Database connected'))
    .catch((error) => console.error('Database connection error', error));

app.listen(PORT, () => {
    console.log(`Servidor EVM escuchando en puerto ${PORT}`);
});


export { app };
