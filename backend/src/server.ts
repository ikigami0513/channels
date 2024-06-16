import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import cors = require('cors');
import bodyParser = require("body-parser");
import { client } from "./redis_client";

import apiRouter from './routes/api.route';
import { socketAuthMiddleware } from "./middlewares/socketAuth";
import { registerSocketEvents } from "./routes/socket.route";

const app = express();
const port = process.env.PORT || 4000;

app.set("port", port);

// Express Middlewares
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Express Routes
app.use(apiRouter);

const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Socketio Middlewares
io.use(socketAuthMiddleware);

io.on('connection', async (socket: socketio.Socket) => registerSocketEvents(socket, io));

server.listen(port, async () => {
    console.log(`listening on *:${port}`);
});

process.on('SIGINT', async () => {
    await client.quit();
    console.log('Redis client disconnected');
    process.exit(0);
});
