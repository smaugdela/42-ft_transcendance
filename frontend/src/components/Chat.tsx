import React, { useState } from 'react';
import '../styles/Chat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faComment, faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";




const Chat = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // const SidebarData = [
  //   {
  //     image: <FontAwesomeIcon className='item_image' icon={faCat} />,
  //   }
  // ];
  return (
    <div className={`chat ${isExpanded ?  'collapsed': 'expanded'}`}>
      <div className="toggle-button" onClick={toggleExpand}>
      {/* <div> </div> */}
        {isExpanded ? <FontAwesomeIcon icon={faAnglesLeft}/> : <FontAwesomeIcon icon={faAnglesRight}/>} 
      </div>
      <input type="text" className="text-input" placeholder="Envoyer un message" />
      <div className="content">
        {"Simon : Bonjour"}
      </div>
    </div>
  );
};


export default Chat;
