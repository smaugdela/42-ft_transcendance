import "../styles/Avatar.css";
import { fetchMe } from "../api/APIHandler";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';

export default function Avatar() {
	const userQuery = useQuery({ queryKey: ['user'], queryFn: () => fetchMe()});
	
	if (userQuery.error instanceof Error){
		return <div>Error: {userQuery.error.message}</div>
	}
	if (userQuery.isLoading || !userQuery.isSuccess){
		return <div>Loading</div>
	}

	return (
		<div id="nav-avatar-icon">
			<Link className='link-profile' to="/settings">
			<img src={userQuery.data?.avatar} alt={userQuery.data?.nickname} id="nav_avatar"/>
			</Link>
			<div id="active-dot"></div>
		</div>
	);
};
 
  
