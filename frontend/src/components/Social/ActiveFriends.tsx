import { useEffect, useState } from 'react';
import "../../styles/Social.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment} from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../api/types";
import MessageUserBtn from '../Profile/MessageUserBtn';
import { fetchMe } from "../../api/APIHandler";

export function ActiveFriends( props: { profilesToDisplay : IUser[]}) {
        // const queryClient = useQueryClient();
        // const removefriend = useMutation({ 
        //     mutationFn: (id: number) => removeFriend(id),
        //     onSuccess: () => {
        //         queryClient.invalidateQueries(['user']);	
        //     }
        // });
        // const blockuser = useMutation({ 
        //     mutationFn: (nickname: string) => blockUser(nickname),
        //     onSuccess: () => {
        //         queryClient.invalidateQueries(['user']);	
        //     }
        // });
        // useEffect(() => {
        //     if (props.userIsSuccess) {
        //       queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
        //     }
        //   }, [props.userIsSuccess]);
    
        // const handleremoveFriend = (id: number) => {
        //     removefriend.mutate(id);
        // }
        // const handleblockuser = (nickname: string) => {
        //     blockuser.mutate(nickname);
        // }

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
                            {/* <div><FontAwesomeIcon icon={faComment} /></div> */}
                            <MessageUserBtn loggedInUser={loggedInUser} userToContact={profile} />

                            {/* <div><FontAwesomeIcon icon={faBan} onClick={() =>handleblockuser(profile.nickname)}/></div>			 */}
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