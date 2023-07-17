import { IChannel } from "../../api/types";
import '../../styles/Tab_channels.css';

export default function ChannelLink({ channel }: { channel: IChannel }) {
	return (
		<div className="channel-link-card">
			<h3>{channel.roomName} ({channel.type})</h3>
			<p>Last message...</p>
		</div>
	);
}