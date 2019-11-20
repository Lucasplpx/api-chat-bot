const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

require('dotenv').config();

const { PORT } = process.env;

const routes = require('./src/router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(routes);

require('./src/startup/chat')(io);

server.listen(PORT || 3000, ()=> {
    console.log(`Server has started on port ${PORT}`);
});
