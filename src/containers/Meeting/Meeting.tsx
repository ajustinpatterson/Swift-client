import React, { useState, useEffect, useRef, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import './Meeting.scss';
import Peer from 'peerjs';
import Webcam from 'react-webcam';
import { WebcamComponent } from '../../components/Webcam/Webcam';
import { SocketContext } from '../../socket-context';
import logo from '../../assets/swift-logo-middle.png'
import userSettings from '../../components/UserSettings/UserSettings';

// import {uuid} from '../../uuid';
interface props {
  socket: any;
}
const Meeting = () => {
  //****************** VARIABLES ************************/
  const myVideoRef = useRef(null);
  const history = useHistory();
  const socket  = useContext(SocketContext)
  const otherVideoRef = useRef(null);
  const [hasOtherJoined, setHasOtherJoined] = useState<boolean>(false);
  const [streams, setStreams] = useState<MediaStream[]>([]);
  const [sharing, setSharing] = useState<boolean>(false);
  const [videoToggle, setVideoToggle] = useState<boolean>(true);
  const [recording, setRecording] = useState<boolean>(false);
  const [mute, setMute] = useState<boolean>(false);


  // const MediaRecorder: any = null;
  const mediaDevices = navigator.mediaDevices as any;
  let chunks: any[] = [];
  const constraints = {
    audio: true,
    video: {
      // user, {exact: 'user'}, environment
      facingMode: 'user',
      width: {
        min: 640,
        ideal: 1280,
        max: 1920
      },
      height: {
        min: 480,
        ideal: 720,
        max: 1080
      }
    }
  }
  const gdmOptions = {
    video: {
      cursor: "never",
      // width: 100,
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  }





  //****************** FUNCTIONS DECLARATION ************************/

    console.log('streams array', streams)

    function handleProfile (){
      history.push('/userprofile')

    }

  function connectToNewUser(userId: string, otherPeerId: string, stream: MediaStream, peer: any) {
    console.log('this is the peer', peer)
    console.log('Other user peerId ->', otherPeerId); // ****** yes console.log
    console.log('I am the peer inside the func connectToNewUser')
    peer.connect(otherPeerId);
    // call is emitted when a remote peer attempts to call you.
    const mediaConnection = peer.call(otherPeerId, stream);
    console.log('mediaConnection', mediaConnection) // ****** no csonsole.log
    mediaConnection.on('stream', (otherUserStream: any) => {
      // it gets called two times for each type of track audio and video
      // console.log('other stream', otherUserStream);
      console.log('otherUserStream', otherUserStream)
      addSecondVideoStream(otherUserStream)
    })
  };
   function addSecondVideoStream(stream: MediaStream) {
    setStreams([...streams, stream])
    setHasOtherJoined(true);
    console.log('this is a stream from addSecondaryVideoStream:' , stream) // ******* no csonsole.log

    // ...
  };
  // VIDEO ON/OFF
  function displayMyStream(stream: MediaStream) {
    setVideoToggle(true);
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        (myVideoRef.current! as any).video.srcObject = stream;
      })
  }
  function handleVideoToggle() {
    setVideoToggle(!videoToggle);
    videoToggle
      ? (myVideoRef.current! as any).video.srcObject = null
      : navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          (myVideoRef.current! as any).video.srcObject = stream;
        })
    // display picture
  }
  function stopDisplayMyStream(stream: MediaStream) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        (myVideoRef.current! as any).video.srcObject = null;
      });
    setVideoToggle(false);
  }
  // SCREEN SHARING
  async function screenSharing(options: object) {
    let captureStream = null;
    try {
      console.log('options', options)
      const mediaDevices = navigator.mediaDevices as any;
      captureStream = await mediaDevices.getDisplayMedia(gdmOptions);
      (myVideoRef.current! as any).video.srcObject = captureStream;
      setSharing(true);
      console.log('captureStream', captureStream)
      console.log('get video tracks', captureStream.getVideoTracks())
      captureStream.getVideoTracks()[0].onended = function () {
        stopScreenSharing()
      }
    } catch (err) {
      console.error("Error: " + err);
    }
    return captureStream;
  }
  function stopScreenSharing() {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setSharing(false);
        // (myVideoRef.current! as any).video.srcObject = stream;
        // stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled
        displayMyStream(stream);
        console.log(stream.getVideoTracks())
      })
  }

  // SCREEN RECORDING
  // function handleRecording() {
  //   setVideoToggle(!videoToggle);
  //   videoToggle
  //     ? startRecording()
  //     : stopRecordingAndDownload()
  //   // display picture
  // }
  // function startRecording() {
  //   navigator.mediaDevices.getUserMedia(constraints)
  //     .then((stream) => {
  //       const options = { mimeType: "video/webm; codecs=vp9" };
  //       const mediaRecorder = new MediaRecorder(stream, options);
  //       mediaRecorder.ondataavailable = handleDataAvailable;
  //       mediaRecorder.start();
  //       console.log('mediaRecorder.state', mediaRecorder.state)
  //     })
  // }
  // function handleDataAvailable(event: any) {
  //   console.log(event)
  //   if (event.data.size > 0) {
  //     chunks.push(event.data);
  //     console.log(chunks);
  //     download();
  //   }
  // }
  // function download() {
  //   const blob = new Blob(chunks, {
  //     type: "video/webm"
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   document.body.appendChild(a);
  //   // a.style = "display: none";
  //   a.href = url;
  //   a.download = "test.webm";
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }
  // function stopRecordingAndDownload() {
  //   navigator.mediaDevices.getUserMedia(constraints)
  //     .then((stream) => {
  //       mediaRecorder.stop();
  //     })
  // }
  function handleRecord(stream: any) {
    setRecording(true);
  }
  function handleStop(stream: any) {
    setRecording(false);
    screenSharing(stream);
  }

  // AUDIO ON/OFF
  function muteUnmute(mute: boolean) {
    console.log(mute)
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        const isEnabled = stream.getAudioTracks()[0].enabled
        if (!mute) {
          setMute(true)
          stream.getAudioTracks()[0].enabled = false
          console.log('enabled', stream.getAudioTracks()[0].enabled)
        } else {
          setMute(false)
          stream.getAudioTracks()[0].enabled = true
          console.log('enabled', stream.getAudioTracks()[0].enabled)
        }
      })
  }


  //****************** USE EFFECT ************************/
  useEffect(() => {
    socket.on('connect', () => {
      navigator.mediaDevices
        .getUserMedia(
          // constraints
          {video: true,
          audio: true}
        )
        .then((stream) => {
          console.log('recordingr', recording)
          // console.log(stream.getAudioTracks())
          // if ('srcObject' in myVideoRef) {
          //   (myVideoRef.current! as any).video.srcObject = stream;
          // } else {
          //   (myVideoRef.current! as any).video.src = window.URL.createObjectURL(stream);
          // }
          displayMyStream(stream);
          console.log('constraints: ', constraints);
          // const peer = new Peer(undefined, {
          //   host: 'swift-peer-server.herokuapp.com',
          //   port: 80
          // });

          let peer = new Peer(undefined, {host:'peerjs-server.herokuapp.com', secure:true, port:443})


          console.log('peer', peer);
          console.log('my stream getAudotracks', stream.getAudioTracks())
          console.log('my stream getTrackById', stream.getTrackById('65d7ee52-b0cc-405f-8b83-a6ae30661a8d'))
          console.log('my stream getTracks', stream.getTracks())
          console.log('my stream getVideoTracks', stream.getVideoTracks())
          // set peer listeners
          peer.on('error', (err) => {
            console.log('error peer connection', err);
          });
          peer.on('open', (peerId) => {
            console.log('My peerId ->', peerId);
            socket.emit('join-room', 12345, socket.id, peerId);
          });
          // Emitted when a new data connection is established from a remote peer.
          peer.on('connection', (conn) => {
            console.log('*****************************an user just connected', stream);
            conn.on('data', (data) => {
              console.log('this is the data from other peer: ', data);
            })
          });
          // open is emitted when a new data connection is established from a remote peer.
          // the peerID is automatically generated here with the uuid lib
          // whenever a new user connects it will connect to him through the peerId
          socket.on('user-connected', (userId: string, otherPeerId: string) => {
            console.log('I am triggered by the socet.on(user-connected)');
            connectToNewUser(userId, otherPeerId, stream, peer);
          });
          // when the peer make a call
          peer.on('call', (call) => {
            console.log('peer.on call is triggered')
            call.answer(stream);
            // const video = document.createElement('video');
            call.on('stream', (otherUserStream) => {
              // it gets called two times for each type of track audio and video
              // console.log('other stream', otherUserStream);
              // add other user video to dom
              addSecondVideoStream(otherUserStream)
            });
            call.on('close', () => {
              console.log('peer.on CLOSE is triggered')
              // disconnect the peer and get rid of the stream
              peer.disconnect();
              (otherVideoRef.current! as any).video.srcObject = null;
              // this sets the hadOtherJoined to false
              setHasOtherJoined(false);
              console.log(hasOtherJoined);
            });
          });
        })
        .catch(error => {
          console.error(error.name, error.message);
        })
        ;
    });
  }, [streams]);

  //****************** RENDERING ************************/

  return (
    <>
    <div className="bird-container">

      <img src={logo} className="bird-middle"/>
    </div>

        <div className="container">
          <Webcam ref={myVideoRef} />
          {console.log('My video Ref ////////////////', myVideoRef)}
          {
            streams.map((stream) => <WebcamComponent videoRef={stream} />)
          }
        </div>
        <div className="cntrlbar">
          <button className={!sharing ? 'share-off' : 'share-on'} onClick={screenSharing}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M19,2H5A3,3,0,0,0,2,5V15a3,3,0,0,0,3,3H7.64l-.58,1a2,2,0,0,0,0,2,2,2,0,0,0,1.75,1h6.46A2,2,0,0,0,17,21a2,2,0,0,0,0-2l-.59-1H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2ZM8.77,20,10,18H14l1.2,2ZM20,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V14H20Zm0-3H4V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"/></svg>
          </button>

          <button className={videoToggle ? 'btn-off' : 'btn-on'} onClick={handleVideoToggle}>{videoToggle ?
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M21.53,7.15a1,1,0,0,0-1,0L17,8.89A3,3,0,0,0,14,6H5A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3h9a3,3,0,0,0,3-2.89l3.56,1.78A1,1,0,0,0,21,17a1,1,0,0,0,.53-.15A1,1,0,0,0,22,16V8A1,1,0,0,0,21.53,7.15ZM15,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8h9a1,1,0,0,1,1,1Zm5-.62-3-1.5V11.12l3-1.5Z"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M7.71,6.29h0l-4-4A1,1,0,0,0,2.29,3.71L4.62,6A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3h9a3,3,0,0,0,1.9-.69l4.39,4.4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM14,16H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8H6.59l7.87,7.88A1,1,0,0,1,14,16Zm7.53-8.85a1,1,0,0,0-1,0L17,8.89A3,3,0,0,0,14,6H12.66a1,1,0,0,0,0,2H14a1,1,0,0,1,1,1v1.5h0a1.62,1.62,0,0,0,0,.19.65.65,0,0,0,.05.2h0s.05.06.07.1a1,1,0,0,0,.15.21s.1.06.15.1l.17.11a.85.85,0,0,0,.23,0,.7.7,0,0,0,.14,0h0a1.62,1.62,0,0,0,.19,0,.65.65,0,0,0,.2-.05h0L20,9.62v5.72a1,1,0,1,0,2,0V8A1,1,0,0,0,21.53,7.15Z"/></svg>}
          </button>

          <button className={mute ? 'btn-off' : 'btn-on'} onClick={() => muteUnmute(mute)}>{mute ?
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M10.5,3.73a2,2,0,0,1,2.95-.14A2,2,0,0,1,14,5V8.41a1,1,0,0,0,2,0V5A4,4,0,0,0,9,2.47,1,1,0,1,0,10.5,3.73Zm8.22,9.54.2,0a1,1,0,0,0,1-.81A7.91,7.91,0,0,0,20,11a1,1,0,0,0-2,0,5.54,5.54,0,0,1-.11,1.1A1,1,0,0,0,18.72,13.27Zm3,6.06-18-18a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L8,8.48V11a4,4,0,0,0,6,3.46l1.46,1.46A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93a7.87,7.87,0,0,0,3.85-1.59l3.4,3.4a1,1,0,0,0,1.42-1.41ZM12,13a2,2,0,0,1-2-2v-.52l2.45,2.46A1.74,1.74,0,0,1,12,13Z"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z"/></svg>}
          </button>

          <button className='btn-off' onClick={handleProfile}><i className="far fa-user set"></i></button>

      </div>
      </>
  );
};

