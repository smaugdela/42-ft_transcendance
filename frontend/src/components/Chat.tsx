import React, { useState } from 'react';
import '../styles/Chat.css'

const Chat = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`chat ${isExpanded ?  'collapsed': 'expanded'}`}>
      <div className="toggle-button" onClick={toggleExpand}>
        {/* <image> "https://static-00.iconduck.com/assets.00/left-right-black-arrow-emoji-512x283-7vr1z2oc.png"</image> */}
        {isExpanded ? '⬅' : '➡'} 
      </div>
      <input type="text" className="text-input" placeholder="Envoyer un message" />
      <div className="content">
        {"Simon : Bonjour"}
      </div>
    </div>
  );
};


export default Chat;
