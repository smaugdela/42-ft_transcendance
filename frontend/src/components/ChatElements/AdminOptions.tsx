import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faGamepad, faBan, faPersonWalkingArrowRight, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { fetchMe } from '../../api/APIHandler';
import { IChannel } from '../../api/types';

export function AdminOptions({ channel }: { channel: IChannel}) {
	const [enableOptions, setEnableOptions] = useState<boolean>(false);
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(false);
	const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchMe });

	useEffect(() => {
		const isAdmin = channel.admin.filter((admin) => admin.nickname === userQuery.data?.nickname);
		if (isAdmin.length > 0) {
			setEnableOptions(true);
		}
	}, [channel.admin, userQuery.data]);

	const handleClick = () => {
		setToggleDisplay(!toggleDisplay);
	}

	if (userQuery.error) {
		return <div>Error</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess) {
		return <div>Loading...</div>
	}
	return (
	<>
		<FontAwesomeIcon icon={faGamepad} />
		{
			enableOptions === true &&
			<>
			<FontAwesomeIcon icon={faSquarePlus} onClick={handleClick}/>
			{
				toggleDisplay === true && 
				<>
					<FontAwesomeIcon icon={faBan} />
					<FontAwesomeIcon icon={faPersonWalkingArrowRight} />
					<FontAwesomeIcon icon={faCommentSlash} />
				</>
			}
			</>
		}
	</>
	);
}