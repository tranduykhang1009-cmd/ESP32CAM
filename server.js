const express = require('express');
const { Server } = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('SCADA WebSocket Camera Relay Active!'));

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Khởi tạo WebSocket Server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('⚡ Kết nối WebSocket mới!');

  ws.on('message', (data) => {
    // Chuyển tiếp ngay lập tức từng khung ảnh từ ESP32-CAM sang tất cả Web đang xem
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => console.log('❌ Một kết nối đã ngắt'));
});
