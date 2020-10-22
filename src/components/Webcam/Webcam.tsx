import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

export const WebcamComponent = ({ videoRef }: any) => {
  const webcamRef = React.useRef(null);

  console.log(webcamRef.current);
  useEffect(() => {
    (webcamRef.current! as any).video.srcObject = videoRef;
  }, [videoRef]);
  return <Webcam ref={webcamRef}/>;
};
