import { useQuery} from "@tanstack/react-query";
import '../../styles/Tab_channels.css';
import { getNonJoinedChannels } from '../../api/APIHandler';
import ChanCreationForm from './ChanCreationForm';
import { IChannel } from '../../api/types';
import '../../styles/Tab_more.css'
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
		<div id="tabmore_page">
			<h2 className="tabmore_page_title">Want more? Create your own channel or join others!</h2>
			<ChanCreationForm />
			<h2 className="tabmore_page_title">Channels that are waiting for you</h2>
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
			{ (!publicAndPrivateChans || (publicAndPrivateChans && publicAndPrivateChans.length === 0)) && 
				<div className='tabmore_page-noconv'>
					<h3>There is no public or protected channel you can join at the moment...</h3>
					<h6>It's time to take charge and create your own!</h6>
				</div>
			}
			</>
		</div>
	</div>
  )
}