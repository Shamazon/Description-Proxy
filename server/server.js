const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const pgp = require('pg-promise')();

const config = {
  host: 'db',
  user: 'shamazon', // env var: PGUSER
  database: 'shamazon', // env var: PGDATABASE
  password: null, // env var: PGPASSWORD
  port: 5432, // env var: PGPORT
};

const db = pgp(config);

app.get('/products/:productkey', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT, POST,DELETE, OPTIONS');

  const key = req.params.productkey;
  db.any('SELECT * from description_electronicstest31 where "ProductKey" = $1', key).then((result) => {
    res.json(result);
  }).catch((err) => {
    throw err;
  });
});

// ON PRODUCTION: UNCOMMENT THIS ONE:

const CompiledFiles = path.join(__dirname, '..', 'build');

// ON DEV: UNCOMMENT THIS AND COMMMENT OUT THE OTHER ONE:
// const CompiledFiles = path.join(__dirname, '..', 'public');


app.use(express.static(CompiledFiles));

app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 4000);

