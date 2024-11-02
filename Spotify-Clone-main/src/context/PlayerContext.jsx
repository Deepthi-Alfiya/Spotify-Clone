// context/PlayerContext.jsx
import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef(null);
  const seekBg = useRef(null);
  const seekBar = useRef(null);

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    setTrack(songsData[id]);
    audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = () => {
    if (track.id > 0) {
      setTrack(songsData[track.id - 1]);
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = () => {
    if (track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]);
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const seekSong = (e) => {
    audioRef.current.currentTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      seekBar.current.style.width = `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%`;
      setTime({
        currentTime: {
          second: Math.floor(audioRef.current.currentTime % 60),
          minute: Math.floor(audioRef.current.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audioRef.current.duration % 60),
          minute: Math.floor(audioRef.current.duration / 60),
        },
      });
    };

    audioRef.current.ontimeupdate = handleTimeUpdate;

    return () => {
      audioRef.current.ontimeupdate = null; // Cleanup on unmount
    };
  }, [track]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return <PlayerContext.Provider value={contextValue}>{props.children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
