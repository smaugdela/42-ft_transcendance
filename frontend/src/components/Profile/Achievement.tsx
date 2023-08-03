import "../../styles/UserProfile.css"
import { IAchievement } from "../../api/types";
import { IUser } from "../../api/types";

let  achievementNumber = 0;

export function Achievement( props: { user: IUser }) {
	
	achievementNumber = 0;
	const userAchievements: IAchievement[] = props.user.achievements;	
	const displayAchievements = userAchievements?.map( achievement => {
		return 	<div key={achievement.id} 
					className="one-achievement"
					id={isAchievementCompleted(props.user, achievement.title) === true ? "completed_achievement" : "one-achievement"}>
					{/* <img src="../public/assets/baby-icon.png"/> */}
					<h3>{achievement.title}</h3>
					<h4>{achievement.description}</h4>
				</div>
	})
	return (
		<article id="achievements">
			<h1>ACHIEVEMENTS ({achievementNumber}/{userAchievements?.length})</h1>
			<div className="all-achievements">
				{displayAchievements}
			</div>
		</article>
	);
}

function isAchievementCompleted (user: IUser, title: string): boolean
{
	
	switch(title)
	{
		case "Baby steps":
		{
			if (!user.matchAsP1 && !user.matchAsP2)
				return false;
			else if(user.matchAsP1 && !user.matchAsP2)
			{
				const userGameCount = user.matchAsP1.length;
				if (userGameCount > 0)
				{
					achievementNumber++;
					return true;
				}
				return false;
			}
			else if(!user.matchAsP1 && user.matchAsP2)
			{
				const userGameCount = user.matchAsP2.length;
				if (userGameCount > 0)
				{
					achievementNumber++;
					return true;
				}
				return false;
			}
			else {
				const userGameCount = user.matchAsP1.length + user.matchAsP2.length;
				if (userGameCount > 0)
				{
					achievementNumber++;
					return true;
				}
				return false;
			}
		}
		case "Veteran":
		{
			if (!user.matchAsP1 && !user.matchAsP2)
				return false;
			else if(user.matchAsP1 && !user.matchAsP2)
			{
				const userGameCount = user.matchAsP1.length;
				if (userGameCount >= 10)
				{
					achievementNumber++;
					return true;
				}
				return false;
			}
			else if(!user.matchAsP1 && user.matchAsP2)
			{
				const userGameCount = user.matchAsP2.length;
				if (userGameCount >= 10)
				{
					achievementNumber++;
					return true;
				}
				return false;
			}
			else {
				const userGameCount = user.matchAsP1.length + user.matchAsP2.length;
				if (userGameCount >= 10)
				{
					achievementNumber++;
					return true;
				}
				return false;
			}
		}
		case "Easy peasy lemon squeezy":
		{
			if (!user.matchAsP1)
				return false;
			const userWinCount = user.matchAsP1.length;
			if (userWinCount >= 3)
			{
				achievementNumber++;
				return true;
			}
			return false; 
		}
		case "It's my lil bro playing":
			{
				if (!user.matchAsP2)
					return false;
				const userLooseCount = user.matchAsP2.length;
				if (userLooseCount >= 3)
				{
					achievementNumber++;
					return true;
				}
					return false;
			}
		case "Social butterfly":
		{
			if (!user.friendsList)
				return false
			const userHasFriend = user.friendsList.length;
			if (userHasFriend >= 3)
			{
				achievementNumber++;
				return true
			}
				return false 
		}
		case "Influencer":
		{
			if (!user.friendsList)
				return false
			const userHasFriend = user.friendsList.length;
			if (userHasFriend >= 10)
			{
				achievementNumber++;
				return true
			}
				return false 
		}
		case "Cosmetic change":
		{
			if (!user.avatar)
				return false
			const userChangedPp = user.avatar;
			if (userChangedPp !== "/assets/avatar1.png" && userChangedPp !== "/assets/avatar2.png" && userChangedPp !== "/assets/avatar3.png")
			{
				achievementNumber++;
				return true 
			}
			return false 
		}
		case "Safety first":
		{
			if (user.enabled2FA == true)
			{
				achievementNumber++;
				return true;
			}
			return false;
		}
		case "My safe place":
		{
			if (user.ownerChans && user.ownerChans.length >= 1) {
				achievementNumber++;
				return true;
			}
			else
				return false;
		}
		case "Writer soul":
		{
			if (!user.bio)
				return false;

			achievementNumber++;
			return true; 
		}
		case "Roland Garros":
		{
			if (!user.aces)
				return false
			const userHasAce = user.aces;
			if (userHasAce >= 3)
			{
				achievementNumber++;
				return true
			}
				return false 
		}
		case "WINNER WINNER CHICKEN DINER":
		{
			if (!user.rank)
				return false
			const userRank = user.rank;
			if (userRank === 1)
			{
				achievementNumber++;
				return true
			}
				return false 
			}
		default:
			return false;
	}
	}

