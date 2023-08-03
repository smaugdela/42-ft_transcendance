import { useEffect } from 'react';
import "../../styles/Social.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faUserMinus} from '@fortawesome/free-solid-svg-icons';
import { removeFriend, blockUser } from "../../api/APIHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../api/types";

export function AllFriends( props: { profilesToDisplay : IUser[], userIsSuccess: boolean }) {
        const queryClient = useQueryClient();
        const removefriend = useMutation({ 
            mutationFn: (id: number) => removeFriend(id),
            onSuccess: () => {
                queryClient.invalidateQueries(['user']);	
            }
        });
        const blockuser = useMutation({ 
            mutationFn: (nickname: string) => blockUser(nickname),
            onSuccess: () => {
                queryClient.invalidateQueries(['user']);	
            }
        });
        useEffect(() => {
            if (props.userIsSuccess) {
              queryClient.invalidateQueries(['user']); // Refetch the user data if the userIsSuccess prop changes
            }
          }, [props.userIsSuccess]);
    
        const handleremoveFriend = (id: number) => {
            removefriend.mutate(id);
        }
        const handleblockuser = (nickname: string) => {
            blockuser.mutate(nickname);
        }
        const displayProfiles = props.profilesToDisplay.map(profile => {
            return <div key={profile.id} className="profile">
                        <div className="img-container">
                            <img 
                            src={profile.avatar}
                            alt={profile.nickname}
                            />
                        </div>
                        <div className="profile_infos_allfriends">
                            <h5>{profile.nickname}</h5>
                            <div><FontAwesomeIcon icon={faUserMinus} onClick={() =>handleremoveFriend(profile.id)}/></div>
                            <div><FontAwesomeIcon icon={faBan} onClick={() =>handleblockuser(profile.nickname)}/></div>			
                        </div>
            </div>
        })
        return (
            <div className="all-current">
                {displayProfiles}
            </div>
        );
};


export default AllFriends
