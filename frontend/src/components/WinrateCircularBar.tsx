import "../styles/UserProfile.css"


export default function WinrateCircularBar(props : { winRate : number}) {

	let circularProgress = document.querySelector<HTMLElement>(".circular-progress");
	let progressValue = document.querySelector<HTMLElement>(".progress-value");

	let progressStartValue = 0;
	let speed = 50;

	let progress = setInterval(() => {
		progressStartValue++;
		
		if (progressValue)
			progressValue.innerHTML = `${progressStartValue}%`;
		if (circularProgress)
			circularProgress.style.background = `conic-gradient(rgba(98, 20, 104, 0.7) ${progressStartValue * 3.6}deg, #ededed 0deg)`;
		
		
		if (progressStartValue === props.winRate)
		{
			clearInterval(progress);
		}
	}, speed);

	return (
		<div className="circular-progress">
			<div className="winrate__content">
				<h5 className="winrate__title">Win Rate</h5>
				<span className="progress-value">0%</span>
			</div>
		</div>
	);
}