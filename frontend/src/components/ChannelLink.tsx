import { IChannel } from "../api/types";
import toast from 'react-hot-toast';

export default function ChannelLink({ channel }: { channel: IChannel }) {
	if (!channel.roomName){
		return <div>{toast("Loading...")}</div>
	}
	
	return (
		<div className="channel-link-card">
			<h3>{channel.roomName} ({channel.type})</h3>
			<p>Last message...</p>
		</div>
	);
}