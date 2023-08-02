import "../styles/Avatar.css";
import { fetchMe,  checkIfLogged } from "../api/APIHandler";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { IsLoggedInContext } from "../context/contexts";
import { useContext } from "react";

export default function Avatar( {setLoggedIn }: {setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}) {
	
	const isLoggedIn = useContext(IsLoggedInContext);

	useEffect( () => {
		const fetchData = async () => {
			const userStatus = await checkIfLogged();
			setLoggedIn(userStatus);
		};
		
		fetchData();
		console.log('status', isLoggedIn);
		
	}, [setLoggedIn, isLoggedIn]);

	const userQuery = useQuery({ 
		queryKey: ['user'], 
		queryFn: () => fetchMe(),
	});
	
	if (userQuery.isError) {
		return <div>Error</div>
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
 
  
