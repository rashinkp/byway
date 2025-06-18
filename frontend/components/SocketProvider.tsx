'use client';
import { useEffect } from 'react';
import socket from '@/lib/socket';

export default function SocketProvider() {
  useEffect(() => {
    // Ensures socket code runs on client
  }, []);
  return null;
} 