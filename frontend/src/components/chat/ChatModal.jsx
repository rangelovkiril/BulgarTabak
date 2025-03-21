import React, { useState, useEffect, useRef } from "react";
import "../../styles/chat.css";

const ChatModal = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem(`chat_${friend.id}`) || "[]"
    );
    setMessages(savedMessages);
  }, [friend.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add auto-reply for demo purposes
    const autoReply = {
      id: Date.now() + 1,
      text: `Hi! This is an automated response from ${friend.name}`,
      sender: "friend",
      timestamp: new Date(Date.now() + 1000).toISOString(),
    };

    const updatedMessages = [...messages, message, autoReply];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${friend.id}`, JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <img src={friend.avatar} alt={friend.name} className="chat-avatar" />
          <h3>{friend.name}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "sent" : "received"
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
