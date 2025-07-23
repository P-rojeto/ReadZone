const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usuarioRoutes = require('./routes/usuarios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', usuarioRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando em http://localhost:' + (process.env.PORT || 3000));
});
