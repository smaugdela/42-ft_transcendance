import React, { useState } from 'react';
import '../styles/Chat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";
import TabChannels from './TabChannels';
import TabChat from './TabChat';
import TabMore from './ChatElements/TabMore';
import { Socket } from 'socket.io-client';

interface Tab {
  label: string;
  content: JSX.Element;
}

const Chat = ({ setSocket }: { setSocket: React.Dispatch<React.SetStateAction<Socket | null>> }) => {
	
	const [isExpanded, setIsExpanded] = useState(true);
	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const [activeTab, setActiveTab] = useState(0);
	const tabs: Tab[] = [
		{ label: 'Convs', content: <div><TabChannels/></div> },
		{ label: 'Chat', content: <div><TabChat setSocket={setSocket}/></div> },
		{ label: 'More', content: <div><TabMore /></div> },
	];
	const handleTabClick = (index: number) => {
		setActiveTab(index);
	};

  return (
	<div className={`chat ${isExpanded ? 'expanded' : 'collapsed'}`}>
		<div className="toggle-button" onClick={toggleExpand}>
		{isExpanded ? <FontAwesomeIcon icon={faAnglesLeft}/> : <FontAwesomeIcon icon={faAnglesRight}/>} 
		</div>
     
		<div className="content">
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
