import React, { useState } from 'react';
import '../styles/Chat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faComment, faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";
import Tab_channels from './Tab_channels';

interface Tab {
  label: string;
  content: JSX.Element;
}



const Chat = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };



  const [activeTab, setActiveTab] = useState(0);
  const tabs: Tab[] = [
    { label: 'Channels', content: <div><Tab_channels/></div> },
    { label: 'Chat', content: <div>Content 1</div> },
    { label: 'Settings', content: <div>Content 3</div> },
  ];
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };



  return (
    <div className={`chat ${isExpanded ?  'collapsed': 'expanded'}`}>
      <div className="toggle-button" onClick={toggleExpand}>
        {isExpanded ? <FontAwesomeIcon icon={faAnglesLeft}/> : <FontAwesomeIcon icon={faAnglesRight}/>} 
      </div>
      <input type="text" className="text-input" placeholder="Envoyer un message" />
      <div className="content">
        {/* {"Simon : Bonjour"} */}
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}>
            <button className='chat_button'>{tab.label}</button>
          </div>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
      </div>
    // </div>
  );
};


export default Chat;
