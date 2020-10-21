import Peer from 'peerjs';
import Webcam from 'react-webcam';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import { WebcamComponent } from '../../components/Webcam/Webcam';
import Routes from '../../components/Routes/Routes';

// import {uuid} from '../../uuid';

interface props {
  socket: any;
}
// // console.log('uuid: ', uuid);
function App({ socket }: props) {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
export default App;