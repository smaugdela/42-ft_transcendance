import React, { useEffect } from 'react';
import { useQuery} from "@tanstack/react-query";
import toast from 'react-hot-toast';
import '../../styles/Tab_channels.css';
import { getAllChannels } from '../../api/APIHandler';
import ChanCreationForm from './ChanCreationForm';
import ChannelLink from './ChannelLink';

export default function TabMore() {

	const channelsQuery = useQuery({
		queryKey: ['allChannels'],
		queryFn: () => getAllChannels(),
	});

	
	if (channelsQuery.error instanceof Error){
		toast.error('Error fetching your convos');
	}
	if (channelsQuery.isLoading || !channelsQuery.isSuccess){
		toast.loading("Loading...");
	}


	const publicAndPrivateChans = channelsQuery?.data;

	return (
	<div className='channels_page'>
		<h2>Want more? Create your own channel or join others!</h2>
		<ChanCreationForm />
		<h2>Channels that are waiting for you</h2>
		<>
		{
			publicAndPrivateChans && (
				publicAndPrivateChans.map((chan) => {
					return (
						<ChannelLink key={chan.id.toString()} channel={chan} />
					);
			})
			)
		}
	  </>
	</div>
  )
}