import React, { useState } from "react";
import chatBot from "../assets/images/chatbot.png"; 
import closePane from "../assets/images/close-pane.png"; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-12 h-12 bg-black rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110"
      >
        <img 
          src={isOpen ? closePane : chatBot} 
          alt="Chatbot Toggle Icon" 
          className="h-12 w-12 object-cover" 
        />
      </button>

      {/* Chatbox Popup */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 w-80 h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden"
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
