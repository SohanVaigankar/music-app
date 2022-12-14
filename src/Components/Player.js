import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faAngleLeft,
  faAngleRight,
  faVolumeXmark,
  faVolumeLow,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  currentSong,
  setCurrentSong,
  songs,
  setSongs,
  setSongDirection,
}) => {
  // state to keep track of voulme
  const [volume, setVolume] = useState(10);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  useEffect(() => {
    mute ? setVolume(0) : setVolume(30);
  }, [mute]);

  const activeLibraryHandler = async (newSong) => {
    const songsWithUpdatedInfo = songs.map((song) => {
      return song.id === newSong.id
        ? { ...song, active: true }
        : { ...song, active: false };
    });

    await setSongs(songsWithUpdatedInfo);
  };

  // Event Handlers
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Drag event handler : playing music from specific time
  const dragEventHandler = (event) => {
    audioRef.current.currentTime = event.target.value;
    setSongInfo({ ...songInfo, currentTime: event.target.value });
  };

  // function  to format the playback time of song
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  // function for skipping to the next song or previous song
  const skipSongHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "previous") {
      currentIndex === 0 ? (currentIndex = songs.length - 1) : currentIndex--;
      setSongDirection("left");
    } else {
      currentIndex === songs.length - 1 ? (currentIndex = 0) : currentIndex++;
      setSongDirection("right");
    }
    await setCurrentSong(songs[currentIndex]);
    activeLibraryHandler(songs[currentIndex]);
    (await isPlaying) ? audioRef.current.play() : audioRef.current.pause();
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <input
          type="range"
          min={0}
          max={songInfo.duration || 0}
          value={songInfo.currentTime}
          onChange={dragEventHandler}
        />
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          className="skip-back"
          onClick={() => skipSongHandler("previous")}
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          className="play"
          onClick={playSongHandler}
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className="skip-forward"
          onClick={() => skipSongHandler("next")}
          size="2x"
          icon={faAngleRight}
        />
      </div>
      <div className="volume-control">
        <FontAwesomeIcon
          icon={
            volume < 1 || mute
              ? faVolumeXmark
              : volume < 50
              ? faVolumeLow
              : faVolumeHigh
          }
          className="volume-icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMute(!mute);
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mute && volume > 1 ? setMute(false) : setVolume(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Player;
