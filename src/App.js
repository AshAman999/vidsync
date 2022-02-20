import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import MainScreen from "./Pages/MainScreen";
import Chat from "./Pages/Chat";
import Nav from "./Pages/nav";
const socket = io.connect("http://localhost:3002");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [visibility, setVisibility] = useState(true);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { room: room, author: username });
      setShowChat(true);
    }
  };
  const createRoom = () => {
    if (username !== "") {
      //generate random room name string uuid
      const roomName = Math.random().toString(36).substring(2, 15);
      socket.emit("join_room", { room: roomName, author: username });
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          {visibility ? (
            <div>
              <h3>Join A Room</h3>
              <form>
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
                  }}
                />
                <button onClick={joinRoom}>Join A Room</button>
                
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
            <div>
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
          <Nav />
          <div className="container">
            <div className="row">
              <div className="col1">
                <MainScreen socket={socket} username={username} room={room} />
              </div>
              <div className="col2">
                <Chat socket={socket} username={username} room={room} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
