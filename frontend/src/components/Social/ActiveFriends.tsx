import "../../styles/Social.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../api/types";
import MessageUserBtn from '../Profile/MessageUserBtn';
import { fetchMe } from "../../api/APIHandler";

export function ActiveFriends( props: { profilesToDisplay : IUser[]}) {
        const queryClient = useQueryClient();
        const { data: loggedUser, error, isLoading, isSuccess } = useQuery({ queryKey: ['user'], queryFn: fetchMe});
        
        if (error) {
            return <div>Error</div>
        }
        if (isLoading || !isSuccess) {
            return <div>Loading...</div>
        }
        
        const loggedInUser: string = loggedUser.nickname;;
	
        const displayProfiles = props.profilesToDisplay.map(profile => {
            return <div key={profile.id} className="profile">
                        <div className="img-container">
                            <img 
                            src={profile.avatar}
                            alt={profile.nickname}
                            />
                        </div>
                        <div className="profile_infos">
                            <h5>{profile.nickname}</h5>
                            <MessageUserBtn loggedInUser={loggedInUser} userToContact={profile} />
                        </div>
            </div>
        })
        return (
            <div className="all-current">
                {displayProfiles}
            </div>
        );
};


export default ActiveFriends