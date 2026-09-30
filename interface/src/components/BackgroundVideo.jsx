import React from 'react';
import backgroundVideo from '../Assets/BackgroundVideo.mp4';
import useTheme from '../hooks/useTheme';

const BackgroundVideo = () => {
  useTheme(); // applies the saved theme (light/dark) to <html> on every page

  return (
    <>
      <video
        className="bg-video fixed inset-0 w-full h-full object-cover -z-10"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Theme-aware overlay (see glass.css) */}
      <div className="bg-overlay fixed inset-0 -z-10 pointer-events-none" />
    </>
  );
};

export default BackgroundVideo;