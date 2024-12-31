import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth';
import sequelize from './database';
import taskRoutes from './routes/task';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', auth);
app.use('/api/tasks', taskRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados bem-sucedida!');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error: any) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
