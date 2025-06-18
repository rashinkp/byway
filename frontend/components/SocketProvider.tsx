'use client';
import { useEffect } from 'react';
import socket from '../lib/socket';

export default function SocketProvider() {
  useEffect(() => {
    // Reference socket to ensure it's not tree-shaken
    if (socket) {
      // Optionally, you can log here as well
      console.log('[SocketProvider] Socket instance:', socket);
    }
  }, []);
  return <div style={{ display: 'none' }} id="socket-provider" />;
} 