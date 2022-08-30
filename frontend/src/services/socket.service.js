import {io} from 'socket.io-client';

const BASE_URL = 'ws://localhost:3030';

export const socketService = {
  getSocket,
  emit,
};

function getSocket() {
  return io(`${BASE_URL}`, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });
}

function emit(socket, eventName, data) {
  socket.emit(eventName, data);
}
