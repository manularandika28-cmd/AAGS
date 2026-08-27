import React from 'react';
import backgroundVideo from '../Assets/BackgroundVideo.mp4';

const BackgroundVideo = () => {
  return (
    <>
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Dark/white overlay so your UI remains readable */}
      <div className="fixed inset-0 bg-white/70 -z-10 pointer-events-none" />
    </>
  );
};

export default BackgroundVideo;