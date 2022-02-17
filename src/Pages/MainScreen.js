import ReactPlayer from "react-player";
import React, { useState, useRef, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

function MainScreen({ socket, username, room }) {
  // text input controller
  const playerRef = useRef(null);
  const [text, setText] = useState("");
  const [url, seturl] = useState("https://www.youtube.com/watch?v=UVCP4bKy9Iw");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playing, setPlaying] = useState(false);

  const onSubmit = async () => {
    const videoData = {
      room: room,
      author: username,
      url: text,
    };
    await socket.emit("videourl", videoData);
  };

  const onPlay = async () => {
    const playData = {
      room: room,
      author: username,
      isPlaying: true,
    };
    await socket.emit("play", playData);
  };
  const onPause = async () => {
    const playData = {
      room: room,
      author: username,
      isPlaying: false,
    };
    await socket.emit("pause", playData);
  };
  useEffect(() => {
    socket.on("videourl", (data) => {
      seturl(data.url);
      // console.log(data);
      setText("");
    });
    socket.on("play", (data) => {
      setPlaying(data.isPlaying);
      // console.log(data);
    });
    socket.on("pause", (data) => {
      setPlaying(data.isPlaying);
      // console.log(data);
    });
    socket.on("setPlaybackRate", (data) => {
      setPlaybackRate(data.playbackRate);
      // console.log(data);
    });
  }, [socket]);

  return (
    <div>
      {/*TODO add video player to support playlist feature */}
      <ReactPlayer
        controls={true}
        playing={playing}
        url={url}
        playbackRate={playbackRate}
        onBuffer={() => onPause()}
        onBufferEnd={() => onPlay()}
        onError={() => console.log("error")}
        onEnded={() => console.log("ended")}
        onPause={() => onPause()}
        onPlay={() => onPlay()}
        ref={playerRef}
        onDuration={(duration) => console.log(duration)}
        onProgress={(progress) => console.log(progress)}
        onSeek={(seek) => console.log(seek)}
        style={{
          padding: "15px",
          margin: "20px",
        }}
      />
      <input
        placeholder="Enter a youtube Url"
        style={{
          padding: "15px",
          margin: "30px",
          height: "30px",
          width: "500px",
        }}
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button
        style={{
          padding: "15px",
          margin: "15px",
          color: "white",
          backgroundColor: "green",
        }}
        onClick={() => onSubmit()}
      >
        Submit
      </button>
      <button
        onClick={() => {
          playerRef.seekTo(0);
        }}
      >
        Play
      </button>
      <button onClick={() => onPause()}>Pause</button>
      {/* <IconButton>
        {playerRef && playerRef.current.player.isPlaying ? (
          <PauseIcon onClick={() => onPause()} />
        ) : (
          <PlayArrowIcon onClick={() => onPlay()} />
        )}
      </IconButton> */}
    </div>
  );
}

export default MainScreen;
