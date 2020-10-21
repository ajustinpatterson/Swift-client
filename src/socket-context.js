import io from 'socket.io-client';
import React from 'react';

export const socket = io('https://fathomless-eyrie-92787.herokuapp.com'); //connects to server

export const SocketContext = React.createContext(
  socket
);


