import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactAudioPlayer from "react-audio-player";
import { URL_AUDIO } from "src/modules/DoingExercise/const";

export const AudioType = {
  Primary: "primary",
  Secondary: "secondary",
};

const AudioComponent = ({ variant, isFullSrc, src, ...props }) => {
  if (!src) return null;

  if (variant === AudioType.Primary) {
    return (
      <div className="audio-wrapper">
        <AudioPlayer
          src={isFullSrc ? src : `${URL_AUDIO}${src}`}
          autoPlay={false}
          autoPlayAfterSrcChange={false}
          {...props}
        />
      </div>
    );
  }

  return (
    <ReactAudioPlayer
      src={isFullSrc ? src : `${URL_AUDIO}${src}`}
      autoPlay={false}
      controls
      {...props}
    />
  );
};
export default AudioComponent;

