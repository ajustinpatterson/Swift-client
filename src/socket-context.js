import io from 'socket.io-client';
import React from 'react';

export const socket = io('https://54.167.125.52', {transports: ['websocket']}); //connects to server

export const SocketContext = React.createContext(
  socket
);


