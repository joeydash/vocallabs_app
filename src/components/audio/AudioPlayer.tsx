import React from 'react';
import { PlayButton } from './controls/PlayButton';
import { DownloadButton } from './controls/DownloadButton';
import { TimeDisplay } from './controls/TimeDisplay';
import { ProgressBar } from './controls/ProgressBar';
import { useAudioPlayer } from './hooks/useAudioPlayer';

interface AudioPlayerProps {
  url: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ url, autoPlay = false }: AudioPlayerProps) {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    handleSeek,
    handleDownload,
  } = useAudioPlayer({ url, autoPlay });

  return (
    <div className="flex flex-col space-y-3">
      {/* Mobile Time Display */}
      <div className="md:hidden px-2">
        <TimeDisplay
          currentTime={currentTime}
          duration={duration}
          isMobile={true}
        />
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <PlayButton isPlaying={isPlaying} onClick={togglePlay} />
          <TimeDisplay currentTime={currentTime} duration={duration} />
        </div>
        <DownloadButton onDownload={handleDownload} />
      </div>

      <audio ref={audioRef} src={url} preload="metadata" />
    </div>
  );
}
