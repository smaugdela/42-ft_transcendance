import React from 'react';
import { useQuery} from "@tanstack/react-query";
import toast from 'react-hot-toast';
import '../../styles/Tab_channels.css';
import { getAllChannels } from '../../api/APIHandler';
import ChanCreationForm from './ChanCreationForm';
import { IChannel } from '../../api/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import '../../styles/Tab_channels.css'
import { updateMeInChannel } from '../../api/APIHandler';
import ChannelLink from './ChannelLink';

export default function TabMore() {

	const channelsQuery = useQuery({queryKey: ['channels'], queryFn: () => getAllChannels()});
	const queryClient = useQueryClient();
	
		const joinChannelRequest = useMutation({
			mutationFn: (channel: IChannel) => updateMeInChannel(channel.id, "joinedUsers", "connect"),
			onSuccess: () => { 
				queryClient.invalidateQueries(['channels']);
				toast.success(`You joined the channel!`) 
			},
			onError: () => { toast.error('Error : cannot join channel') }
		})
	
		const handleClick = (event: React.FormEvent<HTMLDivElement>, channel: IChannel) => {
			event.preventDefault();
			joinChannelRequest.mutate(channel);
		};

	if (channelsQuery.error instanceof Error){
		toast.error('Error fetching your convos');
	}
	if (channelsQuery.isLoading || !channelsQuery.isSuccess){
		<div>Loading...</div>
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
						<div key={(chan.id + 1).toString()} onClick={(event) => handleClick(event, chan)}>
							<ChannelLink key={chan.id.toString()} channel={chan} />
						</div>
					);
			})
			)
		}
	  </>
	</div>
  )
}