const express = require('express');
const helmet = require('helmet');

const knex = require('knex');

const knexConfig = {
 client: 'sqlite3',
 connection: {
  filename: './data/lambda.sqlite3',
 },
 useNullAsDefault: true,
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get('/api/zoos', async (req, res) => {
 try {
  const type = await db('zoos');
  res.status(200).json(type);
 } catch (error) {
  res.status(500).json(error);
 }
});

server.get('/api/zoos/:id', async (req, res) => {
 try {
  const type = await db('zoos').where('id', req.params.id);
  if (type.length > 0) {
   res.status(200).json(type);
  } else {
   res.status(404).json({ message: 'No record with this id' });
  }
 } catch (error) {
  res.status(500).json(error);
 }
});

server.delete('/api/zoos/:id', async (req, res) => {
 try {
  const type = await db('zoos')
   .where('id', req.params.id)
   .del();
  res.status(200).end();
 } catch (error) {
  res.status(500).json(error);
 }
});

server.put('/api/zoos/:id', async (req, res) => {
 try {
  const numberOfRec = await db('zoos')
   .where('id', req.params.id)
   .update(req.body);
  const type = await db('zoos')
   .where('id', req.params.id)
   .first();

  res.status(200).json(type);
 } catch (error) {
  res.status(500).json(error);
 }
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
