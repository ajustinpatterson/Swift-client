import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './PowderRoom.scss';

const PowderRoom = () => {
  const [muted, setMuted] = useState<Boolean>(false);
  const [videoOn, setVideoOn] = useState<Boolean>(true);
  const history = useHistory();

  const muteClick = (event: any) => {
    setMuted(!muted);
  };

  const videoClick = (event: any) => {
    setVideoOn(!videoOn);
  };

  const leaveClick = () => {
    history.push('/');
  };

  const enterClick = () => {
    history.push('/meeting');
  };

  return (
    <div className="pwdrcontainer">
      <div className="pwdrnavbar">
        {!muted ? (
          <button className="btn-off" onClick={muteClick}>
            <img src={require('../../assets/microphone.svg')} />
          </button>
        ) : (
          <button className="btn-on" onClick={muteClick}>
            <img src={require('../../assets/microphone-slash.svg')} />
          </button>
        )}
        <button className="play-on" onClick={enterClick}>
          <img src={require('../../assets/play.svg')} />
        </button>
        <button className="exit-on" onClick={leaveClick}>
          <img src={require('../../assets/exit.svg')} />
        </button>
        {videoOn ? (
          <button className="btn-on" onClick={videoClick}>
            <img src={require('../../assets/video.svg')} />
          </button>
        ) : (
          <button className="btn-off" onClick={videoClick}>
            <img src={require('../../assets/video-slash.svg')} />
          </button>
        )}
      </div>
    </div>
  )
};

export default PowderRoom;
