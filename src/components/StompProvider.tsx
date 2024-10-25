// This class brought to you by Claude AI

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";

interface StompContextType {
	client: Client | null;
	connected: boolean;
	subscribe: (destination: string, callback: (message: IMessage) => void) => StompSubscription | undefined;
	publish: (destination: string, body: string) => void;
}

const StompContext = createContext<StompContextType | undefined>(undefined);

export function StompProvider({children}: {children: ReactNode}): ReactNode {
	const [client, setClient] = useState<Client | null>(null);
	const [connected, setConnected] = useState<boolean>(false);
	
	// Create a client and connect it
	useEffect(() => {
		const stompClient = new Client({
			webSocketFactory: () => new SockJS('http://localhost:8080/hello-world-ws'),
			reconnectDelay: 1000,
			onConnect: () => setConnected(true),
			onDisconnect: () => setConnected(false)
		});
		
		stompClient.activate();
		setClient(stompClient);
		
		// Return callback to end current socket
		return () => {
			if (stompClient.active) {
				stompClient.deactivate();
			}
		};
	}, []);
	
	const subscribe = (destination: string, callback: (message: IMessage) => void): StompSubscription | undefined => {
		if (client && connected) {
			return client.subscribe(destination, callback);
		}
	}
	
	const publish = (destination: string, body: string): void => {
		if (client && connected) {
			client.publish({destination, body});
		}
	}
	
	const contextVal: StompContextType = {
		client, connected, subscribe, publish
	};
	
	
	return (
		<StompContext.Provider value={contextVal}>
			{children}
		</StompContext.Provider>
	);
}

export function useStompClient(): StompContextType {
	const context = useContext(StompContext);
	if (!context) {
		throw new Error('useStompClient muse be used as a descendant of a StompProvider');
	}
	return context;
}

