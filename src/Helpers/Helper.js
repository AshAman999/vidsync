import { getCurrentTime } from "../Helpers/GetCurrentTime";


async function notifyRoom(room, message, socket) {
  const messageData = {
    room: room,
    author: "admin",
    message: `${message}`,
    time: getCurrentTime(),
  };
  await socket.emit("notify_people", messageData);
}
async function notifyAllInRoom(room, message, socket) {
  const messageData = {
    room: room,
    author: "admin",
    message: `${message}`,
    time: getCurrentTime(),
  };
  await socket.emit("notify_people", messageData);
}

export {notifyRoom, notifyAllInRoom };
