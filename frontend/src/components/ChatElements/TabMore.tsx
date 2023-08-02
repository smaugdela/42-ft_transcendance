import { useQuery} from "@tanstack/react-query";
import '../../styles/Tab_channels.css';
import { getNonJoinedChannels } from '../../api/APIHandler';
import ChanCreationForm from './ChanCreationForm';
import { IChannel } from '../../api/types';
import '../../styles/Tab_channels.css'
import ChannelMore from './ChannelMore';

export default function TabMore() {

	const { data: nonJoinedChannels, error, isLoading, isSuccess } = useQuery({queryKey: ['channels'], queryFn: getNonJoinedChannels});
	
	if (error){
		return <div>Error</div>
	}
	if (isLoading || !isSuccess){
		return <div>Loading...</div>
	}

	const publicAndPrivateChans: IChannel[] = nonJoinedChannels;

	return (
	<div className='channels_page'>
		<h2>Want more? Create your own channel or join others!</h2>
		<ChanCreationForm />
		<h2>Channels that are waiting for you</h2>
		<>
		{
			publicAndPrivateChans && Array.isArray(publicAndPrivateChans) && (
				publicAndPrivateChans.map((chan) => {
					return (
						<ChannelMore key={chan.id.toString()} channel={chan} />	
					);
				})
			)
		}
		</>
	</div>
  )
}