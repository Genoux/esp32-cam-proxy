import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy middleware configuration
const espCameraProxy = createProxyMiddleware({
  target: process.env.ESP32_CAM_URL,
  changeOrigin: true,
  logLevel: 'debug', // Enable logging for the proxy
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Request to: ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] Received response for: ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`[Proxy] Error: ${err.message}`);
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Something went wrong with the proxy.');
  }
});

// Enable CORS for all routes
app.use(cors());

// Apply the proxy middleware
app.use('/', espCameraProxy);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
