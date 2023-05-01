import "../styles/StatDisplay.css"

export default function StatDisplay( props : { title: string, stat: number }) {
	
	let stat_theme: string | undefined = undefined;
	
	switch (props.title) {
		case "wins": 
			stat_theme = "stat_win";
			break;
		case "lose":
			stat_theme = "stat_lose"
			break;
	}
	return (
		<div className={`stat_container ${stat_theme}`} >
			<span>{props.stat}</span>
			<span>{props.title}</span>
		</div>
	);
}