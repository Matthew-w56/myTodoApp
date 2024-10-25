import { ReactNode, useEffect, useState } from "react";
import { useStompClient } from "./StompProvider";

// Component that shows a fallback screen until the server is ready to go.  Then, it shows the normal children.
function StompClientIsActiveGate({children, fallback}: {children: ReactNode, fallback: () => ReactNode}): ReactNode {
	const stompClient = useStompClient();
	const [serverReady, setServerReady] = useState(false);
	
	// Every time the client has a change, check to see if the server is ready now
	useEffect(() => {
		if (stompClient.connected) setServerReady(true);
	}, [stompClient]);
	
	// Show some other waiting screen until the server is ready to go
	if (serverReady) {
		return children;
	} else {
		// Only build fallback if it will end up being needed
		return fallback();
	}	
}

export default StompClientIsActiveGate;