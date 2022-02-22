import React, { Fragment, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { getCurrentTime } from "../Helpers/GetCurrentTime";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([
    {
      room: room,
      author: "admin",
      message: `Welcome to the chat! ${username}`,
      time: getCurrentTime(),
    },
  ]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: getCurrentTime(),
      };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Quick Chat online: {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, i) => {
            var idName = "";
            if (messageContent.author === username) idName = "you";
            else if (messageContent.author === "admin") idName = "admin";
            else idName = "other";
            return (
              <Fragment key={i}>
                <div className="message" id={idName}>
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </ScrollToBottom>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
