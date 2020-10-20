import io from 'socket.io-client';
import React from 'react';

export const socket = io('http://localhost:3002/'); //connects to server

export const SocketContext = React.createContext(
  socket
);


