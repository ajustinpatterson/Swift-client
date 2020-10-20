import React, { useState, useEffect } from 'react';
import './Meeting.scss';

const Meeting = () => {
  const [muted, setMuted] = useState<Boolean>(false);
  const [videoOn, setVideoOn] = useState<Boolean>(true);
  const [sharing, setSharing] = useState<Boolean>(false);

  const phnClick = (event: any) => {
    // endCall
  };

  const muteClick = (event: any) => {
    setMuted(!muted);
  };

  const videoClick = (event: any) => {
    setVideoOn(!videoOn);
  };

  const shareClick = (event: any) => {
    setSharing(!sharing);
  };

  return (
    <div className="mtngcontainer">
      <div className="cntrlbar">
        {!muted ? (
          <button className="btn-off" onClick={muteClick}>
            <img src={require('../../assets/microphone.svg')} />
          </button>
        ) : (
          <button className="btn-on" onClick={muteClick}>
            <img src={require('../../assets/microphone-slash.svg')} />
          </button>
        )}
        <button className="phnbtn" onClick={phnClick}>
          <img src={require('../../assets/phone-alt.svg')} />
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
        {sharing ? (
          <button className="share-on" onClick={shareClick}>
            <img src={require('../../assets/monitor.svg')} />
          </button>
        ) : (
          <button className="share-off" onClick={shareClick}>
            <img src={require('../../assets/monitor.svg')} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Meeting;
