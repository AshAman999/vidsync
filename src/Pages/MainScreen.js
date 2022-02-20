import ReactPlayer from "react-player";
import React, { useState, useRef, useEffect } from "react";

function MainScreen({ socket, username, room }) {
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
      setText("");
    });
    socket.on("play", (data) => {
      setPlaying(data.isPlaying);
    });
    socket.on("pause", (data) => {
      setPlaying(data.isPlaying);
    });
    socket.on("setPlaybackRate", (data) => {
      setPlaybackRate(data.playbackRate);
    });
  }, [socket]);

  return (
    <div>
      {/*TODO add video player to support playlist feature */}
      <div className="videoPlayer">
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
          // onDuration={(duration) => console.log(duration)}
          // onProgress={(progress) => console.log(progress)}
          // onSeek={(seek) => console.log(seek)}

          className="react-player"
          width="700px"
          height="400px"
        />
      </div>
      <input
        className="urlInputBox"
        placeholder="Enter a youtube Url"
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button className="submitButton" onClick={() => onSubmit()}>
        Submit
      </button>
    </div>
  );
}

export default MainScreen;
