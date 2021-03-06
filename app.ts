/*
import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});

// exported here for use in the testing library
module.exports = app
*/

import { Server } from "./src/Server";

const server = new Server();
module.exports = server.app;
