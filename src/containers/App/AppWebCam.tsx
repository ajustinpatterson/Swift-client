import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import Webcam from 'react-webcam';
import './App.css';
import Landing from '../../components/Landing/Landing';

interface props {
  socket: any;
}

function App({ socket }: props) {
  const connectToNewUser = (userId: string) => {};
  let myVideo = <video />;

  const videoRef = useRef(null);

  useEffect((): any => {
    socket.on('connect', () => {
      socket.emit('join-room', 12345, socket.id);
      socket.on('user-connected', (userId: string) => {
        console.log(userId);
        connectToNewUser(userId);
      });
    });
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream: MediaStream) => {
        console.log('stream: ', stream);
        (videoRef.current! as any).video.srcObject = stream;
        console.log('stream media', stream);
        //addVideoStream(myVideo, stream);
        // myPeer.on('call', (call) => {
        //   call.answer(stream);
        //   const video = <video />;
        //   call.on('stream', (userVideoStream) => {
        //     addVideoStream(video, userVideoStream);
        //   });
        // });
        const res = stream.getVideoTracks();
        console.log(res);
        socket.emit('stream', stream);
      });

    function addVideoStream(video: any, stream: any) {
      myVideo = <video src={stream} />;
    }
  }, []);

  // socket.on('test', (data: any) => {
  //   console.log(data);
  // });

  return (
    // <div className="App">
    //   {myVideo}
    //   {console.log(socket)}

    //   {console.log(videoRef)}
    //   <Webcam ref={videoRef} />
    // </div>
    <Landing />
  );
}

export default App;
