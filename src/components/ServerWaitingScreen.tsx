import { ReactNode } from 'react';
import './ServerWaitingScreen.css';


function ServerWaitingScreen(): ReactNode {
	return (
		<div className="waiting-screen-wrapper">
			<h2 className="waiting-screen-title">Initializing App..</h2>
			<p className="waiting-screen-subtext">Please wait.  Expected wait time: 3 second(s)</p>
		</div>
	);
}

export default ServerWaitingScreen;