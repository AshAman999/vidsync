import ReactPlayer from "react-player";
import React, { useState, useRef, useEffect } from "react";
import { notifyRoom, notifyAllInRoom } from "../Helpers/Helper";
import { Notify } from "../Helpers/Notify";

function MainScreen({ socket, username, room }) {
  const playerRef = useRef(null);
  const [text, setText] = useState("");
  const [url, seturl] = useState("https://www.youtube.com/watch?v=UVCP4bKy9Iw");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const onSubmit = async () => {
    if (text !== "") {
      const videoData = {
        room: room,
        author: username,
        url: text,
      };
      await socket.emit("videourl", videoData);
      seturl(text);
      await notifyAllInRoom(
        room,
        `${username} changed the video to ${text}`,
        socket
      );

      setText("");
    } else {
      Notify("Empty input box, no url found");
    }
  };
  const onError = (e) => {
    Notify("Some error occured, check the url again");
  };

  const onPlay = async () => {
    const playData = {
      room: room,
      author: username,
      isPlaying: true,
    };
    await socket.emit("play", playData);
    await notifyAllInRoom(room, `${username} played the video`, socket);
  };
  const onPause = async () => {
    const playData = {
      room: room,
      author: username,
      isPlaying: false,
    };
    await socket.emit("pause", playData);
    await notifyAllInRoom(room, `${username} paused the video`, socket);
  };
  // eslint-disable-next-line no-unused-vars
  const onSeek = async (e) => {
    const playData = {
      room: room,
      author: username,
      isPlaying: false,
      seek: e.target.value,
    };
    await socket.emit("pause", playData);
    await notifyRoom(room, `${username} seeked the video to`, socket);
  };

  useEffect(() => {
    socket.on("videourl", (data) => {
      seturl(data.url);
      setText("");
    });
    socket.on("play", (data) => {
      setPlaying(data.isPlaying);
    });
    socket.on("play_all", (data) => {
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
          controls
          playing={playing}
          url={url}
          playbackRate={playbackRate}
          onBuffer={() => onPause()}
          onBufferEnd={() => onPlay()}
          onError={(e) => onError(e)}
          onEnded={() => console.log("ended")}
          onPause={() => onPause()}
          onPlay={() => onPlay()}
          ref={playerRef}
          // onDuration={(duration) => console.log(duration)}
          // onProgress={(progress) => console.log(progress)}
          onSeek={(seek) => console.log(seek)}
          // className="react-player"
          // width="700px"
          // height="400px"
        />
      </div>
      <h1>{room}</h1>
      <input
        className="urlInputBox"
        placeholder="Enter a youtube Url"
        type="text"
        required
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
