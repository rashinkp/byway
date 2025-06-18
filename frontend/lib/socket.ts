import io from 'socket.io-client';

console.log('[Socket] Module loaded');

// You can add auth or options here if needed
const socket = io('http://localhost:5001', {
  autoConnect: true,
  // auth: { token: 'your-jwt-token' },
});

socket.on('connect', () => {
  console.log('[Socket] Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket] Disconnected');
});

socket.on('connect_error', (err: Error) => {
  console.error('[Socket] Connection error:', err);
});

export default socket; 