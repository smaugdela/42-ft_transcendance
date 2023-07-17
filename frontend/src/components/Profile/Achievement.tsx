import "../../styles/UserProfile.css"
import { IAchievement } from "../../api/types";

export function Achievement( props: { userAchievements: IAchievement[] }) {
	
	const completedAchievements: number = props.userAchievements?.filter(elt => elt.fullfilled === true).length;
	
	const displayAchievements = props.userAchievements?.map( achievement => {
		return 	<div key={achievement.id} 
					className="one-achievement"
					id={achievement.fullfilled === true ? "completed_achievement" : "one-achievement"}>
					{/* <FontAwesomeIcon icon=`${achievement.icon}` className="fa-icon-achievements"/> */}
					<h3>{achievement.title}</h3>
					<h4>{achievement.description}</h4>
				</div>
	})
	return (
		<article id="achievements">
			<h1>ACHIEVEMENTS ({completedAchievements}/{props.userAchievements?.length})</h1>
			<div className="all-achievements">
				{displayAchievements}
			</div>
		</article>
	);
}