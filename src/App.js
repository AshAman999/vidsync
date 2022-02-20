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

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { room: room, author: username });
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Room</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
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
