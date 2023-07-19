import React,  { useState }  from 'react';
import '../styles/Chat.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";
import TabChannels from './ChatElements/TabChannels';
import TabChat from './ChatElements/TabChat';
import TabMore from './ChatElements/TabMore';
import { Socket } from 'socket.io-client';
import { useQuery } from "@tanstack/react-query";
import '../styles/Tab_channels.css';
import { getAllUserChannels } from '../api/APIHandler';
import { IChannel } from '../api/types';

interface Tab {
  label: string;
  content: JSX.Element;
}

const Chat = ({ setSocket }: { setSocket: React.Dispatch<React.SetStateAction<Socket | null>> }) => {
	
	const [isExpanded, setIsExpanded] = useState(true);
	const [activeTab, setActiveTab] = useState(0);
	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	
	const handleTabClick = (index: number) => {
		setActiveTab(index);
	};
	
	// Récupérer les chans qu'on a!!!
	const { data, status } = useQuery(['channels'], getAllUserChannels);
	
	const [activeConv, setActiveConv] = useState<IChannel | null>((data)? data[0] : null);

	if (status === "error"){
		return <div>Error</div>
	}
	if (status === "loading" ){
		return <div>Loading...</div>
	}

	var tabs: Tab[] = [
	{ label: 'Convs', content: <div><TabChannels joinedChannels={data} setActiveTab={setActiveTab} setActiveConv={setActiveConv} /></div> },
	{ label: 'Chat', content: <div><TabChat setSocket={setSocket} conv={activeConv}/></div> },
	{ label: 'More', content: <div><TabMore /></div> },
	];

	return (
		<div className={`chat ${isExpanded ? 'expanded' : 'collapsed'}`}>
			<div className="toggle-button" onClick={toggleExpand}>
			{isExpanded ? <FontAwesomeIcon icon={faAnglesLeft}/> : <FontAwesomeIcon icon={faAnglesRight}/>} 
			</div>

			<div className="content">
			{ 
				tabs.map((tab, index) => (
					<div
					key={index}
					className={`tab ${index === activeTab ? 'active' : ''}`}
					onClick={() => handleTabClick(index)}>
					<button className='chat_button'>{tab.label}</button>
					</div>
				))
			}
			</div>
			<div className="tab-content">{tabs[activeTab].content}</div>
		</div>
		);
};

export default Chat;
