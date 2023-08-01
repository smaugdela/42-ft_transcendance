import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/UserProfile.css"

export default function OneMainStat({ title, stat, icon } : {title: string, stat: number, icon: IconProp}) {
	
	return (
		<div className="one-stat">
			<div>
				<FontAwesomeIcon icon={icon} className="fa-icon"/>
			</div>
			<div  className="one-stat_txt">
				<h2>{stat}</h2>
				<h5>{title}</h5>
			</div>
		</div>
	);
}