import express from 'express';
import 'dotenv/config';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const PORT = process.env.PORT || 3000;

const espCameraProxy = createProxyMiddleware({
  target: 'http://192.168.86.22:81/',
  changeOrigin: true
});

app.use(cors());
app.use(espCameraProxy);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
