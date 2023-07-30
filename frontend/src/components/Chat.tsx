import React,  { useContext }  from 'react';
import '../styles/Chat.css';
import '../styles/Tab_channels.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";
import TabChannels from './ChatElements/TabChannels';
import TabChat from './ChatElements/TabChat';
import TabMore from './ChatElements/TabMore';
import { Socket } from 'socket.io-client';
import { useQuery } from "@tanstack/react-query";
import { getAllUserChannels, fetchMe } from '../api/APIHandler';
import { ChatStatusContext } from '../context/contexts';

interface Tab {
  label: string;
  content: JSX.Element;
}

const Chat = ({ setSocket }: { setSocket: React.Dispatch<React.SetStateAction<Socket | null>> }) => {
	const {data: userMe, status: statusMe } = useQuery({queryKey: ['user'], queryFn: fetchMe});

	const { data, status } = useQuery({
		queryKey: ['channels'], 
		queryFn: getAllUserChannels
	});
	const { activeTab, setActiveTab, activeConv, isExpanded, setIsExpanded } = useContext(ChatStatusContext);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	
	const handleTabClick = (index: number) => {
		setActiveTab(index);
	};
	
	if (status === "error" || statusMe === "error"){
		return <div>Error</div>
	}
	if (status === "loading" || statusMe === "loading" ){
		return <div>Loading...</div>
	}
	
	var tabs: Tab[] = [
				 { label: 'Convs', content: <div><TabChannels joinedChannels={data}/></div> },
	activeConv ? { label: 'Chat', content: <div><TabChat conv={activeConv} loggedUser={userMe}/></div> } : { label: 'Chat', content: <div>Join convos to see the chat!</div> },
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
