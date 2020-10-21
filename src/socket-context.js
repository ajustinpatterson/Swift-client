import io from 'socket.io-client';
import React from 'react';

export const socket = io('ws://fathomless-eyrie-92787.herokuapp.com', {transports: ['websocket']}); //connects to server

export const SocketContext = React.createContext(
  socket
);


