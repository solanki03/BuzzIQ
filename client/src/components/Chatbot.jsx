import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "40px",
          height: "40px",
          backgroundColor: "#000",
          borderRadius: "50%",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        <img src="src/assets/images/chat-ai-fill.png" alt="Chatbot Icon" className="h-9" />
      </div>

      {/* Chatbox Popup */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "360px",
            height: "600px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            overflow: "hidden",
            zIndex: 9998,
          }}
        >
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/m6oOAmxpSuFs-JVdm72G0"
            width="100%"
            height="100%"
            frameBorder="0"
            title="BuzzIQ Chatbot"
          />
        </div>
      )}
    </>
  );
};

export default Chatbot;
