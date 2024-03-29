import { useRef, useEffect, useState } from "react";
import "../App.css";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";

const Chat = ({ app, nakama, matchId }) => {
  const [chats, setChats] = useState([]);
  const [chatValue, setChatValue] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const inputRef = useRef();

  const onKeypress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };
  const handleChatValue = (e) => {
    setChatValue(e.target.value);
  };
  const handleSendMessage = () => {
    if (!app) return;
    const messageData = { message: chatValue };
    nakama.socket.writeChatMessage(`2...${matchId}`, messageData);
    setChatValue("");
    inputRef.current.focus();
  };
  const onGetChat = (data) => {
    const username = data.username;
    const message = data.content.message;

    const chat = {
      username: username,
      message: message,
    };
    setChats((prev) => {
      let temp = [...prev, chat];
      if (temp.length > 7) temp = temp.slice(1, temp.length);
      return temp;
    });
  };
  useEffect(() => {
    app.on("chat#speak", onGetChat);
    return () => {
      app.off("chat#speak", onGetChat);
    };
  }, []);

  return (
    <div className="chat_container">
      <div className={chatOpen ? "chat_on" : "chat_off"}>
        <span className="chat_title">Chat</span>
        {chats.length > 0 &&
          chats.map((chat, idx) => (
            <div className="chats" key={idx}>
              <span className="chats_name">{chat.username}</span>
              <span className="chats_message">{chat.message}</span>
            </div>
          ))}
      </div>
      <div className={chatOpen ? "chat_button_on" : "chat_button_off"} onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? <CommentsDisabledIcon /> : <CommentIcon />}
      </div>
      <input
        className="chat_input"
        ref={inputRef}
        onKeyPress={onKeypress}
        onFocus={() => app.fire("move#disable", false)}
        onBlur={() => app.fire("move#able", true)}
        value={chatValue}
        onChange={handleChatValue}
        placeholder="메세지를 전달해보세요"
      ></input>
      <button className="chat_button" onClick={handleSendMessage}>
        <SendIcon />
      </button>
    </div>
  );
};

export default Chat;
