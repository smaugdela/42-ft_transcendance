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
			<div className="channel-link-header">
				<span className='channel-link-name'>{convName} </span>
				<span className="channel-link-span">{channel.type}</span>
			</div>
			{
				messages.length > 0 &&
				<>
					<div className='channel-link-preview'>
						<p > 
							<span className="channel-link-messenger">{messages[messages.length - 1].from.nickname} : </span> 
							<span className='channel-link-lastmsg'>{
								(messages[messages?.length - 1].content.length <= 40)? 
									messages[messages?.length - 1].content 
									: messages[messages?.length - 1].content.substring(0,37) + '...'
							}
							</span>
						</p>
						<p className='channel-link-date'>{getTimeSinceLastMsg(messages[messages?.length - 1].date)}</p>
					</div>
				</>
			}
			{
				messages.length === 0 &&
				<div className="channel-link-messenger">Click to write down your first message!</div> 
			}
		</div>
	);
}