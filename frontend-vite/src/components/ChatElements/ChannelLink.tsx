import { useQuery } from '@tanstack/react-query';
import { IChannel } from "../../api/types";
import '../../styles/Tab_channels.css';
import { fetchMe } from "../../api/APIHandler";
import { useState, useEffect } from "react";

export default function ChannelLink({ channel }: { channel: IChannel }) {

	const [convName, setConvName] = useState<string>(channel.roomName);
	const {data, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});

	useEffect(() => {
		if (channel.type === 'DM' && data) {
			setConvName(channel.roomName.replace(data?.nickname, '').trim());
		}
	}, [data, channel.type, channel.roomName]);
	
	if (error) {
		return <div>Error</div>
	}
	if (isLoading || !isSuccess) {
		return <div>Loading...</div>
	}
	return (
		<div  className="channel-link-card" >
			<h3>{convName} ({channel.type})</h3>
			<p>Last message...</p>
		</div>
	);
}