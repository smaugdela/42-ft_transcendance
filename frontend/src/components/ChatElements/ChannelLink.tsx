import { useQuery } from '@tanstack/react-query';
import { IChannel } from "../../api/types";
import '../../styles/Tab_channels.css';
import { fetchMe, getAllMsgsofChannel } from "../../api/APIHandler";
import { useState, useEffect } from "react";

function getTimeSinceLastMsg(lastMessageDate: Date) {
	const date = (lastMessageDate instanceof Date) ? lastMessageDate : new Date(lastMessageDate);
	const formatter = new Intl.RelativeTimeFormat('en');
	const ranges = {
		years: 3600 * 24 * 365,
		months: 3600 * 24 * 30,
		weeks: 3600 * 24 * 7,
		days: 3600 * 24,
		hours: 3600,
		minutes: 60,
		seconds: 1
	};
	const secondsElapsed = (date.getTime() - Date.now()) / 1000;
	for (let key in ranges) {
		if (ranges[key as keyof typeof ranges] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key as keyof typeof ranges];
			return formatter.format(Math.round(delta), key as keyof typeof ranges);
		}
	}
}

export default function ChannelLink({ channel }: { channel: IChannel }) {

	const [convName, setConvName] = useState<string>(channel.roomName);
	const {data, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});
	const { data: messages, status: msgStatus } = useQuery({
		queryKey: ['messages', channel.id],
		queryFn: () => getAllMsgsofChannel(channel.id),
		// refetchInterval: 100,
	});

	useEffect(() => {
		if (channel.type === 'DM' && data) {
			setConvName(channel.roomName.replace(data?.nickname, '').trim());
		}
	}, [data, channel.type, channel.roomName]);
	
	if (error || msgStatus === "error") {
		return <div>Error</div>
	}
	if (isLoading || !isSuccess  || msgStatus === "loading" || msgStatus !== "success") {
		return <div>Loading...</div>
	}

	return (
		<div  className="channel-link-card" >
			<span className='channel-link-name'>{convName} </span><span className="channel-link-span">{channel.type}</span>
			{
				messages.length > 0 &&
				<>
					<p>{messages[messages?.length - 1].from.nickname} : {(messages[messages?.length - 1].content.length <= 50)? messages[messages?.length - 1].content : messages[messages?.length - 1].content.substring(0,45) + '...'}</p>
					<p>{getTimeSinceLastMsg(messages[messages?.length - 1].date)}</p>
				</>
			}
		</div>
	);
}