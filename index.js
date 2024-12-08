require('dotenv').config();

const express = require('express');
const { dbConect } = require('./src/config/db');
const worksOfArtsRouter = require('./src/api/routes/worksOfArts');

const app = express();
app.use(express.json());
dbConect();

app.use('/api/v1/worksOfArts', worksOfArtsRouter)

app.use('*', (req, res, next) => {

     return res.status(404).json('Route not found');
});

app.listen(3000, () => {

     console.log('listening on port http://localhost:3000 😎');
});










