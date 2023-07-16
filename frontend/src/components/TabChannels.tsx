import React, { useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import '../styles/Tab_channels.css';
import { getAllUserChannels } from '../api/APIHandler';
import ChannelLink from './ChatElements/ChannelLink';

export default function TabChannels() {

	const channelsQuery = useQuery({
		queryKey: ['channels'],
		queryFn: () => getAllUserChannels(),
	});

	useEffect(() => {	
		if (channelsQuery.error instanceof Error){
			toast.error('Error fetching your convos');
		}
		if (channelsQuery.isLoading || !channelsQuery.isSuccess){
			toast.loading("Loading...");
		}
	}, [channelsQuery.error, channelsQuery.isLoading, channelsQuery.isSuccess]);

	const joinedChannels = channelsQuery?.data;
	return (
	<div className='channels_page'>
	  <>
	  {
		joinedChannels && (
			joinedChannels.map((chan) => {
				return (
					<ChannelLink key={chan.id.toString()} channel={chan}/>
				);
		})
		)
	  }
	  </>
	</div>
  )
}
