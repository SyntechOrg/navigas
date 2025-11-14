import React from "react";

const Video = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <video
        src="https://res.cloudinary.com/duwiosb7t/video/upload/v1762786278/videoNav_g5gwuz.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Video;