{/* // return (
//   <div className="mtngcontainer">
//     <div className="others-video-container">
//       { */}
{/* //         streams.map((stream) => <WebcamComponent videoRef={stream} key={stream.id} />)
//       }
//     </div> */}
{/*
//     <div className="my-video-container">
//       <Webcam ref={myVideoRef} />
//     </div>

//     <div className="cntrlbar">
//       <div className="container">
//       </div>
//       <button className={!sharing ? 'share-off' : 'share-on'} onClick={screenSharing}>
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M19,2H5A3,3,0,0,0,2,5V15a3,3,0,0,0,3,3H7.64l-.58,1a2,2,0,0,0,0,2,2,2,0,0,0,1.75,1h6.46A2,2,0,0,0,17,21a2,2,0,0,0,0-2l-.59-1H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2ZM8.77,20,10,18H14l1.2,2ZM20,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V14H20Zm0-3H4V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"/></svg>
//       </button>

//       <button className={videoToggle ? 'btn-off' : 'btn-on'} onClick={handleVideoToggle}>{videoToggle ?
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M21.53,7.15a1,1,0,0,0-1,0L17,8.89A3,3,0,0,0,14,6H5A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3h9a3,3,0,0,0,3-2.89l3.56,1.78A1,1,0,0,0,21,17a1,1,0,0,0,.53-.15A1,1,0,0,0,22,16V8A1,1,0,0,0,21.53,7.15ZM15,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8h9a1,1,0,0,1,1,1Zm5-.62-3-1.5V11.12l3-1.5Z"/></svg>
//         : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M7.71,6.29h0l-4-4A1,1,0,0,0,2.29,3.71L4.62,6A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3h9a3,3,0,0,0,1.9-.69l4.39,4.4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42ZM14,16H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8H6.59l7.87,7.88A1,1,0,0,1,14,16Zm7.53-8.85a1,1,0,0,0-1,0L17,8.89A3,3,0,0,0,14,6H12.66a1,1,0,0,0,0,2H14a1,1,0,0,1,1,1v1.5h0a1.62,1.62,0,0,0,0,.19.65.65,0,0,0,.05.2h0s.05.06.07.1a1,1,0,0,0,.15.21s.1.06.15.1l.17.11a.85.85,0,0,0,.23,0,.7.7,0,0,0,.14,0h0a1.62,1.62,0,0,0,.19,0,.65.65,0,0,0,.2-.05h0L20,9.62v5.72a1,1,0,1,0,2,0V8A1,1,0,0,0,21.53,7.15Z"/></svg>}

//        </button>

//       <button className={mute ? 'btn-off' : 'btn-on'} onClick={() => muteUnmute(mute)}>{mute ?
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M10.5,3.73a2,2,0,0,1,2.95-.14A2,2,0,0,1,14,5V8.41a1,1,0,0,0,2,0V5A4,4,0,0,0,9,2.47,1,1,0,1,0,10.5,3.73Zm8.22,9.54.2,0a1,1,0,0,0,1-.81A7.91,7.91,0,0,0,20,11a1,1,0,0,0-2,0,5.54,5.54,0,0,1-.11,1.1A1,1,0,0,0,18.72,13.27Zm3,6.06-18-18a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L8,8.48V11a4,4,0,0,0,6,3.46l1.46,1.46A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93a7.87,7.87,0,0,0,3.85-1.59l3.4,3.4a1,1,0,0,0,1.42-1.41ZM12,13a2,2,0,0,1-2-2v-.52l2.45,2.46A1.74,1.74,0,0,1,12,13Z"/></svg>
//         : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B6B6D" d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z"/></svg>}
//         </button>
//     </div>
//   </div>
// );
// }; */}


export default Meeting;
