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
  target: process.env.ESP32_CAM_URL,
  changeOrigin: true,
  ws: true, // if using WebSockets
  pathRewrite: {
      '^/camera': '/view', // rewrite path from "/camera" to "/view"
  },
});

app.use(cors());
// Use the proxy middleware for specific routes
app.use('/camera', espCameraProxy);

// io.on('connection', (socket) => {
//   const interval = setInterval(async () => {
//       try {
//           const response = await axios.get(esp32Url, { responseType: 'arraybuffer' });
//           // Compress the image if not already compressed
//           const image = Buffer.from(response.data, 'binary').toString('base64');
//           socket.emit('frame', image);
//       } catch (error) {
//           console.error('Error fetching frame:', error);
//       }
//   }, 100); // Adjust this to control frame rate

//   // Listen to client requests to change frame rate
//   socket.on('adjust-frame-rate', (newRate) => {
//       clearInterval(interval);
//       // Set up new interval with newRate
//   });

//   socket.on('disconnect', () => {
//       console.log('user disconnected');
//       clearInterval(interval);
//   });
// });


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
