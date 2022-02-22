import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import MainScreen from "./Pages/MainScreen";
import Chat from "./Pages/Chat";
import CopyToClipboard from "react-copy-to-clipboard";
const socket = io.connect("http://localhost:3002");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const [roomName, setRoomName] = useState("");
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { room: roomName, author: username });
      setShowChat(true);
    }
  };
  const createRoom = () => {
    if (username !== "") {
      //generate random room name string uuid
      var rid = Math.random().toString(36).substring(2, 15)
      setRoomName(rid);
      socket.emit("join_room", { room: rid, author: username });
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          {visibility ? (
            <div className="joinchatc">
              <h3>Join A Room</h3>
              <form className="form">
                <input
                  type="text"
                  required
                  placeholder="Nickname..."
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Room ID..."
                  onChange={(event) => {
                    setRoom(event.target.value);
                    setRoomName(event.target.value);
                  }}
                />
                <button onClick={() => {
                  joinRoom();
                }}>Join A Room</button>
              </form>
              <button
                id="createroombutton"
                onClick={() => {
                  setVisibility(false);
                }}
              >
                Create One Instead
              </button>
            </div>
          ) : (
            <div className="joinchatc">
              <h3>Create A Room</h3>
              <form>
                <input
                  type="text"
                  required
                  placeholder="Nickname..."
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />

                <button onClick={createRoom}>Create A Room</button>
              </form>
              <button
                id="createroombutton"
                onClick={() => {
                  setVisibility(true);
                }}
              >
                Join a Room
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="container">
            <div className="row">
              <div className="col1">
                <MainScreen socket={socket} username={username} room={roomName} />
              </div>
              <div className="col2">
                <Chat socket={socket} username={username} room={roomName} />
                <h4>
                  {roomName}
                </h4>
                <CopyToClipboard text={roomName}>

                  <button>Copy to clipboard</button>
                </CopyToClipboard>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
