import io from "socket.io-client";

// Simple logger for debugging
const log = (message: string, data?: any) => {
  console.log(`🔌 [Socket] ${message}`, data || '');
};

// Data flow tracking
let dataFlowStats = {
  eventsReceived: 0,
  eventsEmitted: 0,
  bytesReceived: 0,
  bytesEmitted: 0,
  eventHistory: [] as Array<{
    type: 'received' | 'emitted';
    event: string;
    timestamp: string;
    dataSize: number;
  }>
};

// Create socket connection
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
	autoConnect: false,
	transports: ['websocket', 'polling'],
	timeout: 20000,
});

log('Socket initialized', {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001',
  autoConnect: false,
});

// Connection events
socket.on("connect", () => {
  log('✅ CONNECTED', {
    id: socket.id,
    timestamp: new Date().toISOString(),
  });
  
  // Reset stats
  dataFlowStats = {
    eventsReceived: 0,
    eventsEmitted: 0,
    bytesReceived: 0,
    bytesEmitted: 0,
    eventHistory: []
  };
});

socket.on("connect_error", (error: any) => {
  log('❌ CONNECTION ERROR', {
    error: error.message,
    timestamp: new Date().toISOString(),
  });
});

socket.on("disconnect", (reason: string) => {
  log('🔌 DISCONNECTED', {
    reason,
    id: socket.id,
    timestamp: new Date().toISOString(),
  });
});

socket.on("reconnect", (attemptNumber: number) => {
  log('🔄 RECONNECTED', {
    attemptNumber,
    id: socket.id,
    timestamp: new Date().toISOString(),
  });
});

// Log all emitted events
const originalEmit = socket.emit;
socket.emit = function(event: string, ...args: any[]) {
  const dataSize = JSON.stringify(args).length;
  const timestamp = new Date().toISOString();
  
  dataFlowStats.eventsEmitted++;
  dataFlowStats.bytesEmitted += dataSize;
  dataFlowStats.eventHistory.push({
    type: 'emitted',
    event,
    timestamp,
    dataSize
  });
  
  // Keep only last 20 events
  if (dataFlowStats.eventHistory.length > 20) {
    dataFlowStats.eventHistory = dataFlowStats.eventHistory.slice(-20);
  }
  
  log(`📤 EMIT: ${event}`, {
    args: args.length > 0 ? args : 'none',
    dataSize,
    timestamp,
  });
  
  return originalEmit.call(this, event, ...args);
};

// Helper function to log received events
const logReceivedEvent = (eventName: string, data: any) => {
  const dataSize = JSON.stringify(data).length;
  const timestamp = new Date().toISOString();
  
  dataFlowStats.eventsReceived++;
  dataFlowStats.bytesReceived += dataSize;
  dataFlowStats.eventHistory.push({
    type: 'received',
    event: eventName,
    timestamp,
    dataSize
  });
  
  // Keep only last 20 events
  if (dataFlowStats.eventHistory.length > 20) {
    dataFlowStats.eventHistory = dataFlowStats.eventHistory.slice(-20);
  }
  
  log(`📥 RECEIVE: ${eventName}`, {
    data: data,
    dataSize,
    timestamp,
  });
};

// Specific event listeners for important data
socket.on("message", (data: any) => {
  logReceivedEvent("message", data);
  log('💬 CHAT MESSAGE', {
    id: data.id,
    chatId: data.chatId,
    senderId: data.senderId,
    content: data.content?.substring(0, 50) + (data.content?.length > 50 ? '...' : ''),
    timestamp: new Date().toISOString(),
  });
});

socket.on("newNotification", (data: any) => {
  logReceivedEvent("newNotification", data);
  log('🔔 NOTIFICATION', {
    type: data.type || data.eventType,
    message: data.message,
    timestamp: new Date().toISOString(),
  });
});

socket.on("unreadMessageCount", (data: any) => {
  logReceivedEvent("unreadMessageCount", data);
  log('📬 UNREAD COUNT', {
    count: data.count,
    timestamp: new Date().toISOString(),
  });
});

// Add more event listeners for debugging
socket.on("chatListUpdated", (data: any) => {
  logReceivedEvent("chatListUpdated", data);
  log('📋 CHAT LIST UPDATED', {
    chatCount: Array.isArray(data) ? data.length : 'unknown',
    timestamp: new Date().toISOString(),
  });
});

socket.on("error", (data: any) => {
  logReceivedEvent("error", data);
  log('❌ SOCKET ERROR', {
    error: data,
    timestamp: new Date().toISOString(),
  });
});

export const safeSocketConnect = () => {
  if (!socket.connected) {
    log('🔄 Attempting to connect...');
    socket.connect();
  } else {
    log('ℹ️ Already connected');
  }
};

export const safeSocketDisconnect = () => {
  if (socket.connected) {
    log('🔄 Disconnecting...');
    socket.disconnect();
  }
};

export const getSocketStatus = () => ({
  connected: socket.connected,
  id: socket.id,
  timestamp: new Date().toISOString(),
});

export const getDataFlowStats = () => ({
  ...dataFlowStats,
  eventHistory: dataFlowStats.eventHistory.slice(-10)
});

export default socket;
