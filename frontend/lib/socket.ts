import io from 'socket.io-client';

console.log('[Socket] Module loaded');

// Function to get JWT token from cookies
const getJwtToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
  
  if (!jwtCookie) return null;
  
  return jwtCookie.split('=')[1];
};

// Create socket connection with JWT token
const socket = io('http://localhost:5001', {
  autoConnect: true,
  auth: {
    token: getJwtToken() || undefined,
  },
});

socket.on('connect', () => {
  console.log('[Socket] Connected:', socket.id);
  console.log('[Socket] JWT token present:', !!getJwtToken());
});

socket.on('disconnect', () => {
  console.log('[Socket] Disconnected');
});

socket.on('connect_error', (err: Error) => {
  console.error('[Socket] Connection error:', err);
});

export default socket; 