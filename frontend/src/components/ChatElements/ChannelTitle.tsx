import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { fetchMe, updateChannelProperties } from "../../api/APIHandler";
import { IChannel } from "../../api/types";

export function ChannelTitle({ conv, initialName } : { conv: IChannel, initialName: string}) {
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(initialName);
	const {data: user, error, isLoading, isSuccess } = useQuery({queryKey: ['user'], queryFn: fetchMe});
	const queryClient = useQueryClient();

	const updateChannel = useMutation({
		mutationFn: (newValue: string) => updateChannelProperties(conv.id, "roomName" ,newValue),
		onSuccess: () => { 
			queryClient.invalidateQueries(['channels']);
			toast.success(`You updated the name of the channel!`) 
		},
		onError: () => { toast.error(`Error : cannot leave channel (tried to leave chan or group you weren't a part of)`) }
	});

	if (error) {
		return <div>Error</div>
	}
	if (isLoading || !isSuccess) {
		return <div>Loading...</div>
	}

	const handleTitleClick = () => {
		if (conv.ownerId === user.id) {
			setIsEditing(true);
		}
	  };

	const handleInputBlur = () => {
		setIsEditing(false);
		if (newTitle === '') {
			setNewTitle(initialName);
		}
	};

	const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && newTitle !== initialName && newTitle !== '') {
			setIsEditing(false);
			updateChannel.mutate(newTitle);
		}
	};

	return (
		<div>
			{isEditing ? (
			<input
				type="text"
				value={newTitle}
				onChange={(event) => setNewTitle(event.target.value)}
				onBlur={handleInputBlur}
				onKeyDown={handleInputKeyPress}
			/>
			) : (
				<h1 id="convo__name" onClick={handleTitleClick}>
					{newTitle}
					{
						conv.ownerId === user.id && 
						<FontAwesomeIcon icon={faPencil} />
					} 
				</h1>
				
			)}
		</div>
	);
};
