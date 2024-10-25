import { listen } from "@tauri-apps/api/event";
import { ReactNode, useEffect } from "react";
import { useStompClient } from "./StompProvider";


function TauriWindowEventListener(): ReactNode {
	const stompClient = useStompClient();
	
	useEffect(() => {
		// Usually the first mount gives a null client, while the server is still starting up.
		// So we use the useEffect and this IF statement to wait until we have a valid one.
		if (stompClient.connected) {
			let waitingListen = listen("tauri://close-requested", (_) => {
				// DOES send, but does NOT close server..
				stompClient.publish('/api/v1/killServer', '');
			});
			
			return () => {
				waitingListen.then((unlistenFunc) => unlistenFunc());
			};
		}
	}, [stompClient]);
	
	return (
		<></>
	);
}

export default TauriWindowEventListener;